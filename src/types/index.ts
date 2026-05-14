export interface Profile {
    name: string;
    title: string;
    subtitle: string;
    bio: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    cvUrl: string;
    skills: string[];
    titleWords: string[];
    avatarEmoji: string;
    avatarUrl: string;
    timeline?: TimelineItem[];
}

export interface TimelineItem {
    year: string;
    title: string;
    desc: string;
    icon?: string;
}

export interface Post {
    title: string;
    slug: string;
    summary: string;
    content: string;
    date: string;
    imageUrl?: string;
    externalUrl?: string;
    tags: string[];
    category: string;
}

export interface Project {
    title: string;
    slug: string;
    summary: string;
    content: string;
    date: string;
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    technologies: string[];
}
