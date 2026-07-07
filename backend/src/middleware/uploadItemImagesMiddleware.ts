import multer from "multer";

const storage = multer.memoryStorage();

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