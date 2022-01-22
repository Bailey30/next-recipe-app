export default {
    name: "chef",
    title: "Chef",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Chef's name",
            type: "string",
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true
            }
        },
        {
            name: "bio",
            title: "Bio",
            type: "array",
            of: [
                {
                    title: "Block",
                    type: "block", //portable text editor - stores rich text as json - you can query it with grok
                    styles: [{ title: "Normal", value: "normal" }],
                    lists: []
                }
            ]
        }
    ]
}