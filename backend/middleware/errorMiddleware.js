const ApiError = require("../utils/ApiError");

const errorMiddleware = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;

    let message = err.message || "Internal Server Error";

    /*
    |--------------------------------------------------------------------------
    | MySQL Errors
    |--------------------------------------------------------------------------
    */

    if (err.code === "ER_DUP_ENTRY") {

        statusCode = 409;

        message = "Duplicate Entry.";

    }

    /*
    |--------------------------------------------------------------------------
    | JWT Errors
    |--------------------------------------------------------------------------
    */

    if (err.name === "JsonWebTokenError") {

        statusCode = 401;

        message = "Invalid Token.";

    }

    if (err.name === "TokenExpiredError") {

        statusCode = 401;

        message = "Token Expired.";

    }

    /*
    |--------------------------------------------------------------------------
    | Multer Errors
    |--------------------------------------------------------------------------
    */

    if (err.name === "MulterError") {

        statusCode = 400;

        message = err.message;

    }

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Errors
    |--------------------------------------------------------------------------
    */

    if (err.http_code) {

        statusCode = err.http_code;

    }

    return res.status(statusCode).json({

        success: false,

        statusCode,

        message

    });

};

module.exports = errorMiddleware;