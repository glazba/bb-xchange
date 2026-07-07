import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export interface CloudinaryUploadResult {
    secureUrl: string;
    publicId: string;
}

export const uploadImage = (
    file: Express.Multer.File,
    folder: string
): Promise<CloudinaryUploadResult> => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder
            },
            (error, result) => {

                if (error || !result) {
                    return reject(error);
                }

                resolve({
                    secureUrl: result.secure_url,
                    publicId: result.public_id
                });

            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);

    });

};

export const deleteImage = async (
    publicId: string
) => {

    await cloudinary.uploader.destroy(publicId);

};

/* 
! Migration helper (uploads -> Cloudinary)
export const uploadBuffer = (
    buffer: Buffer,
    folder: string
): Promise<CloudinaryUploadResult> => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {

                if (error || !result) {
                    return reject(error);
                }

                resolve({
                    secureUrl: result.secure_url,
                    publicId: result.public_id
                });

            }
        );

        streamifier.createReadStream(buffer).pipe(stream);

    });

};
*/