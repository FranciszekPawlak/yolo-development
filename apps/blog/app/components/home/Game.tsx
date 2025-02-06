import { useEffect, useRef, useState } from "react";
import { GameBoard } from "./game/GameBoard";
import { MobileControls } from "./game/MobileControls";
import { QuestionForm } from "./game/QuestionForm";
import { useGameLogic } from "./game/useGameLogic";

const BOARD_SIZE_DESKTOP = 12;
const BOARD_SIZE_MOBILE = 10;
const PLAYER_IMG = "/saw2.png";
const EMPTY = "⬛";
const OBSTACLE_IMG = "/chainsaw.png";
const POWERUP_IMG = "/syringe.png";
const COOLDOWN_TIME = 259200000; // 3 dni w milisekundach (3 * 24 * 60 * 60 * 1000)
// const COOLDOWN_TIME = 10000; //10 sekund
const STORAGE_KEY = "last_game_answer_time";

export const Game = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [canPlay, setCanPlay] = useState(true);
	const boardRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [gameOver, setGameOver] = useState(false);

	const { playerPos, obstacles, powerups, collectedPowerups, won, handleMove } =
		useGameLogic(isMobile ? BOARD_SIZE_MOBILE : BOARD_SIZE_DESKTOP);

	const handleGameOver = () => {
		setGameOver(true);
	};

	const handleGameComplete = () => {
		localStorage.setItem(STORAGE_KEY, Date.now().toString());
		setCanPlay(false);
	};

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const lastAnswerTime = localStorage.getItem(STORAGE_KEY);
		if (lastAnswerTime) {
			const timePassed = Date.now() - Number.parseInt(lastAnswerTime);
			if (timePassed < COOLDOWN_TIME) {
				setCanPlay(false);
				const remainingTime = COOLDOWN_TIME - timePassed;
				setTimeout(() => setCanPlay(true), remainingTime);
			}
		}
	}, []);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (won || !isVisible) return;

			switch (e.key) {
				case "ArrowUp":
					handleMove("up");
					break;
				case "ArrowDown":
					handleMove("down");
					break;
				case "ArrowLeft":
					handleMove("left");
					break;
				case "ArrowRight":
					handleMove("right");
					break;
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [won, isVisible, handleMove]);

	if (gameOver || (!isVisible && !canPlay)) {
		return null;
	}

	return (
		<div className="flex h-screen flex-col items-center justify-center ">
			{!isVisible && canPlay && (
				<img
					alt="saw"
					aria-label="play game"
					src="/saw.png"
					onClick={() => setIsVisible(true)}
					onKeyDown={(e) => e.key === "Enter" && setIsVisible(true)}
					className="mb-8 h-[200px] cursor-pointer opacity-10 duration-1000 hover:scale-125 hover:opacity-25"
				/>
			)}

			{isVisible && (
				<>
					{!won && (
						<div ref={boardRef} className="scale-[0.8] md:scale-100">
							<GameBoard
								BOARD_SIZE={isMobile ? BOARD_SIZE_MOBILE : BOARD_SIZE_DESKTOP}
								playerPos={playerPos}
								obstacles={obstacles}
								powerups={powerups}
								collectedPowerups={collectedPowerups}
								PLAYER_IMG={PLAYER_IMG}
								POWERUP_IMG={POWERUP_IMG}
								OBSTACLE_IMG={OBSTACLE_IMG}
								EMPTY={EMPTY}
							/>
						</div>
					)}
					{won && (
						<QuestionForm
							onAnswer={handleGameComplete}
							handleGameOver={handleGameOver}
						/>
					)}
					{!won && <MobileControls handleMove={handleMove} />}
				</>
			)}
		</div>
	);
};
