// const express = require("express");

// const app = express();

// const port = 3000;


// app.listen(port, ()=>{
//     console.log(`Server is running at localhost:${port}`);
// });

require("dotenv").config(); // Secret information ko code se alag .env file mein safe rakhne ke liye

const express = require("express");
const cors = require("cors"); // Frontend (jaise React/Vue/Angular) ko Backend API se connect hone ki permission dene ke liye, middleware ko import karta hai

const authRoutes = require("./routes/authRoutes");
const userRoute = require('./routes/userRoutes');
const songRoutes = require("./routes/songRoutes");
const cloudinary = require("./config/cloudinary");
const playlistRoutes = require("./routes/playlistRoutes");
const albumRoutes = require('./routes/albumRoutes');

console.log(cloudinary.config());

const { connectDatabase } = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json()); // Jab frontend (jaise React, Android App, ya Postman) se backend server ko JSON format mein data bheja jata hai (jaise login Form data: {"username": "rahul", "password": "123"}), toh Node.js ko woh data directly samajh nahi aata.app.use(express.json()); lagane ke baad Express us JSON data ko automatic parse karke req.body mein daal deta hai, taaki aap usko code mein access kar sako.

app.use("/auth", authRoutes);

app.use('/users', userRoute);

app.use("/songs", songRoutes);

app.use(

    "/playlist",

    playlistRoutes

);

app.use('/albums', albumRoutes);

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "Music API Running"

    });

});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {

    app.listen(PORT, () => {

        console.log(`🚀 Server Running on Port localhost:${PORT}`);

    });

});