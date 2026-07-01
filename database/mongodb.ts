import mongoose from 'mongoose';
import dns from 'dns';

// Fallback DNS to resolve MongoDB Atlas SRV records in environments with DNS query restrictions (development only)
if (process.env.NODE_ENV === 'development' && typeof dns.setServers === 'function') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}


// Define the connection cache type
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

// Extend the global object to include our mongoose cache
declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// FIX 1: Ensure the global object directly references the exact same mutated object
if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}
let cached = global.mongoose;

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads.
 * @returns Promise resolving to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
    // Return existing connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // Return existing connection promise if one is in progress
    if (!cached.promise) {
        // FIX 2: Move the URI validation to the top of the connection logic
        if (!MONGODB_URI) {
            throw new Error(
                'Please define the MONGODB_URI environment variable inside .env.local'
            );
        }

        const options = {
            bufferCommands: false, // Disable Mongoose buffering
        };

        // Create a new connection promise
        cached.promise = mongoose.connect(MONGODB_URI, options).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        // Wait for the connection to establish
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset promise on error to allow retry
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;