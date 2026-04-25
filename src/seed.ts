import { seedSuperAdmin } from "./app/utils/seed.js";
import { prisma } from "./app/lib/prisma.js";

const runSeed = async () => {
    console.log("Starting seed process...");
    try {
        await seedSuperAdmin();
        console.log("Seed process completed successfully.");
    } catch (error) {
        console.error("Seed process failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

runSeed();
