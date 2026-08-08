// // const cloudinary = require("../config/cloudinary");
// // const fs = require("fs");

// // // ==============================
// // // Upload File
// // // ==============================

// // async function uploadToCloudinary(file, folder, resourceType = "auto") {

// //     try {

// //         const result = await cloudinary.uploader.upload(

// //             file.path,

// //             {

// //                 folder,

// //                 resource_type: resourceType

// //             }

// //         );

// //         // Local file delete
// //         fs.unlinkSync(file.path);

// //         return {
// //             url: result.secure_url,
// //             publicId: result.public_id
// //         };

// //     } catch (error) {

// //         if (file && file.path) {

// //             fs.unlinkSync(file.path);

// //         }

// //         throw error;

// //     }

// // }

// // // ==============================
// // // Delete File
// // // ==============================

// // async function deleteFromCloudinary(publicId, resourceType = "auto") {

// //     try {

// //         const result = await cloudinary.uploader.destroy(

// //             publicId,

// //             {

// //                 resource_type: resourceType

// //             }

// //         );

// //         return result;

// //     } catch (error) {

// //         throw error;

// //     }

// // }

// // module.exports = {

// //     uploadToCloudinary,

// //     deleteFromCloudinary

// // };

// const cloudinary = require("../config/cloudinary");
// const streamifier = require("streamifier");

// const uploadToCloudinary = (file, folder, resourceType = "auto") => {

//     return new Promise((resolve, reject) => {

//         const stream = cloudinary.uploader.upload_stream(

//             {
//                 folder,
//                 resource_type: resourceType
//             },

//             (error, result) => {

//                 if (error) {
//                     return reject(error);
//                 }

//                 resolve({
//                     url: result.secure_url,
//                     publicId: result.public_id
//                 });

//             }

//         );

//         streamifier.createReadStream(file.buffer).pipe(stream);

//     });

// };

// const deleteFromCloudinary = async (
//     publicId,
//     resourceType = "auto"
// ) => {

//     return await cloudinary.uploader.destroy(
//         publicId,
//         {
//             resource_type: resourceType
//         }
//     );

// };

// module.exports = {
//     uploadToCloudinary,
//     deleteFromCloudinary
// };


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