import connectDB from "@/lib/mongoose";
import { SiteProfile } from "@/models/SiteProfile";
import { Post } from "@/models/Post";
import { Project } from "@/models/Project";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Twitter, Mail, Download, Terminal, ExternalLink } from "lucide-react";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Profil, son 3 blog ve son 3 proje - paralel çek
  let profile: any = { name: "Furkan K.", title: "Full-Stack Geliştirici", subtitle: "Modern Web Uygulamaları İnşa Eden", bio: "Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı arayüzlerle çözüyorum.", email: "", githubUrl: "", linkedinUrl: "", twitterUrl: "", cvUrl: "", skills: ["Next.js", "React", "Node.js", "TypeScript", "MongoDB"], avatarEmoji: "👨‍💻" };
  let posts: any[] = [];
  let projects: any[] = [];

  try {
    await connectDB();
    const [profileData, postsData, projectsData] = await Promise.all([
      SiteProfile.findOne({}).lean(),
      Post.find({}).sort({ date: -1 }).limit(3).lean(),
      Project.find({}).sort({ date: -1 }).limit(3).lean(),
    ]);
    if (profileData) profile = profileData;
    posts = postsData as any[];
    projects = projectsData as any[];
  } catch (e) { /* DB bağlı değilse varsayılanları kullan */ }

  return (
    <div className={styles.page}>
      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroBadge}>
            <Terminal size={15} />
            <span>Sistemi ve Kodları İnşa Eden Güç</span>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.avatarCol}>
              <div className={styles.avatarRing}>
                <div className={styles.avatar}>{profile.avatarEmoji}</div>
              </div>
              <div className={styles.socialPills}>
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.socialPill} aria-label="GitHub">
                    <Github size={18} />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialPill} aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.socialPill} aria-label="Twitter/X">
                    <Twitter size={18} />
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className={styles.socialPill} aria-label="E-Posta">
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className={styles.textCol}>
              <p className={styles.subtitle}>{profile.subtitle}</p>
              <h1 className={styles.headline}>
                <span className={styles.highlight}>{profile.name}</span> — {profile.title}
              </h1>
              <p className={styles.bio}>{profile.bio}</p>

              <div className={styles.ctaRow}>
                <Link href="/projects" className={styles.primaryCta}>
                  Projelerimi İncele <ArrowRight size={18} />
                </Link>
                {profile.cvUrl ? (
                  <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
                    <Download size={16} /> CV İndir
                  </a>
                ) : profile.email ? (
                  <a href={`mailto:${profile.email}`} className={styles.secondaryCta}>
                    <Mail size={16} /> İletişime Geç
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* Yetenekler */}
          {profile.skills && profile.skills.length > 0 && (
            <div className={styles.skillsRow}>
              {profile.skills.map((skill: string) => (
                <span key={skill} className={styles.skill}>{skill}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ÖNE ÇIKAN PROJELER ─── */}
      {projects.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Öne Çıkan Projeler</h2>
              <Link href="/projects" className={styles.seeAll}>Tümünü Gör <ArrowRight size={14} /></Link>
            </div>
            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className={styles.projectCard}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <ExternalLink size={16} className={styles.cardIcon} />
                  </div>
                  <p className={styles.cardDesc}>{project.summary}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className={styles.tagRow}>
                      {project.technologies.slice(0, 4).map((t: string) => (
                        <span key={t} className={styles.tag}>{t}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SON YAZILAR ─── */}
      {posts.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Son Yazılar</h2>
              <Link href="/blog" className={styles.seeAll}>Tümünü Gör <ArrowRight size={14} /></Link>
            </div>
            <div className={styles.postList}>
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postRow}>
                  <div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postDesc}>{post.summary}</p>
                  </div>
                  <div className={styles.postMeta}>
                    <time>{new Date(post.date).toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" })}</time>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── İLETİŞİM CTA ─── */}
      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactBox}>
            <h2 className={styles.contactTitle}>Birlikte bir şeyler inşa edelim.</h2>
            <p className={styles.contactSub}>
              Proje fikrin mi var? Bir konuyu tartışmak mı istiyorsun? Ulaş.
            </p>
            <div className={styles.contactBtns}>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className={styles.primaryCta}>
                  <Mail size={18} /> E-Posta Gönder
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
                  <Github size={18} /> GitHub&apos;ı Ziyaret Et
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
