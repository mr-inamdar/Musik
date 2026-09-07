const express = require("express");
const multer = require("multer");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    uploadAlbum,
    deleteAlbum,
    updateAlbum
} = require("../controllers/albumController");

const upload = multer({
    storage: multer.memoryStorage()
});

// router.post(
//     '/upload/:songsCount',
//     verifyToken,

//     (req, res, next) => {

//         const songsCount = parseInt(req.params.songsCount);

//         upload.fields([
//             {
//                 name: "audio",
//                 maxCount: songsCount
//             },
//             {
//                 name: "image",
//                 maxCount: songsCount
//             }
//         ])(req, res, next);

//     },

//     uploadAlbum
// );

router.post(
    "/upload/:songsCount",
    verifyToken,

    (req, res, next) => {

        const songsCount = parseInt(
            req.params.songsCount
        );

        if (
            !songsCount ||
            songsCount < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid songs count."
            });
        }


        // Dynamic fields create karo
        const fields = [];

        for (let i = 0; i < songsCount; i++) {

            fields.push(
                {
                    name: `songs[${i}].poster`,
                    maxCount: 1
                },
                {
                    name: `songs[${i}].audio`,
                    maxCount: 1
                }
            );

        }


        // Multer middleware run karo
        upload.fields(fields)(
            req,
            res,
            next
        );

    },

    uploadAlbum
);

router.delete('/delete/:albumId', verifyToken, deleteAlbum);

// router.get('/', getAlbums);

router.put('/update/:albumId/:songsCount/:newSongCount', verifyToken,
    
    (req, res, next) => {

        const {songsCount, newSongCount} = req.params;

        if (
            !songsCount ||
            songsCount < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid songs count."
            });
        }


        // Dynamic fields create karo
        const fields = [];

        for (let i = 0; i < parseInt(songsCount); i++) {

            fields.push(
                {
                    name: `songs[${i}].poster`,
                    maxCount: 1
                }
            );

        }

        for (let i = 0; i < parseInt(newSongCount); i++) {

            fields.push({
                name: `newSong[${i}].poster`,
                maxCount: 1
            });

            fields.push({
                name: `newSong[${i}].audio`,
                maxCount: 1
            });

        }


        // Multer middleware run karo
        upload.fields(fields)(
            req,
            res,
            next
        );

    },
    
    updateAlbum

);

module.exports = router;