import me from "/me_alternative.jpg";

export const Avatar = ({ className }: { className: string }) => {
	return (
		<div className={`rounded-full ${className}`}>
			<img
				src={me}
				className="rounded-full grayscale"
				alt="Franciszek Pawlak"
			/>
		</div>
	);
};
