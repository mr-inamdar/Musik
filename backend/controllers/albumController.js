const Album = require('../models/Album');
const {createSong, deleteSong, getSongByAlbumId, updateSong} = require('../models/Song');

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
            message: "Album uploaded successfully"
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

exports.deleteAlbum = async (req, res) =>{
    try{
        const albumId = req.params.albumId;
        const userId = req.user.id;

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: 'User not defined'
            });
        }

        if (!albumId) {
            return res.status(404).json({
                success: false,
                message: 'Album not defined'
            });
        }

        const album = await Album.findAlbum(albumId);

        if (!album) {
            return res.status(404).json({
                success: false,
                message: 'Album not defined'
            }); 
        }

        const songs = await getSongByAlbumId(albumId);

        // console.log(songs);

        songs.forEach(async(song) => {
            if (song.cover_public_id) {
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

            if (song.audio_public_id) {
                try {
                    await deleteFromCloudinary(
                        song.audio_public_id,
                        "video"
                    );
                } catch (deleteError) {
                    console.error(
                        "Old audio delete failed:",
                        deleteError
                    );
                }
            }

            await deleteSong(song.song_id);

        });

        await Album.deleteAlbum(userId, albumId);

        if (album) {
            return res.status(201).json({
                success: true,
                data: {
                    albumId
                },
                message: "Album deleted successfully"
            }); 
        }

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateAlbum = async (req, res) => {

    const uploadedAudios = [];
    const uploadedCovers = [];

    try {

        const {
            albumId,
            songsCount,
            newSongCount
        } = req.params;

        const songCount = parseInt(songsCount);
        const newSongs = parseInt(newSongCount);

        const userId = req.user.id;

        const { albumName } = req.body || {};

        // console.log(req.params);

        // ==================================
        // VALIDATION
        // ==================================

        if (!userId || !albumId) {

            return res.status(400).json({
                success: false,
                message: "User or Album not defined"
            });

        }


        // ==================================
        // FIND ALBUM
        // ==================================

        const album =
            await Album.findAlbum(
                parseInt(albumId)
            );


        if (!album) {

            return res.status(404).json({
                success: false,
                message: "Album not found"
            });

        }


        // ==================================
        // CHECK OWNERSHIP
        // ==================================

        if (
            Number(album.uploadedBy) !==
            Number(userId)
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });

        }


        // ==================================
        // GET EXISTING SONGS
        // ==================================

        const songs =
            await getSongByAlbumId(albumId);

        const updatedSongs = [];


        // ==================================
        // UPDATE EXISTING SONGS
        // ==================================

        for (let i = 0; i < songCount; i++) {

            const song = songs[i];

            if (!song) continue;

            const title =
                req.body?.[`songs[${i}].title`];

            const artist =
                req.body?.[`songs[${i}].artist`];

            const cover =
                req.files?.[
                    `songs[${i}].poster`
                ]?.[0];


            const updatedSong = {};

            // ==================================
            // ONLY UPDATE IF FIELD WAS SENT
            // ==================================

            if (title !== undefined) {
                updatedSong.title = title.trim();
            }

            if (artist !== undefined) {
                updatedSong.artist = artist.trim();
            }

            if (albumName !== undefined) {
                updatedSong.album = albumName.trim();
            }


            // ==================================
            // ONLY UPLOAD IF NEW POSTER SENT
            // ==================================

                if (cover) {

                    const newImage =
                        await uploadToCloudinary(
                            cover,
                            "covers",
                            "image"
                        );

                    updatedSong.coverUrl =
                        newImage.url;

                    updatedSong.coverPublicId =
                        newImage.publicId;


                    // DB update ke baad old image delete
                }


                // ==================================
                // NOTHING CHANGED
                // ==================================

                if (
                    Object.keys(updatedSong).length === 0
                ) {
                    continue;
                }


                // ==================================
                // UPDATE ONLY CHANGED DATA
                // ==================================

                await updateSong(
                    song.song_id,
                    updatedSong
                );


            // ==================================
            // DELETE OLD POSTER ONLY IF
            // NEW POSTER WAS UPLOADED
            // ==================================

            if (
                cover &&
                updatedSong.coverPublicId &&
                song.cover_public_id
            ) {

                try {

                    await deleteFromCloudinary(
                        song.cover_public_id,
                        "image"
                    );

                } catch (error) {

                    console.error(
                        "Old poster delete failed:",
                        error
                    );

                }

            }


            updatedSongs.push({
                song_id: song.song_id,
                ...updatedSong
            });

        }


        // ==================================
        // ADD NEW SONGS
        // ==================================

        for (
            let i = 0;
            i < newSongs;
            i++
        ) {

            const title =
                req.body[
                    `newSong[${i}].title`
                ];

            const artist =
                req.body[
                    `newSong[${i}].artist`
                ];


            const poster =
                req.files?.[
                    `newSong[${i}].poster`
                ]?.[0];


            const audio =
                req.files?.[
                    `newSong[${i}].audio`
                ]?.[0];


            // ==================================
            // VALIDATION
            // ==================================

            if (
                !title?.trim() ||
                !artist?.trim() ||
                !poster ||
                !audio
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Invalid data for new song ${i + 1}`

                });

            }


            // ==================================
            // CLOUDINARY UPLOAD
            // ==================================

            const [
                audioResult,
                coverResult
            ] = await Promise.all([

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


            uploadedAudios.push(
                audioResult.publicId
            );

            uploadedCovers.push(
                coverResult.publicId
            );


            // ==================================
            // SAVE SONG
            // ==================================

            await createSong({

                title:
                    title.trim(),

                artist:
                    artist.trim(),

                album_id:
                    parseInt(albumId),

                audio_url:
                    audioResult.url,

                audio_public_id:
                    audioResult.publicId,

                cover_url:
                    coverResult.url,

                cover_public_id:
                    coverResult.publicId,

                uploadBy:
                    userId

            });

        }


        // ==================================
        // UPDATE ALBUM NAME
        // ==================================

        if (
            albumName !== undefined &&
            albumName.trim() !== "" &&
            albumName.trim() !== album.albumName
        ) {

            await Album.updateAlbum(
                albumName.trim(),
                parseInt(albumId)
            );

        }


        // ==================================
        // RESPONSE
        // ==================================

        return res.status(200).json({

            success: true,

            data: {

                albumId:
                    parseInt(albumId),

                albumName:
                    albumName ||
                    album.albumName,

                songs:
                    updatedSongs

            },

            message:
                "Album updated successfully"

        });


    } catch (error) {

        console.error(
            "Album update error:",
            error
        );


        // ==================================
        // ROLLBACK NEW CLOUDINARY FILES
        // ==================================

        for (
            const publicId of uploadedAudios
        ) {

            try {

                await deleteFromCloudinary(
                    publicId,
                    "video"
                );

            } catch (err) {

                console.error(
                    "Rollback audio failed:",
                    err
                );

            }

        }


        for (
            const publicId of uploadedCovers
        ) {

            try {

                await deleteFromCloudinary(
                    publicId,
                    "image"
                );

            } catch (err) {

                console.error(
                    "Rollback cover failed:",
                    err
                );

            }

        }


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Album update failed"

        });

    }

};


// exports.updateAlbum = async (req, res) => {

//     try {

//         const uploadedAudios = [];
//         const uploadedCovers = [];

//         const { albumId, songCount, newSongCount } = req.params;
//         const userId = req.user.id;
//         const { albumName } = req.body;

//         // ==============================
//         // VALIDATION
//         // ==============================

//         if (!userId || !albumId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User or Album not defined"
//             });
//         }


//         // ==============================
//         // FIND ALBUM
//         // ==============================

//         const album = await Album.findAlbum(parseInt(albumId));

//         if (!album) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Album not found"
//             });
//         }


//         // ==============================
//         // CHECK OWNERSHIP
//         // ==============================

//         if (
//             Number(album.uploadedBy) !==
//             Number(userId)
//         ) {

//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized"
//             });

//         }


//         // ==============================
//         // GET ALBUM SONGS
//         // ==============================

//         const songs = await getSongByAlbumId(albumId);

//         const updatedSongs = [];


//         // ==============================
//         // UPDATE SONGS
//         // ==============================

//         for (let i = 0; i < parseInt(songCount); i++) {

//             const song = songs[i];

//             let newImage = null;

//             const title =
//                 req.body[`songs[${i}].title`];

//             const artist =
//                 req.body[`songs[${i}].artist`];


//             // ==========================
//             // POSTER
//             // ==========================

//             const cover =
//                 req.files?.[
//                     `songs[${i}].poster`
//                 ]?.[0];


//             const updatedSong = {};


//             // ==========================
//             // TEXT FIELDS
//             // ==========================

//             if (title) {
//                 updatedSong.title = title;
//             }

//             if (artist) {
//                 updatedSong.artist = artist;
//             }

//             if (albumName) {
//                 updatedSong.album = albumName;
//             }


//             // ==========================
//             // NEW IMAGE
//             // ==========================

//             if (cover) {

//                 newImage = await uploadToCloudinary(
//                     cover,
//                     "covers",
//                     "image"
//                 );

//                 updatedSong.coverUrl =
//                     newImage.url;

//                 updatedSong.coverPublicId =
//                     newImage.publicId;
//             }


//             // ==========================
//             // UPDATE DATABASE
//             // ==========================

//             if (Object.keys(updatedSong).length > 0) {

//                 await updateSong(
//                     song.song_id,
//                     updatedSong
//                 );

//             }


//             // ==========================
//             // DELETE OLD IMAGE
//             // ==========================

//             if (
//                 newImage?.publicId &&
//                 song.cover_public_id
//             ) {

//                 try {

//                     await deleteFromCloudinary(
//                         song.cover_public_id,
//                         "image"
//                     );

//                 } catch (deleteError) {

//                     console.error(
//                         "Old image delete failed:",
//                         deleteError
//                     );

//                 }

//             }


//             updatedSongs.push({
//                 song_id: song.song_id,
//                 ...updatedSong
//             });

//         }

//         for(let i = 0; i < parseInt(newSongCount); i++){
//             const title =
//                 req.body[`newSong[${i}].title`];

//             const artist =
//                 req.body[`newSong[${i}].artist`];


//             const poster =
//                 req.files?.[
//                     `newSong[${i}].poster`
//                 ]?.[0];

//             const audio =
//                 req.files?.[
//                     `newSong[${i}].audio`
//                 ]?.[0];


//             const [audioResult, coverResult] =
//                 await Promise.all([

//                     uploadToCloudinary(
//                         audio,
//                         "songs",
//                         "video"
//                     ),

//                     uploadToCloudinary(
//                         poster,
//                         "covers",
//                         "image"
//                     )

//                 ]);


//             // Track uploads for rollback

//             uploadedAudios.push(
//                 audioResult.publicId
//             );

//             uploadedCovers.push(
//                 coverResult.publicId
//             );


//             // =================================
//             // SAVE SONG
//             // =================================

//             await createSong({

//                 title: title.trim(),

//                 artist: artist.trim(),

//                 album_id: albumId,

//                 audio_url: audioResult.url,

//                 audio_public_id:
//                     audioResult.publicId,

//                 cover_url: coverResult.url,

//                 cover_public_id:
//                     coverResult.publicId,

//                 uploadBy: userId

//             });

//         }


//         // ==============================
//         // UPDATE ALBUM NAME
//         // ==============================

//         if (albumName) {

//             await Album.updateAlbum(
//                 albumName,
//                 parseInt(albumId)
//             );

//         }


//         // ==============================
//         // RESPONSE
//         // ==============================

//         return res.status(200).json({

//             success: true,

//             data: {
//                 albumId:parseInt(albumId),
//                 albumName,
//                 songs: updatedSongs
//             },

//             message: "Album updated successfully"

//         });


//     } catch (error) {

//         console.error(
//             "Album update error:",
//             error
//         );


//         return res.status(500).json({

//             success: false,

//             message:
//                 "Album update failed"

//         });

//     }

// };

// exports.updateAlbum = async (req, res) =>{
//     let newImage = null;

//     try{
//         const {albumId} = req.params;
//         const userId = req.user.id;
//         const {albumName} = req.body;

//         if (!userId || !albumId) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not defined'
//             });
//         }

//         const album = await Album.findAlbum(userId);

//           // Check Ownership
//         if (album.uploadedBy !== userId) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         const songs = await getSongByAlbumId(albumId);

//         songs.forEach(async (song, i) =>{

//             const title =
//                 req.body[`songs[${i}].title`];

//             const artist =
//                 req.body[`songs[${i}].artist`];


//             // -----------------------------
//             // FILE DATA
//             // -----------------------------

//             const cover =
//                 req.files?.[
//                     `songs[${i}].poster`
//                 ]?.[0];

                
//             const updatedSong = {};

//             // Text Fields
//             if (title) {
//                 updatedSong.title = title;
//             }

//             if (artist) {
//                 updatedSong.artist = artist;
//             }

//             if (album) {
//                 updatedSong.album = album;
//             }

//             // Image
//             if (cover) {
//                 // Upload New Image First
//                 // This is safer because old image is not
//                 // deleted if new upload fails.
//                 newImage = await uploadToCloudinary(
//                     cover,
//                     "covers",
//                     "image"
//                 );

//                 updatedSong.coverUrl = newImage.url;
//                 updatedSong.coverPublicId = newImage.publicId;
//             }

//             await updateSong(song.song_id, updateSong);

//             // Delete Old Image After DB Update
//             if (
//                 newImage?.publicId &&
//                 song.cover_public_id
//             ) {
//                 try {
//                     await deleteFromCloudinary(
//                         song.cover_public_id,
//                         "image"
//                     );
//                 } catch (deleteError) {
//                     console.error(
//                         "Old image delete failed:",
//                         deleteError
//                     );
//                 }
//             }
//         });

//         if (albumName) {
//             await Album.updateAlbum(albumName, albumId);
//         }

//         return res.status(200).json({
//             success: true,
//             data: updatedSong,
//             message: "Album updated successfully"
//         });

//     }catch(error){
//         console.log('Error: ', error.message);

//         // Rollback newly uploaded image
//         if (newImage?.publicId) {
//             try {
//                 await deleteFromCloudinary(
//                     newImage.publicId,
//                     "image"
//                 );
//             } catch (deleteError) {
//                 console.error(
//                     "New image rollback failed:",
//                     deleteError
//                 );
//             }
//         }

//         return res.status(500).json({
//             success: false,
//             message: " Album udation is failed"
//         })
//     }
// }

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