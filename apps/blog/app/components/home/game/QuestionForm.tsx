import { useEffect, useState } from "react";
import useScrollToBottom from "~/hooks/useScrollToBottom";

interface QuestionFormProps {
	onAnswer: () => void;
	handleGameOver: () => void;
}

const COUNTDOWN_TIME = 24;

export const QuestionForm = ({
	onAnswer,
	handleGameOver,
}: QuestionFormProps) => {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isAsking, setIsAsking] = useState(false);
	const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
	const [isCountingDown, setIsCountingDown] = useState(false);
	useScrollToBottom([]);
	useScrollToBottom([answer]);

	const askChat = async (question: string) => {
		const params = new URLSearchParams({
			question,
		});

		const response = await fetch(`/api/openai-ask?${params}`);
		const result = await response.json();
		return result;
	};

	const handleAskQuestion = async () => {
		if (!question.trim()) return;

		setIsAsking(true);
		const result = await askChat(question);
		setAnswer(result.data);
		setIsAsking(false);
		onAnswer();
		setIsCountingDown(true);
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isCountingDown && countdown > 0) {
			timer = setTimeout(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		} else if (countdown === 0) {
			setIsCountingDown(false);
			handleGameOver();
		}

		return () => clearTimeout(timer);
	}, [isCountingDown, countdown]);

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<div className="mt-4 flex w-full flex-col gap-2 md:w-1/2">
				<textarea
					placeholder="???"
					id="question"
					value={question}
					onChange={(e) => setQuestion(e.target.value.slice(0, 300))}
					className="w-full rounded-lg bg-zinc-800 p-4 font-montserrat text-sm text-white"
					maxLength={300}
					minLength={10}
					rows={3}
					disabled={answer !== ""}
				/>
				<div className="text-right font-montserrat text-xs text-zinc-400">
					{question.length}/300 {question.length < 10 && "(min 10 characters)"}
				</div>
				{!answer && (
					<button
						type="button"
						onClick={handleAskQuestion}
						disabled={isAsking || !question.trim() || question.length < 10}
						className="rounded-lg bg-zinc-800 px-4 py-2 font-montserrat text-sm transition-colors hover:bg-zinc-700 disabled:opacity-50"
					>
						{isAsking ? "..." : "???"}
					</button>
				)}
				{answer && (
					<div className="mt-2 rounded-lg bg-zinc-800/50 p-4 font-montserrat text-sm">
						{answer}
					</div>
				)}
				{isCountingDown && (
					<div className="mt-2 text-center font-montserrat text-red-500 text-sm">
						{countdown}
					</div>
				)}
			</div>
		</div>
	);
};
