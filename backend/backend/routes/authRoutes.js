const express = require("express");

const router = express.Router();

const {

    register,

    login,

    deleteAccount

} = require("../controllers/authController");



router.post("/register", register);

router.post("/login", login);

router.delete('/:userId', deleteAccount);

module.exports = router;