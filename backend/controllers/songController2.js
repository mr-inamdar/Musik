const Song = require("../models/Song");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/*
|--------------------------------------------------------------------------
| Get All Songs
|--------------------------------------------------------------------------
*/

exports.getAllSongs = asyncHandler(async (req, res) => {

    const songs = await Song.getAllSongs();

    return res.status(200).json(

        new ApiResponse(
            200,
            songs,
            "Songs fetched successfully"
        )

    );

});


/*
|--------------------------------------------------------------------------
| Get Song By ID
|--------------------------------------------------------------------------
*/

exports.getSongById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const song = await Song.getSongById(id);

    if (!song) {

        throw new ApiError(

            404,

            "Song not found"

        );

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            song,

            "Song fetched successfully"

        )

    );

});


/*
|--------------------------------------------------------------------------
| Create Song
|--------------------------------------------------------------------------
*/

exports.createSong = asyncHandler(async (req, res) => {

    const {

        title,
        artist,
        album,
        image,
        audio

    } = req.body;

    if (!title || !artist || !audio) {

        throw new ApiError(

            400,

            "Title, Artist and Audio are required"

        );

    }

    const songId = await Song.createSong({

        title,
        artist,
        album,
        image,
        audio

    });

    return res.status(201).json(

        new ApiResponse(

            201,

            {

                songId

            },

            "Song created successfully"

        )

    );

});


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