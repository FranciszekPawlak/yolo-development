import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			authorization: {
				params: {
					scope: "openid email profile https://www.googleapis.com/auth/drive",
					access_type: "offline",
					prompt: "consent",
				},
			},
		}),
	],
	callbacks: {
		async signIn({ profile }) {
			return profile?.email === "box@franciszekpawlak.pl";
		},
		async jwt({ token, account }) {
			if (account) {
				return {
					...token,
					access_token: account.access_token,
					expires_at: account.expires_at,
					refresh_token: account.refresh_token,
				};
			}

			if (Date.now() < (token.expires_at as number) * 1000) {
				return token;
			}

			// Access token expired -- refresh it
			if (!token.refresh_token) throw new TypeError("Missing refresh_token");

			try {
				const response = await fetch("https://oauth2.googleapis.com/token", {
					method: "POST",
					body: new URLSearchParams({
						client_id: process.env.AUTH_GOOGLE_ID ?? "",
						client_secret: process.env.AUTH_GOOGLE_SECRET ?? "",
						grant_type: "refresh_token",
						refresh_token: token.refresh_token as string,
					}),
				});

				const tokens = await response.json();
				if (!response.ok) throw tokens;

				return {
					...token,
					access_token: tokens.access_token,
					expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
					refresh_token: tokens.refresh_token ?? token.refresh_token,
				};
			} catch (error) {
				console.error("Error refreshing access_token", error);
				return { ...token, error: "RefreshTokenError" as const };
			}
		},
		async session({ session, token }) {
			return {
				...session,
				accessToken: token.access_token as string,
				error: token.error as string | undefined,
			};
		},
	},
});

declare module "next-auth" {
	interface Session {
		accessToken: string;
		error?: "RefreshTokenError";
	}
}
