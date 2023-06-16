const jwt = require("jsonwebtoken");

const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler");
const Users = require("../models/users");

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
    },
  })
    .then((result) => {
      console.log("******", result);
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
          //   console.log("login authorized!!!!!")
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