import connectDB from "@/lib/mongoose";
import { SiteProfile } from "@/models/SiteProfile";
import { Post as PostModel } from "@/models/Post";
import { Project as ProjectModel } from "@/models/Project";
import HomePage from "@/components/layout/HomePage";
import { Profile, Post, Project } from "@/types";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600; // Cache for 1 hour

const defaultProfile: Profile = {
  name: "Furkan K.", title: "Full-Stack Geliştirici",
  subtitle: "Modern Web Uygulamaları İnşa Eden",
  bio: "Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı arayüzlerle çözüyorum.",
  email: "", githubUrl: "", linkedinUrl: "", twitterUrl: "", cvUrl: "",
  skills: ["Next.js", "React", "Node.js", "TypeScript", "MongoDB", "Vanilla CSS"],
  titleWords: ["Full-Stack Geliştirici", "Frontend Developer", "Backend Developer", "UI Enthusiast"],
  avatarEmoji: "👨‍💻", avatarUrl: "",
};

export default async function Home() {
  let profile: Profile = defaultProfile;
  let posts: Post[] = [];
  let projects: Project[] = [];

  try {
    await connectDB();
    const [profileData, postsData, projectsData] = await Promise.all([
      SiteProfile.findOne({}).lean(),
      PostModel.find({}).sort({ date: -1 }).limit(3).lean(),
      ProjectModel.find({}).sort({ date: -1 }).limit(3).lean(),
    ]);

    // Mongoose objelerini plain JS'e çevir (Client Component'e geçmek için)
    if (profileData) {
      profile = JSON.parse(JSON.stringify(profileData));
      // Türkçe karakter kontrolü: bozuk kaydedilmişse defaultProfile'dan düzelt
      const hasTurkish = (s: string) => /[çğıöşüÇĞİÖŞÜ]/.test(s);
      if (profile.bio && !hasTurkish(profile.bio)) profile.bio = defaultProfile.bio;
      if (profile.subtitle && !hasTurkish(profile.subtitle)) profile.subtitle = defaultProfile.subtitle;
    }
    posts = JSON.parse(JSON.stringify(postsData));
    projects = JSON.parse(JSON.stringify(projectsData));
  } catch (e) {
    console.error("Home data fetch error:", e);
    /* DB bağlı değilse varsayılanları kullan */
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "url": "https://furkankeles.vercel.app",
    "jobTitle": profile.title,
    "description": profile.bio,
    "sameAs": [
      profile.githubUrl,
      profile.linkedinUrl,
      profile.twitterUrl
    ].filter(Boolean)
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <HomePage profile={profile} posts={posts} projects={projects} />
    </>
  );
}

