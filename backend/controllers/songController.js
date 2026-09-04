const { pool } = require("../config/db");
const Song = require("../models/Song");

const {
    uploadToCloudinary,
    deleteFromCloudinary
} = require("../utils/cloudinaryHelper");


// ==============================
// Upload Song
// ==============================

exports.uploadSong = async (req, res) => {
    let audio = null;
    let cover = null;

    try {
        const {
            title,
            artist
        } = req.body;

        // Logged In User
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User is not defined"
            });
        }

        // Validation
        if (!title || !artist) {
            return res.status(400).json({
                success: false,
                message: "Title and Artist are required."
            });
        }

        if (!req.files?.audio?.length) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required."
            });
        }

        if (!req.files?.image?.length) {
            return res.status(400).json({
                success: false,
                message: "Cover image is required."
            });
        }

        // Upload Both Files Parallel
        [audio, cover] = await Promise.all([
            uploadToCloudinary(
                req.files.audio[0],
                "songs",
                "video"
            ),

            uploadToCloudinary(
                req.files.image[0],
                "covers",
                "image"
            )
        ]);

        // Save Database
        const songId = await Song.createSong({
            title,
            artist,

            audio_url: audio.url,
            audio_public_id: audio.publicId,

            cover_url: cover.url,
            cover_public_id: cover.publicId,

            uploadBy: userId
        });

        return res.status(201).json({
            success: true,
            data: {
                songId
            },
            message: "Song uploaded successfully"
        });

    } catch (error) {
        console.error("uploadSong Error:", error);

        // Rollback Audio
        if (audio?.publicId) {
            try {
                await deleteFromCloudinary(
                    audio.publicId,
                    "video"
                );
            } catch (deleteError) {
                console.error(
                    "Audio rollback failed:",
                    deleteError
                );
            }
        }

        // Rollback Cover
        if (cover?.publicId) {
            try {
                await deleteFromCloudinary(
                    cover.publicId,
                    "image"
                );
            } catch (deleteError) {
                console.error(
                    "Cover rollback failed:",
                    deleteError
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to upload song.",
            error: error.message
        });
    }
};


// ==============================
// Get All Songs
// ==============================

exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.getAllSongs();

        const formattedSongs = songs.map(song => ({
            song_id: song.song_id,
            title: song.title,
            artist: song.artist,
            album_id: song.album_id,
            album: song.album,
            image: song.cover_url,
            audio: song.audio_url,
            likes: song.likes,
            uploadBy: song.uploadBy
        }));

        return res.status(200).json({
            success: true,
            data: formattedSongs,
            message: "Songs fetched successfully"
        });

    } catch (error) {
        console.error("getAllSongs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Get Song By ID
// ==============================

exports.getSongById = async (req, res) => {
    try {
        const { id } = req.params;

        const song = await Song.getSongById(id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: song,
            message: "Song fetched successfully"
        });

    } catch (error) {
        console.error("getSongById Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Delete Song
// ==============================

exports.deleteSong = async (req, res) => {
    try {
        const { id } = req.params;

        const song = await Song.getSongById(id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found"
            });
        }

        await Song.deleteSong(id);

        return res.status(200).json({
            success: true,
            data: null,
            message: "Song deleted successfully"
        });

    } catch (error) {
        console.error("deleteSong Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Like Song
// ==============================

exports.likeSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const userId = req.user.id;

        // Check Song Exists
        const song = await Song.getSongById(songId);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found"
            });
        }

        // Check Already Liked
        const [existing] = await pool.query(
            "SELECT * FROM song_likes WHERE song_id = ? AND user_id = ?",
            [songId, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Already liked"
            });
        }

        // Add Like
        await pool.query(
            "INSERT INTO song_likes(song_id, user_id) VALUES(?, ?)",
            [songId, userId]
        );

        // Update Like Count
        await pool.query(
            "UPDATE songs SET likes = likes + 1 WHERE song_id = ?",
            [songId]
        );

        return res.status(200).json({
            success: true,
            message: "Song liked"
        });

    } catch (error) {
        console.error("likeSong Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Unlike Song
// ==============================

exports.unlikeSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const userId = req.user.id;

        // Check Song Exists
        const song = await Song.getSongById(songId);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found"
            });
        }

        // Check Like Exists
        const [existing] = await pool.query(
            "SELECT * FROM song_likes WHERE song_id = ? AND user_id = ?",
            [songId, userId]
        );

        if (existing.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Song not liked"
            });
        }

        // Remove Like
        await pool.query(
            "DELETE FROM song_likes WHERE song_id = ? AND user_id = ?",
            [songId, userId]
        );

        // Update Like Count
        await pool.query(
            "UPDATE songs SET likes = likes - 1 WHERE song_id = ?",
            [songId]
        );

        return res.status(200).json({
            success: true,
            message: "Song unliked"
        });

    } catch (error) {
        console.error("unlikeSong Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Update Song
// ==============================

exports.updateSong = async (req, res) => {
    let newImage = null;

    try {
        const { songId } = req.params;
        const {
            title,
            artist,
            album
        } = req.body;

        const userId = req.user.id;

        // Check User
        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get Song
        const song = await Song.getSongById(songId);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found"
            });
        }

        // Check Ownership
        if (song.uploadBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updatedSong = {};

        // Text Fields
        if (title) {
            updatedSong.title = title;
        }

        if (artist) {
            updatedSong.artist = artist;
        }

        if (album) {
            updatedSong.album = album;
        }

        // Image
        if (req.files?.image?.length) {

            // Upload New Image First
            // This is safer because old image is not
            // deleted if new upload fails.

            newImage = await uploadToCloudinary(
                req.files.image[0],
                "covers",
                "image"
            );

            updatedSong.coverUrl = newImage.url;
            updatedSong.coverPublicId = newImage.publicId;
        }

        // Update Database
        await Song.updateSong(
            songId,
            updatedSong
        );

        // Delete Old Image After DB Update
        if (
            newImage?.publicId &&
            song.cover_public_id
        ) {
            try {
                await deleteFromCloudinary(
                    song.cover_public_id,
                    "image"
                );
            } catch (deleteError) {
                console.error(
                    "Old image delete failed:",
                    deleteError
                );
            }
        }

        return res.status(200).json({
            success: true,
            data: updatedSong,
            message: "Song updated successfully"
        });

    } catch (error) {
        console.error("updateSong Error:", error);

        // Rollback newly uploaded image
        if (newImage?.publicId) {
            try {
                await deleteFromCloudinary(
                    newImage.publicId,
                    "image"
                );
            } catch (deleteError) {
                console.error(
                    "New image rollback failed:",
                    deleteError
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update song.",
            error: error.message
        });
    }
};