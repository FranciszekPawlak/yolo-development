import { useCallback, useEffect, useState } from "react";

export const useGameLogic = (BOARD_SIZE: number) => {
	const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
	const [won, setWon] = useState(false);
	const [obstacles, setObstacles] = useState<Array<{ x: number; y: number }>>(
		[],
	);
	const [powerups, setPowerups] = useState<Array<{ x: number; y: number }>>([]);

	useEffect(() => {
		const obs = [];
		const numObstacles = 8;
		while (obs.length < numObstacles) {
			const x = Math.floor(Math.random() * BOARD_SIZE);
			const y = Math.floor(Math.random() * BOARD_SIZE);
			if ((x !== 0 || y !== 0) && !obs.some((o) => o.x === x && o.y === y)) {
				obs.push({ x, y });
			}
		}
		setObstacles(obs);

		const pups = [];
		const numPowerups = 8;
		while (pups.length < numPowerups) {
			const x = Math.floor(Math.random() * BOARD_SIZE);
			const y = Math.floor(Math.random() * BOARD_SIZE);
			if ((x !== 0 || y !== 0) && !pups.some((p) => p.x === x && p.y === y)) {
				pups.push({ x, y });
			}
		}
		setPowerups(pups);

		setPlayerPos({ x: 0, y: 0 });
		setWon(false);
		setCollectedPowerups([]);
	}, [BOARD_SIZE]);

	const [collectedPowerups, setCollectedPowerups] = useState<
		Array<{ x: number; y: number }>
	>([]);

	const handleMove = useCallback(
		(direction: "up" | "down" | "left" | "right") => {
			if (won) return;

			const newPos = { ...playerPos };
			switch (direction) {
				case "up":
					if (newPos.y > 0) newPos.y--;
					break;
				case "down":
					if (newPos.y < BOARD_SIZE - 1) newPos.y++;
					break;
				case "left":
					if (newPos.x > 0) newPos.x--;
					break;
				case "right":
					if (newPos.x < BOARD_SIZE - 1) newPos.x++;
					break;
			}

			const isObstacle = obstacles.some(
				(obs) => obs.x === newPos.x && obs.y === newPos.y,
			);
			const isPowerup = powerups.some(
				(p) => p.x === newPos.x && p.y === newPos.y,
			);
			const isCollected = collectedPowerups.some(
				(p) => p.x === newPos.x && p.y === newPos.y,
			);

			if (!isObstacle || (isPowerup && !isCollected)) {
				setPlayerPos(newPos);

				const powerup = powerups.find(
					(p) => p.x === newPos.x && p.y === newPos.y,
				);

				if (powerup && !isCollected) {
					setCollectedPowerups([...collectedPowerups, powerup]);

					if (collectedPowerups.length + 1 === powerups.length) {
						setWon(true);
					}
				}
			}
		},
		[obstacles, playerPos, powerups, won, collectedPowerups],
	);

	return {
		playerPos,
		obstacles,
		powerups,
		collectedPowerups,
		won,
		handleMove,
	};
};
