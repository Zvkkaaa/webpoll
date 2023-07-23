const jwt = require("jsonwebtoken");

const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler");
const users = require("../models/users");
const fs = require("fs");
const path = require("path");
const { raw } = require("body-parser");
const nodemailer = require("nodemailer");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Талбар дутуу байна",
    });
  }

  try {
    const existingUser = await users.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: email },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Бүртгэлтэй байна",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await users.create({
      username: username,
      email: email,
      password: encryptedPassword,
      role: "User",
    });

    const token = jwt.sign(
      {
        email: newUser.email,
        username: newUser.username,
        userid: newUser.userid,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRESIN,
      }
    );

    const verificationUrl = `http://localhost:8001/auth/verify/${token}`;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.MY_GMAIL,
      to: newUser.email,
      subject: "Бүртгүүлсэн хаягаа баталгаажуулах нь",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Email Verification</title>
            <style>
              body {
                background-color: #f5f5f5;
                font-family: Arial, sans-serif;
                color: #333333;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }

              h1 {
                font-size: 24px;
                color: #0066cc;
                margin-top: 0;
              }

              p {
                font-size: 16px;
                margin-bottom: 20px;
              }

              .button {
                display: inline-block;
                background-color: #0066cc;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 4px;
                transition: background-color 0.3s ease;
              }

              .button:hover {
                background-color: #0052a3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Бүртгүүлсэн хаягаа баталгаажуулах нь</h1>
              <p>Та хаягаа баталгаажуулахын тулд доорх холбоосоор дарна уу:</p>
              <p><a href="${verificationUrl}" class="button">Баталгаажуулах</a></p>
              <p>Энэ нь автоматаар илгээгдсэн имэйл болон таны бүртгэлийн мэдээллүүдийг баталгаажуулах зорилгоор явагдсан болно.</p>
              <p>Хаягаа баталгаажуулахад асуудал гарвал, та доорх имэйл хаяг руу холбогдоно уу: <a href="${process.env.MY_GMAIL}">${process.env.MY_GMAIL}</a></p>
            </div>
          </body>
        </html>
      `,
    });
    console.log(info.messageId);
    res.status(200).json({
      success: true,
      message: "Verification email sent",
      userid: newUser.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Серверийн алдаа",
    });
  }
});

exports.checkVerification = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await users.findOne({ where: { email } });

    if (user) {
      res.status(200).json({ verified: user.verified });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    console.log("aldaa end bn");
    return res.status(400).json({
      success: false,
      message: "Талбар дутуу байна",
    });
  }

  const existingUser = await users.findAll({
    where: {
      [Op.or]: [{ username: username }, { email: email }],
    },
  });

  if (existingUser.length > 0) {
    return res.status(500).json({
      success: false,
      message: "Бүртэлтэй байна",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(password, salt);
    console.log("burteneee");
    await users.create({
      username: username,
      email: email,
      password: encryptedPassword,
      role: role,
    });
    console.log("burtgetseeen");
    return res.status(200).json({
      success: true,
      // token: encryptedPassword,
      message: "Амжилттай бүртгэлээ",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Сервертэй холбогдож чадсангүй",
    });
  }
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  //method for admin that gets every users
  const userList = await users
    .findAll({
      raw: true,
      order: [["id", "DESC"]],
      raw: true,
    })
    .catch((err) => {
      res.status(500).json({
        message: "Серверийн алдаа",
      });
    });
  res.status(200).json({
    userList,
    message: "Хэрэглэгчийн жагсаалт",
  });
});

// bek wrote it, probably wrong
exports.getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const user = await users.findOne({
    where: {
      id: id
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  return res.status(200).json({
    success: true,
    user
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { email, username, password, role } = req.body;
  
  const user = await users.findOne({ where: { id: id } });
  
  if (user) {
    const updatedUserData = {};

    if (email) {
      updatedUserData.email = email;
    }
    if (username) {
      updatedUserData.username = username;
    }
    // Uncomment and update the password field if needed in the future
    // if (password) {
    //   updatedUserData.password = password;
    // }
    if (role) {
      updatedUserData.role = role;
    }

    await users.update(updatedUserData, { where: { id: id } });
    res.status(200).json("User info edited");
  } else {
    res.status(404).json("User doesn't exist");
  }
});

exports.getUsername = asyncHandler(async (req, res, next) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "unuuthesupp123@gmail.com",
      pass: process.env.MY_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: 'unuuthesupp123@gmail.com',
    to: "zvkkaaa@gmail.com",
    subject: "nodemailer testing from uunu",
    html: `<h1>tejv crying so bad</h1>`,
  });
  console.log(info.messageId);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await users.findOne({
    where: {
      id: id,
    },
  });

  if (user) {
    if (user.role !== "Admin") {
      await users.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json("User removed successfully!");
    } else {
      res.status(200).json("Can't remove admin!");
    }
  } else {
    res.status(404).json("User doesn't exist");
  }
});

//deleting unverified users!!!
exports.deleteUnverifiedUsers = asyncHandler(async(req,res,next)=>{
  await users.destroy({
    where: {
      verified:false,
    },
  });
  return res.status(200).json({
    status:true,
    message:"deleted"
  });
});