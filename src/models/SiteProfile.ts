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
    titleWords: string[]; // Typewriter animasyonu için dönen kelimeler
    avatarEmoji: string;
    avatarUrl: string; // Cloudinary resim URL'si
    timeline: {
        year: string;
        title: string;
        desc: string;
        icon: string;
    }[];
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
        titleWords: { type: [String], default: ["Full-Stack Geliştirici", "Frontend Developer", "Backend Developer", "UI Enthusiast"] },
        avatarEmoji: { type: String, default: "👨‍💻" },
        avatarUrl: { type: String, default: "" }, // Cloudinary'ye yüklenen resmin URL'si
        timeline: {
            type: [
                {
                    year: { type: String },
                    title: { type: String },
                    desc: { type: String },
                    icon: { type: String, default: "Circle" },
                }
            ],
            default: [
                { year: "2022", title: "Web'e İlk Adım", desc: "HTML, CSS ve JavaScript öğrenerek ilk projelerimi oluşturdum.", icon: "Globe" },
                { year: "2023", title: "React & Next.js", desc: "Modern frontend framework'lerine geçiş yaparak portföy projeleri geliştirdim.", icon: "Code2" },
                { year: "2024", title: "Full-Stack Geliştirme", desc: "Node.js, MongoDB ve REST API tasarımıyla backend geliştirmeye başladım.", icon: "Zap" },
                { year: "2025", title: "Profesyonel Projeler", desc: "Gerçek dünya projelerinde çalışarak uzmanlık alanlarımı genişlettim.", icon: "Terminal" },
                { year: "2026", title: "Sürekli Gelişim", desc: "TypeScript, Cloud servisleri ve modern web teknolojileri üzerine çalışmaya devam ediyorum.", icon: "BookOpen" }
            ]
        },
    },

    { timestamps: true }
);

export const SiteProfile =
    mongoose.models.SiteProfile ||
    mongoose.model<ISiteProfile>("SiteProfile", SiteProfileSchema);
