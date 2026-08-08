const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err);

    let statusCode = 500;
    let message = "Internal Server Error";

    if (err.code === "ER_DUP_ENTRY") {
        statusCode = 409;
        message = "Duplicate Entry.";
    } 
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Token.";
    } 
    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token Expired.";
    } 
    else if (err.name === "MulterError") {
        statusCode = 400;
        message = err.message;
    } 
    else if (err.http_code) {
        statusCode = err.http_code;
        message = err.message || "Cloudinary Error.";
    } 
    else if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    } 
    else if (err.message) {
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;
