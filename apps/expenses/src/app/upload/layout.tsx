import { AppShell } from "@/components/app-shell";

export default function UploadLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AppShell activeTab="upload">{children}</AppShell>;
}
