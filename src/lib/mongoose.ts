import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error(
        "Lütfen .env.local dosyasına MONGODB_URI ortam değişkenini ekleyin."
    );
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null } | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<mongoose.Connection> {
    // cached'in tanımlı olduğundan eminiz (yukarıdaki if sayesinde)
    const activeCache = cached!;

    if (activeCache.conn) {
        return activeCache.conn;
    }

    if (!activeCache.promise) {
        const opts = {
            bufferCommands: false,
        };

        activeCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose.connection;
        });
    }

    try {
        activeCache.conn = await activeCache.promise;
    } catch (e) {
        activeCache.promise = null;
        throw e;
    }

    return activeCache.conn;
}

export default connectDB;
