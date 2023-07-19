const jwt = require("jsonwebtoken");
const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler");
const Users = require("../models/users");
const profile = require("../models/upload");
// const io = require('socket.io');
const loggedUsers = [];
exports.Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Параметр дутуу байна.",
    });
  }

  const user = await Users.findOne({
    where: {
      email: email,
      verified: true,
    },
  });

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Бүртгэлгүй байна",
    });
  }

  const oldPassword = user.password;

  const passwordMatch = await bcrypt.compare(password, oldPassword);

  if (passwordMatch) {
    const attributes = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(
      {
        userid: attributes.id,
        username: attributes.username,
        email: attributes.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRESIN,
      }
    );

    const index = loggedUsers.findIndex((user) => user.username === attributes.username);

    if (index !== -1) {
      loggedUsers[index].online = true;
      console.log(loggedUsers[index].online);
    }

    return res.status(200).json({
      success: true,
      message: "Амжилттай нэвтэрлээ",
      token,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Нэвтрэх нэр эсвэл нууц үг буруу байна",
    });
  }
});

// exports.Login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   //console.log(req.body)

//   if (!email || !password) {
//     res.status(400).json({
//       success: false,
//       message: "Параметр дутуу байна.",
//     });
//     return;
//   }

//   await Users.findOne({
//     where: {
//       email: email,
//       verified: true,
//     },
//   })
//     .then((result) => {
//       //console.log("******", result);
//       if (result == null) {
//         res.status(500).json({
//           success: false,
//           message: "Бүртгэлгүй байна",
//         });
//         return;
//       }
//       const oldPassword = result.password;

//       bcrypt.compare(password, oldPassword).then(async (result) => {
//         if (result == true) {
//           const attributes = await Users.findOne({
//             attributes: ["id", "username", "email"],
//             where: {
//               [Op.and]: [
//                 {
//                   email,
//                 },
//               ],
//             },
//           });

//           const userid = attributes.id;
//           const username = attributes.username;
//           const token = jwt.sign(
//             {
//               userid,
//               username,
//               email,
//             },
//             process.env.JWT_SECRET,
//             {
//               expiresIn: process.env.JWT_EXPIRESIN,
//             }
//           );
//           //  const token = userController.generateJwt(userid, roleid);
//             console.log(token);
//             console.log("this user becomes logged");
//             //update online to true using username
//             const index = loggedUsers.findIndex((user) => user.username === username);
//             console.log("======================"+index)
//             if (index !== -1){loggedUsers[index].online = true;
//             } 
//           res.status(200).json({
//             success: true,
//             message: "Амжилттай нэвтэрлээ",
//             token,
//           });
          
//           return;
//         } else {
//           res.status(400).json({
//             success: false,
//             message: "Нэвтрэх нэр эсвэл нууц үг буруу байна",
//           });
//         }
//       });
//     })
//     .catch((err) => {
//       // console.log(err)
//       // logger.error("Алдаа гарлаа: " + err);
//       return res.status(500).json({
//         success: false,
//         message: "Серверийн алдаа",
//       });
//     });
// });

exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //console.log(req.body)
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "Параметр дутуу байна.",
    });
    return;
  }
  await Users.findOne({
    where: {
      email: email,
    },
  }).then((result) => {
      //console.log("******", result);
      if (result == null) {
        res.status(500).json({
          success: false,
          message: "Бүртгэлгүй байна",
        });
        return;
      }
      if(result.role === "User"){
        res.status(500).json({
          success:false,
          message: "Бүртгэлтэй админ биш!",
        });
        return;
      }
      const oldPassword = result.password;

      bcrypt.compare(password, oldPassword).then(async (result) => {
        if (result == true) {
          const attributes = await Users.findOne({
            attributes: ["id", "username", "email"],
            where: {
              [Op.and]: [
                {
                  email,
                },
              ],
            },
          });

          const userid = attributes.id;
          const username = attributes.username;
          const token = jwt.sign(
            {
              userid,
              username,
              email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRESIN,
            }
          );
          //  const token = userController.generateJwt(userid, roleid);
          //   console.log("login authorized!!!!!")
          res.status(200).json({
            success: true,
            message: "Амжилттай нэвтэрлээ",
            token,
          });
          return;
        } else {
          console.log("this");
          res.status(400).json({
            success: false,
            message: "Нэвтрэх нэр эсвэл нууц үг буруу байна",
          });
        }
      });
    })
    .catch((err) => {
      // console.log(err)
      // logger.error("Алдаа гарлаа: " + err);
      return res.status(500).json({
        success: false,
        message: "Серверийн алдаа",
      });
    });
});


