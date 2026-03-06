import connectDB from "@/lib/mongoose";
import { SiteProfile } from "@/models/SiteProfile";
import { Post } from "@/models/Post";
import { Project } from "@/models/Project";
import HomePage from "@/components/layout/HomePage";

export const dynamic = "force-dynamic";

const defaultProfile = {
  name: "Furkan K.", title: "Full-Stack Geliştirici",
  subtitle: "Modern Web Uygulamaları İnşa Eden",
  bio: "Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı arayüzlerle çözüyorum.",
  email: "", githubUrl: "", linkedinUrl: "", twitterUrl: "", cvUrl: "",
  skills: ["Next.js", "React", "Node.js", "TypeScript", "MongoDB", "Vanilla CSS"],
  titleWords: ["Full-Stack Geliştirici", "Frontend Developer", "Backend Developer", "UI Enthusiast"],
  avatarEmoji: "👨‍💻", avatarUrl: "",
};

export default async function Home() {
  let profile: any = defaultProfile;
  let posts: any[] = [];
  let projects: any[] = [];

  try {
    await connectDB();
    const [profileData, postsData, projectsData] = await Promise.all([
      SiteProfile.findOne({}).lean(),
      Post.find({}).sort({ date: -1 }).limit(3).lean(),
      Project.find({}).sort({ date: -1 }).limit(3).lean(),
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
  } catch (e) { /* DB bağlı değilse varsayılanları kullan */ }

  return <HomePage profile={profile} posts={posts} projects={projects} />;
}

