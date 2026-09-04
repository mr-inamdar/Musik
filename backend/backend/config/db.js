const mysql = require("mysql2/promise");

const pool = mysql.createPool({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

async function connectDatabase(){

    try{

        const connection = await pool.getConnection();

        console.log("✅ MySQL Connected");

        connection.release();

    }

    catch(err){

        console.error("❌ Database Connection Failed");

        console.error(err.message);

        process.exit(1);

    }

}

module.exports = {

    pool,

    connectDatabase

};