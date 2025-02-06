import { useEffect } from "react";

export default function useScrollToBottom(dependencies: React.DependencyList) {
	useEffect(() => {
		const scrollToBottom = () => {
			const element = document.querySelector("html");
			if (element) {
				element.scrollTo({
					top: element.scrollHeight,
					behavior: "smooth",
				});
			}
		};

		scrollToBottom();
	}, dependencies);
}
