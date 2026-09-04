const { pool } = require("../config/db");

async function uploadAlbum(albumName, userId) {
    const sql = `
                INSERT INTO albums
                (albumName, uploadedBy)
                VALUES
                (
                    ?, ?
                )
                `;

    const [result] = await pool.query(sql, [
        albumName,
        userId
    ]);
    return result.insertId;
}

// async function getAllAlbums() {
//     const sql = `
//         SELECT 
//             a.album_id,
//             a.albumName, 
//             a.uploadedBy, 
//             a.created_at,
//             s.song_id, 
//             s.title,
//             s.artist, 
//             s.cover_url,
//             s.cover_public_id,
//             s.audio_url, 
//             s.audio_public_id,
//             users.Name AS uploadBy , 
//             s.likes
//         FROM albums a 
//         LEFT JOIN songs s ON 
//         a.album_id = s.album_id 
//         INNER JOIN users 
//         ON s.uploadBy = users.UserId
//         ORDER BY s.likes DESC 
//     `;

//     const [result] = await pool.query(sql);

//     return result[0];
// }

async function deleteAlbum(userId) {
    const sql = `
       DELETE FROM Album WHERE uploadedBy = ?     
    `;
    const [result] = await pool.query(sql, [userId])
};

module.exports = {
    uploadAlbum,
    deleteAlbum
}