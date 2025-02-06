import { defineField, defineType } from "sanity";

export default defineType({
	name: "books",
	title: "Boooks",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
		}),
		defineField({
			name: "author",
			title: "Author",
			type: "string",
		}),
		defineField({
			name: "genre",
			title: "Genre",
			type: "string",
		}),
		defineField({
			name: "pages",
			title: "Pages",
			type: "string",
		}),
		defineField({
			name: "statisticsDate",
			title: "Statistics Date",
			type: "date",
			initialValue: () => new Date().toISOString().split("T")[0],
		}),
		defineField({
			name: "releaseDate",
			title: "Release date",
			type: "date",
			initialValue: () => new Date().toISOString().split("T")[0],
		}),
		defineField({
			name: "poster",
			title: "Poster Image",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "url",
			title: "URL",
			type: "url",
		}),
		defineField({
			name: "favorite",
			title: "Favorite",
			type: "boolean",
		}),
		defineField({
			name: "rate",
			title: "Rate",
			type: "number",
		}),
		defineField({
			name: "review",
			title: "Review",
			type: "array",
			of: [
				{
					type: "block",
				},
				{
					type: "image",
				},
			],
		}),
	],
});
