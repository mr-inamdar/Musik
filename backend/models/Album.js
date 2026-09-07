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

async function deleteAlbum(userId, albumId) {
    const sql = `
       DELETE FROM albums WHERE uploadedBy = ? AND album_id = ?    
    `;
    const [result] = await pool.query(sql, [userId, albumId]);

    return result.insertId;
};

async function findAlbum(albumId) {
    const sql = `
               SELECT * FROM albums 
               WHERE album_id = ?
    `;
    const [rows] = await pool.query(sql, [albumId]);console.log(rows);
    

    

    return rows[0];
}

async function updateAlbum(album_name, albumId) {
    sql = `UPDATE albums
            SET albumName = ?
            WHERE album_id = ?
    `;

    const [result] = await pool.query(sql, [album_name, albumId]);
}

module.exports = {
    uploadAlbum,
    deleteAlbum,
    findAlbum,
    updateAlbum
}