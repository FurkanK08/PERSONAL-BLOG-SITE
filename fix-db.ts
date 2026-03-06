// Temporary script to fix Turkish characters in MongoDB SiteProfile
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function fixDB() {
    try {
        const conn = await mongoose.connect(MONGODB_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Use dynamic string literal for collection name or define schema
        const SiteProfile = mongoose.models.SiteProfile || mongoose.model('SiteProfile', new mongoose.Schema({}, { strict: false }));

        const profile = await SiteProfile.findOne();
        if (profile) {
            console.log('Found profile. Updating...');

            const fixedBio = "Karmaşık problemleri, ölçeklenebilir mimariler ve kullanıcı odaklı arayüzlerle çözüyorum. Fikirden canlıya, dijital ürünler geliştiriyorum.";
            const fixedSubtitle = "Modern Web Uygulamaları İnşa Eden";

            await SiteProfile.updateOne({ _id: profile._id }, {
                $set: {
                    bio: fixedBio,
                    subtitle: fixedSubtitle,
                    "timeline.0.title": "Web'e İlk Adım",
                    "timeline.0.desc": "HTML, CSS ve JavaScript öğrenerek ilk projelerimi oluşturdum.",
                    "timeline.1.desc": "Modern frontend framework'lerine geçiş yaparak portföy projeleri geliştirdim.",
                    "timeline.2.title": "Full-Stack Geliştirme",
                    "timeline.2.desc": "Node.js, MongoDB ve REST API tasarımıyla backend geliştirmeye başladım.",
                    "timeline.3.desc": "Gerçek dünya projelerinde çalışarak uzmanlık alanlarımı genişlettim."
                }
            });
            console.log('Profile updated successfully!');
        } else {
            console.log('No profile found to update.');
        }
    } catch (error) {
        console.error('Error fixing DB:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

fixDB();
