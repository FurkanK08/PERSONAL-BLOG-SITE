import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    title: string;
    slug: string;
    summary: string;
    content: string; // MDX content as string
    date: Date;
    githubUrl?: string; // Optional
    liveUrl?: string; // Optional
    imageUrl?: string; // Optional cover image
    technologies: string[];
}


const ProjectSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        summary: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
        githubUrl: { type: String, required: false },
        liveUrl: { type: String, required: false },
        imageUrl: { type: String, required: false },
        technologies: { type: [String], default: [] },

    },
    { timestamps: true }
);

export const Project =
    mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
