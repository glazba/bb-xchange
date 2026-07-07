import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { pool } from "../../db/connections";
import { RowDataPacket } from "mysql2";
import cloudinary from "../../config/cloudinary";

interface MigrationImage extends RowDataPacket {
    id: number;
    image_url: string;
    cloudinary_public_id: string | null;
}

async function migrate() {

    console.log("🚀 Starting image migration...\n");

    const [rows] = await pool.query<MigrationImage[]>(`
        SELECT
            id,
            image_url,
            cloudinary_public_id
        FROM item_images
    `);

    console.log(`Found ${rows.length} images.\n`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const image of rows) {

        // Már Cloudinaryban van
        if (
            image.cloudinary_public_id ||
            image.image_url.startsWith("http")
        ) {
            skipped++;
            continue;
        }

        const fileName = path.basename(image.image_url);

        const filePath = path.resolve(
            process.cwd(),
            "uploads",
            "items",
            fileName
        );

        if (!fs.existsSync(filePath)) {
            console.log(`❌ File not found: ${fileName}`);
            failed++;
            continue;
        }

        try {

            const uploaded = await cloudinary.uploader.upload(
                filePath,
                {
                    folder: "bb-xchange/items"
                }
            );

            await pool.query(
                `
                UPDATE item_images
                SET
                    image_url = ?,
                    cloudinary_public_id = ?
                WHERE id = ?
                `,
                [
                    uploaded.secure_url,
                    uploaded.public_id,
                    image.id
                ]
            );

            console.log(`✅ ${fileName}`);

            migrated++;

        } catch (error) {

            console.error(`❌ ${fileName}`, error);

            failed++;

        }

    }

    console.log("\n----------------------------");
    console.log(`Migrated : ${migrated}`);
    console.log(`Skipped  : ${skipped}`);
    console.log(`Failed   : ${failed}`);
    console.log("----------------------------");

    await pool.end();

}

migrate()
    .then(() => {
        console.log("\n🎉 Migration finished successfully.");
        process.exit(0);
    })
    .catch(async (error) => {
        console.error("\n💥 Migration failed:", error);
        await pool.end();
        process.exit(1);
    });