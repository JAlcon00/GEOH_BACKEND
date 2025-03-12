import { Storage } from '@google-cloud/storage';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const keyFilePath = path.join(__dirname, 'keys', 'keyfile.json');

export const storage = new Storage({
    keyFilename: keyFilePath,
    projectId: process.env.GOOGLE_PROJECT_ID
});

export const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME || '');

/**
 * Uploads a file to a Google Cloud Storage bucket and returns the public URL of the uploaded file.
 *
 * @param {Express.Multer.File} file - The file object provided by Multer middleware.
 * @returns {Promise<string>} - A promise that resolves to the public URL of the uploaded file.
 *
 * @throws {Error} - If there is an error during the file upload process.
 */
export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => reject(error));
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });
        blobStream.end(file.buffer);
    });
};