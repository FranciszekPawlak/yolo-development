import { createClient } from "@sanity/client";

export const client = createClient({
	projectId: "ydcw5vpr",
	dataset: "production",
	apiVersion: "2024-01-01",
	useCdn: false,
});
