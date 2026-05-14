const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:Fkeles123.@cluster0.uhejcrq.mongodb.net/portfolio-blog?appName=Cluster0";

async function seedTags() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
            title: String,
            tags: [String],
            category: String
        }));

        const posts = await Post.find({});
        for (const post of posts) {
            const dummyTags = ["React", "Next.js", "JavaScript", "Web Development", "Node.js", "CSS", "TypeScript"];
            // Shuffle and pick 2-4 tags
            const selectedTags = dummyTags.sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 3));
            
            post.tags = selectedTags;
            if (!post.category) post.category = "Genel";
            await post.save();
            console.log(`Updated tags for: ${post.title} -> ${selectedTags.join(', ')}`);
        }

        console.log("Seed complete");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedTags();
