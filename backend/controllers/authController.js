// const bcrypt = require("bcrypt");
// const User = require("../models/User");

// exports.register = async (req, res) => {

//     try {

//         const { name, email, password } = req.body;

//         // Validation
//         if (!name || !email || !password) {

//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });

//         }

//         // Check email
//         const existingUser = await User.findByEmail(email);

//         if (existingUser) {

//             return res.status(400).json({
//                 success: false,
//                 message: "Email already exists"
//             });

//         }

//         // Hash Password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Save User
//         const userId = await User.createUser({

//             name,
//             email,
//             password: hashedPassword

//         });

//         return res.status(201).json({

//             success: true,
//             message: "Account created successfully",

//             userId

//         });

//     }

//     catch (error) {

//         console.log(error);

//         return res.status(500).json({

//             success: false,

//             message: "Internal Server Error"

//         });

//     }

// };


// // const User = require("../models/User");

// // exports.register = async (req, res) => {

// //     try {

// //         const {

// //             name,
// //             email,
// //             password

// //         } = req.body;

// //         const existingUser = await User.findByEmail(email);

// //         if (existingUser) {

// //             return res.status(400).json({

// //                 success: false,
// //                 message: "Email already exists"

// //             });

// //         }

// //         const userId = await User.createUser({

// //             name,
// //             email,
// //             password

// //         });

// //         return res.status(201).json({

// //             success: true,
// //             message: "User Created",

// //             userId

// //         });

// //     }

// //     catch (err) {

// //         return res.status(500).json({

// //             success: false,

// //             message: err.message

// //         });

// //     }

// // };

// // exports.register = async (req, res) => {

// //     try {

// //         const {

// //             name,

// //             email,

// //             password

// //         } = req.body;

// //         console.log(req.body);

// //         return res.status(201).json({

// //             success: true,

// //             message: "Register Controller Working",

// //             data: {

// //                 name,

// //                 email,

// //                 password

// //             }

// //         });

// //     }

// //     catch (error) {

// //         return res.status(500).json({

// //             success: false,

// //             message: error.message

// //         });

// //     }

// // };



// exports.login = async (req, res) => {

//     res.json({

//         success: true,

//         message: "Login Controller Working"

//     });

// };


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const {deleteFromCloudinary} = require('../utils/cloudinaryHelper');



exports.register = async (req,res)=>{

    try{

        const {name,email,password}=req.body;

        if(!name || !email || !password){

            return res.status(400).json({

                success:false,

                message:"All fields are required"

            });

        }

        const existingUser=await User.findByEmail(email);

        if(existingUser){

            return res.status(400).json({

                success:false,

                message:"Email already exists"

            });

        }

        const hashedPassword=await bcrypt.hash(password,10);

        const result = await User.createUser({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                id: result,
                email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(201).json({
            success: true,
            message: "Account Created",
            token,
            user: {
                id: result,
                name,
                email
            }
        });

        // const user = await User.createUser({

        //     name,

        //     email,

        //     password:hashedPassword

        // });

        // const token=jwt.sign(

        //     {

        //         id:user.UserId,

        //         email:user.Email

        //     },

        //     process.env.JWT_SECRET,

        //     {

        //         expiresIn:"7d"

        //     }

        // );

        // console.log(user, token)

        // res.status(201).json({

        //     success:true,

        //     message:"Account Created",

        //     token,

        //     user:{

        //         id:user.UserId,

        //         name:user.Name,

        //         email:user.Email

        //     }

        // });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};






exports.login=async(req,res)=>{

    try{

        const {email,password}=req.body;


        if(!email || !password){

            return res.status(400).json({

                success:false,

                message:"Email and Password required"

            });

        }

        const user=await User.findByEmail(email);

        if(!user){

            return res.status(401).json({

                success:false,

                message:"Invalid Email"

            });

        }

        

        const isMatch=await bcrypt.compare(

            password,

            user.Password

        );

        if(!isMatch){

            return res.status(401).json({

                success:false,

                message:"Invalid Password"

            });

        }

        const token=jwt.sign(

            {

                id:user.UserId,

                email:user.Email

            },

            process.env.JWT_SECRET,

            {

                expiresIn:"7d"

            }

        );

        res.json({

            success:true,

            message:"Login Successful",

            token,

            user:{

                id:user.UserId,

                name:user.Name,

                email:user.Email

            }

        });

    }

    catch(err){

        console.log("LOGIN ERROR:", err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};
exports.deleteAccount = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid User Id"
            });
        }

        const isUser = await User.findById(userId);

        if (!isUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const playlist = await Playlist.getPlaylist(userId);

        let playlistSongs = [];

        if (playlist) {
            playlistSongs = await Playlist.getPlaylistSongs(playlist.PlaylistId);
        }

        for (const song of playlistSongs) {
            await deleteFromCloudinary(song?.cover_public_id, "image");
            await deleteFromCloudinary(song?.audio_public_id, "video");
        }
        // console.log(playlistSongs)

        const allSongs = await Song.getMySongs(userId);

        for (const song of allSongs) {
            await deleteFromCloudinary(song?.cover_public_id, "image");
            await deleteFromCloudinary(song?.audio_public_id, "video");
        }

        // console.log(allSongs)

        const result = await User.deleteAccount(userId);

        // console.log(result)

        return res.status(200).json({
            success: true,
            result,
            message: "Account Deleted Successfully"
        });

    } catch (err) {
        console.log("DELETE ERROR:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// exports.deleteAccount = async(req, res)=>{
//     try{
//         const {userId} = req.params;

//         if (!userId) {
//             return res.status(401).json({

//                 success:false,

//                 message:"Invalid User Id"

//             });

//         }

//         const isUser = await User.findById(userId);

//         if (!isUser) {
//             return res.status(401).json({

//                 success:false,

//                 message:"User Not Found"

//             });
//         }

//         const result = await User.deleteAccount(userId)

//         res.json({

//             success:true,

//             result,

//             message:"Account Deleted Successful"

//         });

//     }
//     catch(err){

//         console.log("DELETE ERROR:", err);

//         res.status(500).json({

//             success:false,

//             message:err.message

//         });

//     }
// }