import mongoose from "mongoose"

declare global {
    var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

const mongoServer = async (): Promise<void> => {
    try {
        if (cached.conn) return;

        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is not defined in environment variables");
            return;
        }

        if (!cached.promise) {
            cached.promise = mongoose.connect(process.env.MONGO_URI);
        }

        cached.conn = await cached.promise;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
}

export default mongoServer;