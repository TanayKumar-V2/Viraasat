import mongoose from "mongoose";
import User from "./User";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables manually
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env");
    process.exit(1);
}

const promoteUser = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // First, let's just see what users exist
        const allUsers = await User.find({});
        console.log(`Found ${allUsers.length} total users in the database.`);

        if (allUsers.length === 0) {
            console.log("No users found! Have you signed up on the website yet?");
            console.log("Please go to http://localhost:3000/register or use Google Login to create an account first.");
        } else {
            console.log("\nExisting Users:");
            allUsers.forEach(u => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));

            // Optional: Auto-promote the first user if there is one
            const firstUser = allUsers[0];
            if (firstUser.role !== "admin") {
                console.log(`\nPromoting ${firstUser.email} to Admin...`);
                firstUser.role = "admin";
                await firstUser.save();
                console.log(`Success! ${firstUser.email} is now an Admin.`);
            } else {
                console.log(`\n${firstUser.email} is already an Admin.`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
};

promoteUser();
