const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization header missing"

            });

        }

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message: "Invalid Token Format"

            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        req.user = decoded;

        next();

    }

    catch (err) {

        return res.status(401).json({

            success: false,

            message: "Invalid or Expired Token"

        });

    }

}

module.exports = verifyToken;