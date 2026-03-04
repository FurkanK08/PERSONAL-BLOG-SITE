import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    slug: string;
    summary: string;
    content: string; // MDX content as string
    date: Date;
    imageUrl?: string;
}


const PostSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        summary: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
        imageUrl: { type: String, required: false },

    },
    { timestamps: true }
);

export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
