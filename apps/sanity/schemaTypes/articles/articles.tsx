import { defineField, defineType } from "sanity";

export default defineType({
	name: "articles",
	title: "Articles",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
		}),
		defineField({
			name: "type",
			title: "Type",
			type: "string",
			options: {
				list: [
					{ title: "Photos", value: "photos" },
					{ title: "Tech", value: "tech" },
				],
				layout: "dropdown",
			},
			initialValue: "photos",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "categories",
			title: "Categories",
			type: "array",
			of: [{ type: "reference", to: { type: "categories" } }],
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			of: [
				{
					type: "block",
				},
				{
					type: "image",
					fields: [
						{
							name: "alt",
							type: "string",
							title: "Alternative text",
						},
						{
							name: "description",
							type: "string",
							title: "Image description",
							description: "Text will display under the image.",
						},
					],
				},
			],
		}),
	],
});
