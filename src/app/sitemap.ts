import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongoose';
import { Post } from '@/models/Post';
import { Project } from '@/models/Project';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://furkankeles.vercel.app";

    try {
        await connectDB();

        // Sadece slug ve tarih (createdAt/updatedAt) alanlarını getir (Performans için)
        const posts = await Post.find({}, 'slug updatedAt createdAt');
        const projects = await Project.find({}, 'slug updatedAt createdAt');

        const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt || post.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
            url: `${baseUrl}/projects/${project.slug}`,
            lastModified: project.updatedAt || project.createdAt || new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));

        const staticRoutes: MetadataRoute.Sitemap = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 1.0,
            },
            {
                url: `${baseUrl}/projects`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date(),
                changeFrequency: 'yearly' as const,
                priority: 0.6,
            },
        ];

        return [...staticRoutes, ...postUrls, ...projectUrls];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        // Fallback dön, DB bağlanamazsa bile statik kısımlar çalışsın
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
            }
        ];
    }
}
