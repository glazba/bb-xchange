import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (
        req,
        file,
        callback
    ) => {
        callback(
            null,
            "uploads/items"
        );
    },

    filename: (
        req,
        file,
        callback
    ) => {

        const extension =
            path.extname(
                file.originalname
            );

        const filename =
            `item-${Date.now()}-${Math.round(
                Math.random() * 1_000_000
            )}${extension}`;

        callback(
            null,
            filename
        );
    }
});

const fileFilter:
    multer.Options["fileFilter"] =
    (
        req,
        file,
        callback
    ) => {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {
            callback(
                null,
                true
            );
        } else {
            callback(
                new Error(
                    "Csak JPG, PNG vagy WEBP kép tölthető fel."
                )
            );
        }
    };

export const uploadItemImages =
    multer({
        storage,
        fileFilter,
        limits: {
            fileSize:
                5 * 1024 * 1024
        }
    });