import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

// Build trusted origins from env vars so deployment URLs are automatically included.
// Add extra origins to TRUSTED_ORIGINS in .env as a comma-separated list.
const buildTrustedOrigins = (): string[] => {
    const origins = new Set<string>([
        // Always trust local dev origins
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]);

    // Read from environment variables
    const envVars = [
        process.env.BETTER_AUTH_URL,
        process.env.NEXT_PUBLIC_BASE_URL,
        process.env.TRUSTED_ORIGINS, // comma-separated list for extra origins
    ];

    for (const val of envVars) {
        if (!val) continue;
        for (const origin of val.split(",")) {
            const trimmed = origin.trim();
            if (trimmed) origins.add(trimmed);
        }
    }

    return Array.from(origins);
};

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: buildTrustedOrigins(),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
                    if (adminEmails.includes(user.email.toLowerCase())) {
                        return {
                            data: {
                                ...user,
                                role: 'admin'
                            }
                        };
                    }
                    return { data: user };
                }
            }
        }
    }
});

export type Session = typeof auth.$Infer.Session;
