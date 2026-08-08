const { pool } = require("../config/db");


// ==============================
// Create Playlist
// ==============================

async function createPlaylist(userId) {

    const sql = `

        INSERT INTO playlists
        (
            UserId
        )

        VALUES
        (
            ?
        )

    `;

    const [result] = await pool.query(sql, [

        userId

    ]);

    return result.insertId;

}


// ==============================
// Get Playlist
// ==============================

async function getPlaylist(userId) {

    const sql = `

        SELECT *

        FROM playlists

        WHERE UserId = ?

    `;

    const [rows] = await pool.query(sql, [

        userId

    ]);

    return rows[0];

}

async function addSongInPlaylist(PlaylistId, songId) {

    const sql = `

        INSERT INTO playlist_songs
        (
            PlaylistId,
            SongId
        )

        VALUES
        (
            ?,
            ?
        )

    `;

    const [result] = await pool.query(sql, [

        PlaylistId,
        songId

    ]);

    return result.insertId;
}

async function songExists(playlistId, songId) {
    const sql = `
        SELECT *

        FROM playlist_songs

        WHERE SongId = ? AND PlaylistId = ?
    `;

    const [row] = await pool.query(sql, [

        songId,
        playlistId

    ]);

    return row[0];
}

// async function getPlaylistSongs(PlaylistId) {
//     const sql = `
//         SELECT

//             s.song_id,
//             s.title,
//             s.artist,
//             s.album,
//             s.cover_url,
//             s.audio_url,
//             s.uploadBy

//         FROM playlist_songs ps

//         INNER JOIN songs s

//         ON ps.SongId = s.song_id

//         WHERE ps.PlaylistId = ?;
//     `;

//     const [row] = await pool.query(sql, [
//         PlaylistId
//     ])

//     return row;
// }

async function getPlaylistSongs(PlaylistId) {
    const sql = `
        SELECT
            s.song_id,
            s.title,
            s.artist,
            s.album,
            s.cover_url,
            s.cover_public_id,
            s.audio_url,
            s.audio_public_id,
            s.likes,
            u.Name AS uploadBy

        FROM playlist_songs ps

        INNER JOIN songs s
            ON ps.SongId = s.song_id

        INNER JOIN users u
            ON s.uploadBy = u.UserId

        WHERE ps.PlaylistId = ?;
    `;

    const [rows] = await pool.query(sql, [PlaylistId]);

    return rows;
}

async function deleteSong(playlistId, songId){
    const sql = `
        DELETE FROM playlist_songs
        WHERE SongId = ?
        AND PlaylistId = ?
    `;

    const [result] = await pool.query(sql, [
        songId,
        playlistId
    ]);

    return result.affectedRows;
}

async function deletePlaylist(playlistId) {

    const sql = `
        DELETE FROM playlists
        WHERE PlaylistId = ?
    `;

    const [result] = await pool.query(sql, [

        playlistId

    ]);

    return result.affectedRows;

}


module.exports = {

    createPlaylist,

    getPlaylist,

    addSongInPlaylist,

    songExists,

    getPlaylistSongs,

    deleteSong,

    deletePlaylist

};