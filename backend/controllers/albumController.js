const Album = require('../models/Album');
const {createSong} = require('../models/Song');

const {
    uploadToCloudinary,
    deleteFromCloudinary
} = require("../utils/cloudinaryHelper");

exports.uploadAlbum = async (req, res) =>{
    const uploadedAudios = []; 
    const uploadedCovers = [];

    try{
        const {albumName} = req.body;

        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User is not defined"
            });
        }

        // Validation
        if (!albumName || !albumName.trim()) {

            return res.status(400).json({
                success: false,
                message: "Album name is required."
            });

        }

        const songsCount =
            parseInt(req.params.songsCount);


        if (!songsCount ||
            songsCount < 1) {

            return res.status(400).json({
                success: false,
                message: "At least one song is required."
            });

        }


        // if (!audios?.length) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Audio file is required."
        //     });
        // }

        // if (!images?.length) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Cover image is required."
        //     });
        // }

        const albumId = await Album.uploadAlbum(albumName.trim(), userId);

        for (let i = 0; i < songsCount; i++) {


            // -----------------------------
            // TEXT DATA
            // -----------------------------

            const title =
                req.body[`songs[${i}].title`];

            const artist =
                req.body[`songs[${i}].artist`];


            // -----------------------------
            // FILE DATA
            // -----------------------------

            const poster =
                req.files?.[
                    `songs[${i}].poster`
                ]?.[0];

            const audio =
                req.files?.[
                    `songs[${i}].audio`
                ]?.[0];


            // -----------------------------
            // VALIDATION
            // -----------------------------

            // if (!title || !title.trim()) {

            //     throw new Error(
            //         `Song ${i + 1}: Title is required.`
            //     );

            // }


            // if (!artist || !artist.trim()) {

            //     throw new Error(
            //         `Song ${i + 1}: Artist is required.`
            //     );

            // }


            // if (!poster) {

            //     throw new Error(
            //         `Song ${i + 1}: Poster is required.`
            //     );

            // }


            // if (!audio) {

            //     throw new Error(
            //         `Song ${i + 1}: Audio is required.`
            //     );

            // }


            // =================================
            // CLOUDINARY UPLOAD
            // =================================

            const [audioResult, coverResult] =
                await Promise.all([

                    uploadToCloudinary(
                        audio,
                        "songs",
                        "video"
                    ),

                    uploadToCloudinary(
                        poster,
                        "covers",
                        "image"
                    )

                ]);


            // Track uploads for rollback

            uploadedAudios.push(
                audioResult.publicId
            );

            uploadedCovers.push(
                coverResult.publicId
            );


            // =================================
            // SAVE SONG
            // =================================

            await createSong({

                title: title.trim(),

                artist: artist.trim(),

                album_id: albumId,

                audio_url: audioResult.url,

                audio_public_id:
                    audioResult.publicId,

                cover_url: coverResult.url,

                cover_public_id:
                    coverResult.publicId,

                uploadBy: userId

            });

        }

        // for(let i = 0; i < audios.length && i < images.length; i++){
        //     [audio, cover] = await Promise.all([
        //         uploadToCloudinary(
        //             req.files.audio[i],
        //             "songs",
        //             "video"
        //         ),

        //         uploadToCloudinary(
        //             req.files.image[i],
        //             "covers",
        //             "image"
        //         )
        //     ]);

        //     // Save Database
        //     await createSong({
        //         title: titles[i],
        //         artist: artists[i],
        //         album_id: albumId,

        //         audio_url: audio.url,
        //         audio_public_id: audio.publicId,

        //         cover_url: cover.url,
        //         cover_public_id: cover.publicId,

        //         uploadBy: userId
        //     });
        // }

        return res.status(201).json({
            success: true,
            data: {
                albumId,
                songsCount
            },
            message: "Song uploaded successfully"
        });

    }catch(error){
         console.error(
            "uploadAlbum Error:",
            error
        );


        // =========================================
        // ROLLBACK AUDIO
        // =========================================

        for (const publicId of uploadedAudios) {

            try {

                await deleteFromCloudinary(
                    publicId,
                    "video"
                );

            } catch (deleteError) {

                console.error(
                    "Audio rollback failed:",
                    deleteError
                );

            }

        }


        // =========================================
        // ROLLBACK COVERS
        // =========================================

        for (const publicId of uploadedCovers) {

            try {

                await deleteFromCloudinary(
                    publicId,
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

            message:
                "Failed to upload album.",

            error: error.message

        });

    }
}

// exports.getAlbums = async (req, res) => {
//     try {
//         const albums = await Album.getAllAlbums();

//         // const formattedAlbum = albums.map(album => ({
//         //     song_id: album.song_id,
//         //     title: album.title,
//         //     artist: album.artist,
//         //     album: album.album,
//         //     image: album.cover_url,
//         //     audio: album.audio_url,
//         //     likes: album.likes,
//         //     uploadBy: album.uploadBy
//         // }));

//         return res.status(200).json({
//             success: true,
//             message: "Albums fetched successfully",
//             data: albums
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch albums.",
//             error: error.message
//         });
//     }
// };