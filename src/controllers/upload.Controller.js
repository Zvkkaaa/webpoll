const asyncHandler = require("../middleware/asyncHandler");
const multer = require("multer");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");

const img = require("../models/upload");
const dest = multer({ dest: 'uploads' });
const uploads = require("../models/upload");
exports.uploadProfile = asyncHandler(async (req, res, netx) => {
    const img = req.file;
    const userid = req.userid;
    const filename = img.filename;
    const path = img.path;
    const size = img.size;
    const mimetype = img.mimetype; 
    dest.single('image')(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(500).json(err); 
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json(err);
      } 
      
      // Everything went fine. Here, you can now add code to save file metadata to your database.
    });

    // Updated variable name for the Sequelize model instance.
    await uploads.create({
        userid: userid,
        filename: filename,
        path: path,
        size: size,
        mimetype: mimetype,
    })
    .then(async(result) => {
      res.status(200).json("File uploaded");
    })
});

exports.displayImage = asyncHandler(async(req,res,next)=>{
    
});