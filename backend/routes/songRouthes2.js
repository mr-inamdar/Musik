const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


const {
    uploadSong,
    getAllSongs,
    getSongById,
    deleteSong
} = require("../controllers/songController");


// ============================
// Public Routes
// ============================

// Get All Songs
router.get("/", getAllSongs);

// Get Single Song
router.get("/:id", getSongById);

// ============================
// Protected Routes
// ============================

// Upload Song
router.post(

    "/upload",

    verifyToken,

    upload.fields([

        {

            name: "audio",

            maxCount: 1

        },

        {

            name: "image",

            maxCount: 1

        }

    ]),

    uploadSong

);

// Delete Song
router.delete(

    "/:id",

    verifyToken,

    deleteSong

);

module.exports = router;