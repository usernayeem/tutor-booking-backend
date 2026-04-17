import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, "src");

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            replaceInFiles(filePath);
        } else if (filePath.endsWith(".ts")) {
            let content = fs.readFileSync(filePath, "utf-8");
            if (content.includes("generated/prisma/enums")) {
                content = content.replace(/generated\/prisma\/enums/g, "generated/prisma/client");
                fs.writeFileSync(filePath, content, "utf-8");
                console.log(`Updated imports in: ${filePath}`);
            }
        }
    });
}

replaceInFiles(directoryPath);
console.log("All generic 'generated/prisma/enums' imports have been corrected to 'generated/prisma/client'!");
