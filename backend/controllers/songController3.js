const { pool } = require("../config/db");
const Song = require("../models/Song");
// const User = require('../models/User');
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const {
    uploadToCloudinary,
    deleteFromCloudinary
} = require("../utils/cloudinaryHelper");

exports.uploadSong = asyncHandler(async (req, res) => {

    const {
        title,
        artist,
        album,
    } = req.body;

    // console.log("req.user =", req.user);
    // console.log("headers =", req.headers.authorization);

    // Logged In User
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(
            400,
            "User is not defined"
        );
    }

    // Validation
    if (!title || !artist) {

        throw new ApiError(
            400,
            "Title and Artist are required."
        );

    }

    if (!req.files?.audio?.length) {

        throw new ApiError(
            400,
            "Audio file is required."
        );

    }

    if (!req.files?.image?.length) {

        throw new ApiError(
            400,
            "Cover image is required."
        );

    }

    let audio = null;
    let cover = null;

    try {

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

            album,

            audio_url: audio.url,
            audio_public_id: audio.publicId,

            cover_url: cover.url,
            cover_public_id: cover.publicId,

            uploadBy: userId

        });

        return res.status(201).json(

            new ApiResponse(

                201,

                {

                    songId

                },

                "Song Uploaded Successfully"

            )

        );

    }

    catch (error) {

        // Rollback

        if (audio?.publicId) {

            await deleteFromCloudinary(

                audio.publicId,

                "video"

            );

        }

        if (cover?.publicId) {

            await deleteFromCloudinary(

                cover.publicId,

                "image"

            );

        }

        throw error;

    }

});
// exports.getTopSongs = asyncHandler(async (req, res) => {

//     const songs = await Song.getTopSongs();

//     return res.status(200).json(

//         new ApiResponse(

//             200,

//             songs,

//             "Top songs fetched successfully."

//         )

//     );

// });
// exports.getMySongs = asyncHandler(async (req, res) => {

//     const userId = req.user.id;

//     const songs = await Song.getMySongs(userId);

//     return res.status(200).json(

//         new ApiResponse(

//             200,

//             songs,

//             "Your songs fetched successfully."

//         )

//     );

// });
/*
|--------------------------------------------------------------------------
| Get All Songs
|--------------------------------------------------------------------------
*/

// exports.getAllSongs = asyncHandler(async (req, res) => {

//     const songs = await Song.getAllSongs();

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             songs,
//             "Songs fetched successfully"
//         )

//     );

// });

exports.getAllSongs = asyncHandler(async (req, res) => {

    const songs = await Song.getAllSongs();

    // const userId = songs.uploadBy;

    // const user = await User.findById(userId);

    const formattedSongs = songs.map(song => ({
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
            "Songs fetched successfully"
        )
    );

});


/*
|--------------------------------------------------------------------------
| Get Song By ID
|--------------------------------------------------------------------------
*/

// exports.getSongById = asyncHandler(async (req, res) => {

//     const { id } = req.params;

//     const song = await Song.getSongById(id);

//     if (!song) {

//         throw new ApiError(

//             404,

//             "Song not found"

//         );

//     }

//     return res.status(200).json(

//         new ApiResponse(

//             200,

//             song,

//             "Song fetched successfully"

//         )

//     );

// });


/*
|--------------------------------------------------------------------------
| Create Song
|--------------------------------------------------------------------------
*/

// exports.createSong = asyncHandler(async (req, res) => {

//     const {

//         title,
//         artist,
//         album,
//         image,
//         audio

//     } = req.body;

//     if (!title || !artist || !audio) {

//         throw new ApiError(

//             400,

//             "Title, Artist and Audio are required"

//         );

//     }

//     const songId = await Song.createSong({

//         title,
//         artist,
//         album,
//         image,
//         audio

//     });

//     return res.status(201).json(

//         new ApiResponse(

//             201,

//             {

//                 songId

//             },

//             "Song created successfully"

//         )

//     );

// });


/*
|--------------------------------------------------------------------------
| Delete Song
|--------------------------------------------------------------------------
*/

exports.deleteSong = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const song = await Song.getSongById(id);

    if (!song) {

        throw new ApiError(

            404,

            "Song not found"

        );

    }

    await Song.deleteSong(id);

    return res.status(200).json(

        new ApiResponse(

            200,

            null,

            "Song deleted successfully"

        )

    );

});

