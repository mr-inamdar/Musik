const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

// ==============================
// Add Song To Playlist
// ==============================

exports.addToPlaylist = async (req, res) => {
    try {
        const { songId } = req.params;
        const userId = req.user.id;

        // Check Song Exists
        const song = await Song.getSongById(songId);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found."
            });
        }

        // Get User Playlist
        let playlist = await Playlist.getPlaylist(userId);

        let playlistId;

        // Create Playlist If Not Exists
        if (!playlist) {
            playlistId = await Playlist.createPlaylist(userId);
        } else {
            playlistId = playlist.PlaylistId;
        }

        // Check Duplicate Song
        const alreadyAdded = await Playlist.songExists(
            playlistId,
            songId
        );

        if (alreadyAdded) {
            return res.status(400).json({
                success: false,
                message: "Song already exists in playlist."
            });
        }

        // Add Song
        await Playlist.addSongInPlaylist(
            playlistId,
            songId
        );

        return res.status(201).json({
            success: true,
            data: {
                playlistId
            },
            message: "Song added successfully."
        });

    } catch (error) {
        console.error("addToPlaylist Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Get Playlist
// ==============================

exports.getPlaylist = async (req, res) => {
    try {
        const userId = req.user.id;

        const playlist = await Playlist.getPlaylist(userId);

        if (!playlist) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "Playlist is empty."
            });
        }

        const playlistSongs = await Playlist.getPlaylistSongs(
            playlist.PlaylistId
        );

        const formattedSongs = playlistSongs.map(song => ({
            song_id: song.song_id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            image: song.cover_url,
            audio: song.audio_url,
            likes: song.likes,
            uploadBy: song.uploadBy
        }));

        return res.status(200).json({
            success: true,
            data: formattedSongs,
            message: "Playlist fetched successfully."
        });

    } catch (error) {
        console.error("getPlaylist Error:", error);

        return res.status(401).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Remove Song From Playlist
// ==============================

exports.removeFromPlaylist = async (req, res) => {
    try {
        const { songId } = req.params;
        const userId = req.user.id;

        // Check Song Exists
        const song = await Song.getSongById(songId);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found."
            });
        }

        // Get Playlist
        const playlist = await Playlist.getPlaylist(userId);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found."
            });
        }

        // Check Song Exists In Playlist
        const exists = await Playlist.songExists(
            playlist.PlaylistId,
            songId
        );

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Song not found in playlist."
            });
        }

        // Delete Song
        const status = await Playlist.deleteSong(
            playlist.PlaylistId,
            songId
        );

        return res.status(200).json({
            success: true,
            data: {
                status
            },
            message: "Playlist song deleted successfully."
        });

    } catch (error) {
        console.error("removeFromPlaylist Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};


// ==============================
// Delete Playlist
// ==============================

exports.deletePlaylist = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get Playlist
        const playlist = await Playlist.getPlaylist(userId);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found."
            });
        }

        // Delete Playlist
        await Playlist.deletePlaylist(
            playlist.PlaylistId
        );

        return res.status(200).json({
            success: true,
            data: null,
            message: "Playlist deleted successfully."
        });

    } catch (error) {
        console.error("deletePlaylist Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};