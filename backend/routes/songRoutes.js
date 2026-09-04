const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


const {
    getAllSongs,
    uploadSong,
    deleteSong,
    likeSong,
    unlikeSong,
    updateSong
} = require("../controllers/songController");;


// Public Routes

router.get("/", getAllSongs);

// router.get("/:id", getSongById);


// // Protected Routes

// router.post("/", verifyToken, createSong);

// router.put("/:id", verifyToken, );

router.delete("/:id", verifyToken, deleteSong);

// router.get("/top", verifyToken, getTopSongs);


router.post("/upload", verifyToken,

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

// router.put(
//     "/:id",
//     verifyToken,
//     upload.fields([
//         { name: "audio", maxCount: 1 },
//         { name: "image", maxCount: 1 }
//     ]),
//     updateSong
// );

// router.get(

//     "/my",

//     verifyToken,

//     getMySongs

// );

router.post('/like/:songId', verifyToken, likeSong);
router.delete('/unlike/:songId', verifyToken, unlikeSong);

router.patch('/update/:songId', verifyToken,
    
    upload.fields([{
        name: 'image',
        maxCount: 1
    }]),
    
    updateSong

);





module.exports = router;