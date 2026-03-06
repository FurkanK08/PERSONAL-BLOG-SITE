import connectDB from "@/lib/mongoose";
import { Project } from "@/models/Project";
import styles from "./projects.module.css";
import ProjectsGrid from "./ProjectsGrid";

export const metadata = {
    title: "Projeler — Furkan K.",
    description: "Geliştirdiğim projeler, kullandığım teknolojiler ve açık kaynak çalışmalarım.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    let projects: any[] = [];
    try {
        await connectDB();
        projects = await Project.find({}).sort({ date: -1 }).lean() as any[];
        projects = JSON.parse(JSON.stringify(projects));
    } catch (e) {
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
