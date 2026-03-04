import mongoose, { Schema, Document } from "mongoose";

export interface ISiteProfile extends Document {
    name: string;
    title: string;
    bio: string;
    subtitle: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    cvUrl: string;
    skills: string[];
    avatarEmoji: string;
    avatarUrl: string; // Cloudinary resim URL'si
}

const SiteProfileSchema: Schema = new Schema(
    {
        name: { type: String, default: "Furkan K." },
        title: { type: String, default: "Full-Stack Geliştirici" },
        subtitle: { type: String, default: "Modern Web Uygulamaları İnşa Eden" },
        bio: {
            type: String,
            default:
                "Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı arayüzlerle çözüyorum. Fikirden canlıya, dijital ürünler geliştiriyorum.",
        },
        email: { type: String, default: "" },
        githubUrl: { type: String, default: "" },
        linkedinUrl: { type: String, default: "" },
        twitterUrl: { type: String, default: "" },
        cvUrl: { type: String, default: "" },
        skills: { type: [String], default: ["Next.js", "React", "Node.js", "TypeScript", "MongoDB"] },
        avatarEmoji: { type: String, default: "👨‍💻" },
        avatarUrl: { type: String, default: "" }, // Cloudinary'ye yüklenen resmin URL'si
    },
    { timestamps: true }
);

export const SiteProfile =
    mongoose.models.SiteProfile ||
    mongoose.model<ISiteProfile>("SiteProfile", SiteProfileSchema);
