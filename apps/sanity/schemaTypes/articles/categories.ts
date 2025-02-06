import { defineField, defineType } from "sanity";

export default defineType({
	name: "categories",
	title: "Categories",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
		}),
	],
});
