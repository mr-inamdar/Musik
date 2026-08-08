const User = require("../models/User");
const bcrypt = require("bcrypt");


exports.verifyPasswoard = async (req, res) =>{
    try{
        const {enteredPass} = req.body;
        const id = req.user.id;

        if (!enteredPass) {
            return res.status(400).json({

                success:false,

                message:"Password required"

            })
        }

        const userE = await User.findById(id);

        if(!userE){

            return res.status(401).json({

                success:false,

                message:"User are not defined"

            });
        }
        const user = await User.findByEmail(userE.Email);

        console.log(enteredPass, user.Password, user);
        const isMatch = await bcrypt.compare(
            
            enteredPass,

            user.Password

        );

        if(!isMatch){

            return res.status(401).json({

                success:false,

                message:"Invalid Password"

            });

        }
        res.json({

            success:true,

            message:"Passwoard Confirm"

        });
    }
    catch(err){
        console.log("VERIFY PASSWOARD ERROR:", err);

        res.status(500).json({

            success:false,

            message:err.message

        });
    }
};


// exports.getProfile = async (req, res) => {

//     try {

//         const userId = req.user.id;

//         const user = await User.findById(userId);

//         if (!user) {

//             return res.status(404).json({

//                 success: false,

//                 message: "User not found"

//             });

//         }

//         return res.json({

//             success: true,

//             user

//         });

//     }

//     catch (err) {

//         return res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };