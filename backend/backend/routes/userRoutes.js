const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {

    verifyPasswoard

} = require("../controllers/userController");



// router.get(

//     "/profile",

//     verifyToken,

//     getProfile

// );

router.post('/verifyPasswoard', verifyToken, verifyPasswoard);


module.exports = router;