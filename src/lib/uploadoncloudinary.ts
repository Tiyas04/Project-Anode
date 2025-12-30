import cloudinary from "./cloudinary";
import { Readable } from 'stream';

// Uploads a file buffer to Cloudinary using a stream
const streamUpload = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image'
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });

        Readable.from(buffer).pipe(stream);
    });
};

export default streamUpload;