exports.likeSong = async(req, res)=>{
    const songId = req.params.songId;
    const userId = req.user.id;

    // Pehle check
    const [existing] = await pool.query(
        "SELECT * FROM song_likes WHERE song_id=? AND user_id=?",
        [songId, userId]
    );

    if (existing.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Already liked"
        });
    }

    // Like add
    await pool.query(
        "INSERT INTO song_likes(song_id,user_id) VALUES(?,?)",
        [songId, userId]
    );

    // Count update
    await pool.query(
        "UPDATE songs SET likes = likes + 1 WHERE song_id=?",
        [songId]
    );

    res.json({
        success: true,
        message: "Song liked"
    });
};

exports.unlikeSong = async(req, res) =>{
    const songId = req.params.songId;
    const userId = req.user.id;

    const [existing] = await pool.query(
        "SELECT * FROM song_likes WHERE song_id=? AND user_id=?",
        [songId, userId]
    );

    if (existing.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Song not liked"
        });
    }

    await pool.query(
        "DELETE FROM song_likes WHERE song_id=? AND user_id=?",
        [songId, userId]
    );

    await pool.query(
        "UPDATE songs SET likes = likes - 1 WHERE song_id=?",
        [songId]
    );

    res.json({
        success: true,
        message: "Song unliked"
    });
}

// exports.uploadSong = asyncHandler( async(req, res)=>{
//     const {songId} = req.params;
//     const {
//         title,
//         artist, 
//         album,
//         image
//     } = req.body;
//     const userId = req.user.id;

//     if (!userId) {
//         throw new ApiError(
//             404,

//             "user not found"
//         )
//     }

//     const song = await Song.getSongById(songId);

//     if (!song) {
//         throw new ApiError(
//             404, 
//             'Song not fount!'
//         )
//     }

//     if (req.files) {
//         let imageFile = null;
//         try {

//             // Upload Both Files Parallel
//             [imageFile] = await Promise.all([

//                 uploadToCloudinary(

//                     req.files.image[0],

//                     "covers",

//                     "image"

//                 )

//             ]);

//             // Save Database

//             return res.status(201).json(

//                 new ApiResponse(

//                     201,

//                     {

//                         songId

//                     },

//                     "Song Uploaded Successfully"

//                 )

//             );

//         }

//         catch (error) {

//             // Rollback

//             if (imageFile?.publicId) {

//                 await deleteFromCloudinary(

//                     cover.publicId,

//                     "image"

//                 );

//             }

//             throw error;

//         }
//     }
// })

exports.updateSong = asyncHandler(async (req, res) => {
    const { songId } = req.params;
    const { title, artist, album } = req.body;
    const userId = req.user.id;

    const song = await Song.getSongById(songId);

    if (!userId) {
        throw new ApiError(404, "User not found");
    }

    if (!song) {
        throw new ApiError(404, "Song not found");
    }

    if (song.uploadBy !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    const updatedSong = {};

    // Text fields
    if (title) updatedSong.title = title;
    if (artist) updatedSong.artist = artist;
    if (album) updatedSong.album = album;

    // Image
    if (req.files?.image) {

        // delete old image
        if (song.cover_public_id) {
            await deleteFromCloudinary(song.cover_public_id, "image");
        }

        // upload new image
        const image = await uploadToCloudinary(
            req.files.image[0],
            "covers",
            "image"
        );

        updatedSong.coverUrl = image.url;
        updatedSong.coverPublicId = image.publicId;
    }

    await Song.updateSong(songId, updatedSong);

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedSong,
            "Song updated successfully"
        )
    );
});