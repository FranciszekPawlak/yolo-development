import type { AiResult } from "~/types";

interface IProps {
	result: AiResult;
}

export const Fact = ({ result }: IProps) => {
	return (
		<div className="my-16 flex h-screen w-full items-center justify-center lg:h-[85vh]">
			<div
				style={{
					backgroundImage: "url('/war.jpg')",
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
				className="flex max-w-2xl flex-col items-center justify-center rounded-xl px-8 py-16 text-center"
			>
				<h2 className="mb-8 font-gothic text-5xl">
					<span className="mix-blend-plus-lighter grayscale">✨</span>
					Ai Hardcore of the day
				</h2>
				<article className="font-montserrat text-2xl">
					{result.error ?? result.data}
				</article>
			</div>
		</div>
	);
};
