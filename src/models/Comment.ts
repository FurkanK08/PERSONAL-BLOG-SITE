import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    postSlug: string;
    name: string;
    content: string;
    isApproved: boolean; // Admin onayı gereksinimi
    createdAt: Date;
}

const CommentSchema: Schema = new Schema(
    {
        postSlug: { type: String, required: true, index: true },
        name: { type: String, required: true },
        content: { type: String, required: true },
        isApproved: { type: Boolean, default: false }, // Varsayılan olarak onaysız!
    },
    { timestamps: true }
);

export const Comment =
    mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
