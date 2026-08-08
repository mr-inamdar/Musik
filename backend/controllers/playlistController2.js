const Playlist = require("../models/Playlist");
const Song = require('../models/Song');

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


// ==============================
// Create Playlist
// ==============================

// exports.createPlaylist = asyncHandler(async (req, res) => {

//     const userId = req.user.id;

//     // Check Already Exists

//     const playlist = await Playlist.getPlaylist(userId);

//     if (playlist) {

//         throw new ApiError(

//             400,

//             "Playlist already exists."

//         );

//     }

//     const playlistId = await Playlist.createPlaylist(userId);

//     return res.status(201).json(

//         new ApiResponse(

//             201,

//             {

//                 playlistId

//             },

//             "Playlist created successfully."

//         )

//     );

// });

exports.addToPlaylist = asyncHandler(async (req, res) => {

    // ==========================
    // Step 1 : Get Request Data
    // ==========================

    const { songId } = req.params;

    const userId = req.user.id;

    // console.log(songId, userId);


    // ==========================
    // Step 2 : Check Song Exists
    // ==========================

    const song = await Song.getSongById(songId);

    if (!song) {

        throw new ApiError(
            404,
            "Song not found."
        );

    }


    // ==========================
    // Step 3 : Get User Playlist
    // ==========================

    let playlist = await Playlist.getPlaylist(userId);

    let playlistId;


    // ==========================
    // Step 4 : Create Playlist If Not Exists
    // ==========================

    if (!playlist) {

        playlistId = await Playlist.createPlaylist(userId);

    } else {

        playlistId = playlist.PlaylistId;

    }


    // ==========================
    // Step 5 : Check Duplicate Song
    // ==========================

    const alreadyAdded = await Playlist.songExists(

        playlistId,

        songId

    );

    if (alreadyAdded) {

        throw new ApiError(

            400,

            "Song already exists in playlist."

        );

    }


    // ==========================
    // Step 6 : Add Song
    // ==========================

    await Playlist.addSongInPlaylist(

        playlistId,

        songId

    );


    // ==========================
    // Step 7 : Response
    // ==========================

    return res.status(201).json(

        new ApiResponse(

            201,

            {

                playlistId

            },

            "Song added successfully."

        )

    );

});

// exports.addToPlaylist = asyncHandler(async (req, res)=>{
//     const { songId } = req.body;

//     const userId = req.user.id;

//     const song = await Song.getSongById(songId);

//     const playlist = await Playlist.getPlaylist(userId);

//     if(!song){

//         throw new ApiError(
//             404,
//             "Song not found."
//         );

//     }

//     if (!playlist) {

//         const playlistId = await Playlist.createPlaylist(userId);

//         await Playlist.addSongInPlaylist(
//             playlistId,
//             songId
//         );
//     }

//     const alreadyAdded = await Playlist.songExists( playlist.PlaylistId, songId );

//     if(alreadyAdded){

//         throw new ApiError( 400, "Song already exists." ); 

//     }

//     if (playlist) {
        
//         await Playlist.addSongInPlaylist(playlist.PlaylistId, songId);

//     }

//     return res.status(201).json(

//         new ApiResponse(

//             201,

//             {

//                 playlistId: playlist.PlaylistId

//             },

//             "Song added in Playlist successfully."

//         )

//     );
// });


exports.getPlaylist = asyncHandler(async (req, res) =>{

    const userId = req.user.id;

    const playlist = await Playlist.getPlaylist(userId);

    if (!playlist) {
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "Playlist is empty."
            )
        );
    }
    else {
        const playlistSongs = await Playlist.getPlaylistSongs(playlist.PlaylistId);

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

        return res.status(200).json(
            new ApiResponse(
                200,
                formattedSongs,
                "Playlist fetched successfully."
            )
        );

    }
});

exports.removeFromPlaylist = asyncHandler(async (req, res) =>{

    const { songId } = req.params;

    const userId = req.user.id;

    const song = await Song.getSongById(songId);

    if (!song) {

        throw new ApiError(
            404,
            "Song not found."
        );

    }

    const playlist = await Playlist.getPlaylist(userId);

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found."
        );
    } 
    const exists = await Playlist.songExists(
        playlist.PlaylistId,
        songId
    );

    if (!exists) {
        throw new ApiError(
            404,
            "Song not found in playlist."
        );
    }
    else{
        const stetus = await Playlist.deleteSong(playlist.PlaylistId, songId);
        return res.status(204).json(

            new ApiResponse(

                201,

                {

                    stetus

                },

                "Playlist Song deleted successfully."

            )

        );
    }

});

exports.deletePlaylist = asyncHandler(async (req, res) => {

    // ==========================
    // Step 1 : Logged In User
    // ==========================

    const userId = req.user.id;

    // ==========================
    // Step 2 : Get Playlist
    // ==========================

    const playlist = await Playlist.getPlaylist(userId);

    if (!playlist) {

        throw new ApiError(

            404,

            "Playlist not found."

        );

    }

    // ==========================
    // Step 3 : Delete Playlist
    // ==========================

    await Playlist.deletePlaylist(

        playlist.PlaylistId

    );

    // ==========================
    // Step 4 : Response
    // ==========================

    return res.status(200).json(

        new ApiResponse(

            200,

            null,

            "Playlist deleted successfully."

        )

    );

});