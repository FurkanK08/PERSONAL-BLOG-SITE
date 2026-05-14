import connectDB from "@/lib/mongoose";
import { Project as ProjectModel } from "@/models/Project";
import styles from "./projects.module.css";
import ProjectsGrid from "./ProjectsGrid";
import { Project } from "@/types";

export const metadata = {
    title: "Projeler — Furkan K.",
    description: "Geliştirdiğim projeler, kullandığım teknolojiler ve açık kaynak çalışmalarım.",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
    let projects: Project[] = [];
    try {
        await connectDB();
        const data = await ProjectModel.find({}).sort({ date: -1 }).lean();
        projects = JSON.parse(JSON.stringify(data));
    } catch (e) {
        console.error("Projects list fetch error:", e);
        projects = [];
    }

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Öne Çıkan Projeler.</h1>
                <p className={styles.subtitle}>
                    Araştırdığım, geliştirdiğim ve açık kaynağa sunduğum bazı ürünler ve çalışmalar.
                </p>
            </div>
            <ProjectsGrid projects={projects} />
        </div>
    );
}
