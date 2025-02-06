import useScrollToBottom from "~/hooks/useScrollToBottom";

interface GameBoardProps {
	BOARD_SIZE: number;
	playerPos: { x: number; y: number };
	obstacles: Array<{ x: number; y: number }>;
	powerups: Array<{ x: number; y: number }>;
	collectedPowerups: Array<{ x: number; y: number }>;
	PLAYER_IMG: string;
	POWERUP_IMG: string;
	OBSTACLE_IMG: string;
	EMPTY: string;
}

export const GameBoard = ({
	BOARD_SIZE,
	playerPos,
	obstacles,
	powerups,
	collectedPowerups,
	PLAYER_IMG,
	POWERUP_IMG,
	OBSTACLE_IMG,
	EMPTY,
}: GameBoardProps) => {
	useScrollToBottom([]);

	const renderBoard = () => {
		const board = [];
		for (let y = 0; y < BOARD_SIZE; y++) {
			const row = [];
			for (let x = 0; x < BOARD_SIZE; x++) {
				if (x === playerPos.x && y === playerPos.y) {
					row.push(
						<div className="flex h-8 w-8 items-center justify-center">
							<img
								src={PLAYER_IMG}
								alt="player"
								className="h-8 w-8 object-contain"
							/>
						</div>,
					);
				} else if (
					powerups.some((p) => p.x === x && p.y === y) &&
					!collectedPowerups.some((p) => p.x === x && p.y === y)
				) {
					row.push(
						<div className="flex h-8 w-8 items-center justify-center">
							<img
								src={POWERUP_IMG}
								alt="powerup"
								className="h-8 w-8 object-contain"
							/>
						</div>,
					);
				} else if (obstacles.some((obs) => obs.x === x && obs.y === y)) {
					row.push(
						<div className="flex h-8 w-8 items-center justify-center">
							<img
								src={OBSTACLE_IMG}
								alt="obstacle"
								className="h-8 w-8 object-contain"
							/>
						</div>,
					);
				} else {
					row.push(
						<div className="flex h-8 w-8 items-center justify-center">
							{EMPTY}
						</div>,
					);
				}
			}
			board.push(row);
		}
		return board;
	};

	return (
		<div className="flex flex-col">
			{renderBoard().map((row, i) => (
				<div key={i} className="flex items-center">
					{row.map((cell, j) => (
						<span key={j} className="text-2xl">
							{cell}
						</span>
					))}
				</div>
			))}
		</div>
	);
};
