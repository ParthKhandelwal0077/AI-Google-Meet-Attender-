        const mongoose = require('mongoose');
        const { GridFSBucket } = require('mongodb');

        let bucket;

        // Initialize GridFS bucket
        const initBucket = () => {
            if (bucket) return bucket;
            
            const db = mongoose.connection.db;
            bucket = new GridFSBucket(db, {
                bucketName: 'photos'
            });
            return bucket;
        };

        // Get GridFS bucket instance
        const getBucket = () => {
            if (!bucket) {
                throw new Error('GridFS bucket not initialized');
            }
            return bucket;
        };

        // Stream file to GridFS
        const uploadFile = (file) => {
            return new Promise((resolve, reject) => {
                const writeStream = getBucket().openUploadStream(file.originalname, {
                    contentType: file.mimetype
                });

                const readStream = require('stream').Readable.from(file.buffer);
                
                readStream.pipe(writeStream)
                    .on('error', reject)
                    .on('finish', () => {
                        resolve({
                            fileId: writeStream.id,
                            filename: file.originalname,
                            contentType: file.mimetype
                        });
                    });
            });
        };

        // Get file stream from GridFS
        const getFileStream = (fileId) => {
            return getBucket().openDownloadStream(new mongoose.Types.ObjectId(fileId));
        };

        // Delete file from GridFS
        const deleteFile = async (fileId) => {
            await getBucket().delete(new mongoose.Types.ObjectId(fileId));
        };

        module.exports = {
            initBucket,
            uploadFile,
            getFileStream,
            deleteFile
        }; 