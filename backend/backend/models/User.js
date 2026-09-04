const { pool } = require("../config/db");

/*
|--------------------------------------------------------------------------
| Find User By Email
|--------------------------------------------------------------------------
*/

async function findByEmail(email) {

    const sql = `
        SELECT *
        FROM users
        WHERE Email = ?
        LIMIT 1
    `;

    const [rows] = await pool.query(sql, [email]);

    return rows[0];
}


/*
|--------------------------------------------------------------------------
| Find User By ID
|--------------------------------------------------------------------------
*/

async function findById(id) {

    const sql = `
        SELECT UserId,Name,Email
        FROM users
        WHERE UserId = ?
        LIMIT 1
    `;

    const [rows] = await pool.query(sql, [id]);

    return rows[0];
}


/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

async function createUser(user) {

    const sql = `
        INSERT INTO users
        (
            Name,
            Email,
            Password
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
    `;

    const [result] = await pool.query(sql, [

        user.name,
        user.email,
        user.password

    ]);

    return result.insertId;
}

async function deleteAccount(userId) {
    const sql = `
        DELETE FROM users
        WHERE UserId = ?;
    `;

    const [result] = await pool.query(sql, [userId]);

    return result.affectedRows;
}

module.exports = {

    findByEmail,
    findById,
    createUser,
    deleteAccount

};
