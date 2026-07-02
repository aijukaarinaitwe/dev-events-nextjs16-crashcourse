import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://50.50.1.42:3000"
    ],
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
