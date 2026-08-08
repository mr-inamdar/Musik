const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {

    createPlaylist,
    getPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist

} = require("../controllers/playlistController");

// router.post(

//     "/",

//     verifyToken,

//     createPlaylist

// );

router.get(
    "/",
    verifyToken,
    getPlaylist
);

router.post("/:songId", verifyToken, addToPlaylist);

router.delete('/:songId', verifyToken, removeFromPlaylist);

router.delete(

    "/",

    verifyToken,

    deletePlaylist

);

module.exports = router;