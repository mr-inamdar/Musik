const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (file, folder, resourceType = "auto") => {

    return new Promise((resolve, reject) => {

        if (!file || !file.buffer) {
            return reject(new Error("File buffer not found"));
        }

        const uploadStream = cloudinary.uploader.upload_stream(

            {
                folder,
                resource_type: resourceType
            },

            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });

            }

        );

        streamifier
            .createReadStream(file.buffer)
            .pipe(uploadStream);

    });

};

const deleteFromCloudinary = async (
    publicId,
    resourceType = "auto"
) => {

    return await cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: resourceType
        }
    );

};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};
