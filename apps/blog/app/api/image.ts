import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export const getImage = (source: any) => {
	return builder.image(source);
};
