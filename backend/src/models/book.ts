import { InferSchemaType, model, Schema } from "mongoose";

const bookSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    authors: { type: [String], required: true },
    review: { type: String },
    cover: { type: String, required: true },
    ebook: { type: String, required: true },
    genre: { type: String, required: true },
    downloads: { type: Number, required: true },
    subjects: { type: [String], required: true },
    languages: { type: [String], required: true },
}, { timestamps: true });

type Book = InferSchemaType<typeof bookSchema>;

export default model<Book>('Book', bookSchema);