// exports.verifyUser = asyncHandler(async(req,res,next)=>{
//   const token = req.params.token;
//   console.log("got token as params!!!");
//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     const decoded = jwt.decode(token, { complete: true });
//     console.log("decoded successfully");
//     userid = decoded.payload.userid;
//     // req.login = decoded.payload.login;
//     // req.company_id = decoded.payload.company_id;
//     // req.is_type = decoded.payload.is_type;

//     // req.check_lot_id = decoded.payload.check_lot_id;
//     username = decoded.payload.username;
//     email = decoded.payload.email;
//     // // const connection_id = "odoo_undram";
//     // // req.odoo_conn = odoo[connection_id];
//     const user = await Users.findOne({
//       where:{
//         [Op.and]:[{email:email},{username:username}],
//       }
//     });
//     console.log("found user info ---------"+user.username);
//     if(user){await Users.update(
//       {
//       verify: true || null
//     },{
//       where:{
//         [Op.and]:[{email:email},{username:username}],
//       }
//     }
//     );
//     console.log("verification successfully!!!");

//   }

//   } catch (err) {
//     res.status(401).json({
//       success: false,
//       message: "Токен хүчингүй байна.",
//       err,
//     });
//     return;
//   }
// });
exports.verifyUser = asyncHandler(async (req, res, next) => {
  const token = req.params.token;
  console.log("got token as params!!!");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.decode(token, { complete: true });
    console.log("decoded successfully");
    userid = decoded.payload.userid;
    username = decoded.payload.username;
    email = decoded.payload.email;

    const user = await Users.findOne({
      where: {
        email: email,
        username: username
      }
    });
    console.log("found user info ---------" + user.verified);
    if (user) {
      await Users.update(
        {
          verified: true
        },
        {
          where: {
            email: email,
            username: username
          }
        }
      );
      console.log("verification successful!!!");
      // const url = `http://localhost:3000/auth/login`
      res.status(200).json(
        `Цахим хаягыг баталгаажуулсан тул уг цонхыг хааж болно`
      );
    }

  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Токен хүчингүй байна.",
      err,
    });
    return;
  }
});
exports.changePassword= asyncHandler(async (req, res, next) => {
  const { oldPass, newPass, newPass2} = req.body;
  const email = req.email;
  console.log(email, oldPass, newPass, newPass2);
  if(newPass !==newPass2) {
    return res.status(400).json({
      success:false,
      message:"Passwords not match"
    });
  }
  await Users.findOne({
    where: {
      email: email,
      verified: true,
    },
  })
    .then((result) => {
      //console.log("******", result);
      console.log("found result: "+result.username);
      if (result == null) {
        res.status(500).json({
          success: false,
          message: "Бүртгэлгүй байна",
        });
        return;
      }
      const oldPassword = result.password;
      const id = result.id;
      bcrypt.compare(oldPass, oldPassword).then(async (result) => {
        if (result == true) {
          console.log("old password matched");
          //end shine pass davslah yostoi
          const salt = await bcrypt.genSalt(10);
          const encryptedPassword = await bcrypt.hash(newPass, salt);
          let changePass ={};
        changePass.password = encryptedPassword;
        console.log("updating password")
          await Users.update(changePass, { where: { id:id } });
          res.status(200).json({
            success: true,
            message: "Changed password",
          });
          return;
        } else {
          res.status(400).json({
            success: false,
            message: "Old password is wrong",
          });
        }
      });
    });

});
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  console.log("Fetching logged users...");

  const users = await Users.findAll({
    where: {
      verified: true
    }
  });

  const loggedUsers = [];

  for (let i in users) {
    console.log("Creating user list with offline logged user...");
    const username = users[i].username;
    const profilePic = await profile.findOne({
      where: {
        userid: users[i].id
      }
    });
    const online = false;
    const userList = {
      username: username,
      path: `/image/displayWithUsername/${username}`, // Endpoint to serve the image file directly
      online: online,
    };
    loggedUsers.push(userList);
  }

  console.log("Fetched logged users:", loggedUsers);

  return res.status(200).json(loggedUsers);
});

exports.disconnect = asyncHandler(async (req, res, next) => {
  const disco = req.params.username;
  //gonna fix with update not delete
  //just update online value to false with it 
  const index = loggedUsers.findIndex((user) => user.username === disco);
  console.log("======================"+index)
  if (index !== -1) {
    loggedUsers[index].online = false;
    return res.status(200).json({
      success: true,
      message: "User disconnected",
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});
exports.initializeLoggedUsers = asyncHandler(async(req,res,next)=>{
//this one has to be called instantly after back on?
  const users = await Users.findAll();
  for(let i in users){
    const username = users[i].username;
    const profilePic = await profile.findOne({
      where: {
        userid:users[i].id
      }
    });
    const online = false;
    const userList ={
      username:username,
      path:profilePic.path,
      online:online,
    }
    loggedUsers.push(userList);
  }    
});
