const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "audio") {

        const allowedAudio = [
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/x-wav",
            "audio/flac",
            "audio/aac",
            "audio/ogg"
        ];

        if (!allowedAudio.includes(file.mimetype)) {
            return cb(new Error("Only audio files are allowed."));
        }
    }

    if (file.fieldname === "image") {

        const allowedImages = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedImages.includes(file.mimetype)) {
            return cb(new Error("Only image files are allowed."));
        }
    }

    cb(null, true);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024
    }
});
