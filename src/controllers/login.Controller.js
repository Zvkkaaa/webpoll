const jwt = require("jsonwebtoken");

const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler");
const Users = require("../sequelize/models/users");

exports.Login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Параметр дутуу байна.",
      });
      return;
    }
  
    await Users.findOne({
      where: {
        [Op.and]: [
          {
            email,
          },
          {
            active: true,
          },
        ],
      },
    }).then((result) => {
      if (result == null) {
        res.status(500).json({
          success: false,
          message: "Бүртэлгүй байна",
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
                {
                  active: true,
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
    });
  });