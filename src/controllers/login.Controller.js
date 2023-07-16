const jwt = require("jsonwebtoken");

const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler");
const Users = require("../models/users");
const io = require('socket.io');
exports.Login = asyncHandler(async (req, res, next) => {
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
      verified: true,
    },
  })
    .then((result) => {
      //console.log("******", result);
      if (result == null) {
        res.status(500).json({
          success: false,
          message: "Бүртгэлгүй байна",
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
            console.log(token);
          res.status(200).json({
            success: true,
            message: "Амжилттай нэвтэрлээ",
            token,
          });
          
          return;
        } else {
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

