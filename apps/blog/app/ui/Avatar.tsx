export const Avatar = ({ className }: { className: string }) => {
	return (
		<div className={`rounded-full ${className}`}>
			<img
				src="/me.png"
				className="rounded-full grayscale"
				alt="Franciszek Pawlak"
			/>
		</div>
	);
};
