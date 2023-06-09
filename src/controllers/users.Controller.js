const jwt = require("jsonwebtoken");

const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler")
const users = require("../sequelize/models/users");
const fs = require("fs");
const path = require("path"); 
const { raw } = require("body-parser");
exports.createUsers = asyncHandler(async (req, res, next) => {
    //Бүртгүүлэх хэсэг
    const { username, email, password, birthdate} = req.body;
  
    if (!username || !email || !password || !birthdate) {
      return res.status(400).json({
        success: false,
        message: "Талбар дутуу байна",
      });
    }
  
    await Users.findAll({
      where: {
        [Op.and]: [
          {
            username: username,
          },
          {
            email: email,
          },
         
        ],
      },
    })
      .then(async (result) => {
        if (result == null) {
          const salt = await bcrypt.genSalt(10);
          let encryptedPassword = await bcrypt.hash(password, salt);
  
          await Users.create({
            username: username,
            email: email,
            password: encryptedPassword,
            birthdate: birthdate,
            role: 'User'
          }).then(async (result) => {
            return res.status(200).json({
              success: true,
              // token: encryptedPassword,
              message: "Амжилттай бүртгэлээ",
            });
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Бүртэлтэй байна",
          });
          return;
        }
      })
      .catch((err) => {
        logger.error("Алдаа гарлаа: " + err);
        return res.status(500).json({
          success: false,
          message: "Серверийн алдаа",
        });
      });
  });

  exports.getUsers = asyncHandler(async (req,res,next) => {
    //method for admin that gets every users
      await users.findAll({
        raw: true,   
        order: [["id","DESC"]],
        raw: true,
      }).catch((err) => {
        res.status(500).json({
          message: "Серверийн алдаа",
        });
      });
      res.status(200).json({
      users,
      message: "Хэрэглэгчийн жагсаалт"
      });
    });  