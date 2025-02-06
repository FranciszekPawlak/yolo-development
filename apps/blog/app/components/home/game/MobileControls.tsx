interface MobileControlsProps {
	handleMove: (direction: "up" | "down" | "left" | "right") => void;
}

export const MobileControls = ({ handleMove }: MobileControlsProps) => (
	<div className="mt-4 grid grid-cols-3 gap-1 md:hidden">
		<div />
		<button
			type="button"
			onClick={() => handleMove("up")}
			className="size-[40px] rounded-lg bg-zinc-800 p-2 text-white text-xl"
			aria-label="Move up"
		>
			↑
		</button>
		<div />
		<button
			type="button"
			onClick={() => handleMove("left")}
			className="size-[40px] rounded-lg bg-zinc-800 p-2 text-white text-xl"
			aria-label="Move left"
		>
			←
		</button>
		<div />
		<button
			type="button"
			onClick={() => handleMove("right")}
			className="size-[40px] rounded-lg bg-zinc-800 p-2 text-white text-xl"
			aria-label="Move right"
		>
			→
		</button>
		<div />
		<button
			type="button"
			onClick={() => handleMove("down")}
			className="size-[40px] rounded-lg bg-zinc-800 p-2 text-white text-xl"
			aria-label="Move down"
		>
			↓
		</button>
		<div />
	</div>
);
