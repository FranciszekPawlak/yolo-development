import { Avatar } from "../../ui/Avatar";

export default function Me() {
	return (
		<div className="flex h-[75vh] flex-col items-center justify-center">
			<Avatar className="w-[200px] lg:w-[300px]" />
			<h1 className="mt-8 text-center font-gothic text-6xl text-white">
				Franciszek Pawlak
			</h1>
			<div className="grid grid-cols-2 md:flex md:w-2/3 md:justify-around">
				<p className="mt-2 text-center font-montserrat text-sm text-white duration-500 hover:scale-110 lg:text-lg">
					#YOLODevelopment
				</p>
				<p className="mt-2 text-center font-montserrat text-sm text-white duration-500 hover:scale-110 lg:text-lg">
					#ShapeUp
				</p>
				<p className="mt-2 text-center font-montserrat text-sm text-white duration-500 hover:scale-110 lg:text-lg">
					#FullStack
				</p>
				<p className="mt-2 text-center font-montserrat text-sm text-white duration-500 hover:scale-110 lg:text-lg">
					#Marketplatz
				</p>
			</div>
		</div>
	);
}
