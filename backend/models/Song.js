const { pool } = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get All Songs
|--------------------------------------------------------------------------
*/

async function getAllSongs() {

    // const sql = `
    //     SELECT
    //         song_id,
    //         title,
    //         artist,
    //         album,
    //         cover_url,
    //         audio_url,
    //         created_at,
    //         uploadBy
    //     FROM songs
    //     ORDER BY  likes DESC, created_at DESC
    // `;

    const sql = `
        SELECT
            songs.song_id,
            songs.title,
            songs.artist,
            songs.album,
            songs.cover_url,
            songs.audio_url,
            songs.likes,
            users.Name AS uploadBy
        FROM songs
        INNER JOIN users
        ON songs.uploadBy = users.UserId
        ORDER BY likes DESC, created_at ASC
    `;

    const [rows] = await pool.query(sql);

    return rows;
}

/*
|--------------------------------------------------------------------------
| Get Song By ID
|--------------------------------------------------------------------------
*/

async function getSongById(id) {

    const sql = `
        SELECT *
        FROM songs
        WHERE song_id = ?
        LIMIT 1
    `;

    const [rows] = await pool.query(sql, [id]);

    return rows[0];
}

/*
|--------------------------------------------------------------------------
| Create Song
|--------------------------------------------------------------------------
*/

async function createSong(song) {

    const sql = `

        INSERT INTO songs(
            title,
            artist,
            album,
            cover_url,
            cover_public_id,
            audio_url,
            audio_public_id,
            uploadBy
        )
        VALUES(?,?,?,?,?,?,?,?)

    `;

    const [result] = await pool.query(sql,[

        song.title,

        song.artist,

        song.album,

        song.cover_url,

        song.cover_public_id,

        song.audio_url,

        song.audio_public_id,

        song.uploadBy
    ]);

    return result.insertId;

}
// async function getTopSongs() {

//     const sql = `

//         SELECT *

//         FROM songs

//         ORDER BY
//             likes DESC,
//             created_at DESC

//     `;

//     const [rows] = await pool.query(sql);

//     return rows;

// }

// async function createSong(song) {

//     const sql = `
//         INSERT INTO songs
//         (
//             title,
//             artist,
//             album,
//             image,
//             audio
//         )
//         VALUES
//         (
//             ?,?,?,?,?
//         )
//     `;

//     const [result] = await pool.query(sql, [

//         song.title,
//         song.artist,
//         song.album,
//         song.image,
//         song.audio

//     ]);

//     return result.insertId;
// }

/*
|--------------------------------------------------------------------------
| Delete Song
|--------------------------------------------------------------------------
*/

async function deleteSong(id){

    const sql = `
        DELETE FROM songs
        WHERE song_id=?
    `;

    await pool.query(sql,[id]);

}

// async function updateSong(songId, song) {

//     const sql = `
//         UPDATE songs
//         SET
//             title=?,
//             artist=?,
//             album=?
//             cover_url=?,
//             cover_public_id=?
//         WHERE song_id=?
//     `;

//     await pool.query(sql, [
//         song.title,
//         song.artist,
//         song.album,
//         song.coverUrl,
//         song.coverPublicId,
//         songId
//     ]);
// }

async function updateSong(songId, song) {

    const fields = [];
    const values = [];

    if (song.title !== undefined) {
        fields.push("title=?");
        values.push(song.title);
    }

    if (song.artist !== undefined) {
        fields.push("artist=?");
        values.push(song.artist);
    }

    if (song.album !== undefined) {
        fields.push("album=?");
        values.push(song.album);
    }

    if (song.coverUrl !== undefined) {
        fields.push("cover_url=?");
        values.push(song.coverUrl);
    }

    if (song.coverPublicId !== undefined) {
        fields.push("cover_public_id=?");
        values.push(song.coverPublicId);
    }

    if (!fields.length) return;

    values.push(songId);

    const sql = `
        UPDATE songs
        SET ${fields.join(", ")}
        WHERE song_id=?
    `;

    await pool.query(sql, values);
}

async function getMySongs(userId) {

    const sql = `
        SELECT
            song_id,
            title,
            artist,
            album,
            cover_url,
            cover_public_id,
            audio_url,
            audio_public_id,
            likes,
            created_at
        FROM songs
        WHERE uploadBy = ?
        ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(sql, [userId]);

    return rows;

}

module.exports={

    getAllSongs,
    getSongById,
    createSong,
    deleteSong,
    updateSong,
    getMySongs

};