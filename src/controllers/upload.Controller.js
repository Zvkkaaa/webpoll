const asyncHandler = require("../middleware/asyncHandler");
const multer = require("multer");
const e = require("express");
const img = require("../models/upload");
const path = require('path');

// Set up multer middleware
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'C:/Users/USER/Desktop/dadlaga/webpoll/src/upload');
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

const uploads = require("../models/upload");

// exports.uploadProfile = upload.single('image'), asyncHandler(async (req, res, next) => {
//   /* Multer adds a file property to the request object (req.file) once it has finished uploading the file.
//        You should check if req.file is set before accessing properties on it */

//   if (!req.file) {
//     return res.status(500).json('No file provided');
//   }

//   const {  userid } = req.userid;
//   const { filename, path, size, mimetype } = req.file;

//   await uploads.create({
//     userid:userid,
//     filename:filename,
//     path:path,
//     size:size,
//     mimetype:mimetype,
//   }).then((result) => {
//     return res.status(200).json("File uploaded");
//   }).catch((err) => {
//     return res.status(500).json(err);
//   });
// });
exports.uploadProfile = [upload.single('image'), asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(500).json('No file provided');
  }
const userid = req.userid;
  const { filename, path, size, mimetype } = req.file;

  await uploads.create({
    userid,
    filename,
    path,
    size,
    mimetype,
  })
  .then((result) => {
    return res.status(200).json("File uploaded");
  })
  .catch((err) => {
    return res.status(500).json(err);
  });
})];

exports.registerUploadProfile = [upload.single('image'), asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  const { filename, path, size, mimetype } = req.file;
  const userId = req.params.userid; // Get the userId from the route parameter

  try {
    await uploads.create({
      userid: userId,
      filename,
      path,
      size,
      mimetype,
    });
    
    return res.status(200).json({ success: true, message: 'File uploaded' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to upload file' });
  }
})];

exports.displayImage = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  console.log('User ID:', userId);
  let patho;
  const imageInfo = await uploads.findOne({
    where: {
      userid: userId,
    },
  });
  patho = imageInfo.path;
  console.log(patho);
  if (patho) {
    console.log('Image URL:', patho);
    res.sendFile(patho); // Serve the image file directly
  } else {
    return res.status(404).json({ error: 'Image not found' });
  }
});

//it does just remove tuple from db not delete image from upload folder in src
exports.deleteProfile = asyncHandler(async(req,res,next)=>{
  const userid = req.userid;  
  const profile = await uploads.findOne({
    where:{
      userid:userid,
    }
  });
  if(profile){
    //write function to remove that profile
    await uploads.destroy({ where: { userid: userid } });
    res.status(200).json({
      success:true,
      message: "Profile image has been deleted"
    })
  }
  else res.status(404).json("No such image found");
});

//it does updates tuple from db and upload image into /src/upload
exports.updateProfile = [upload.single('image'), asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(500).json('No file provided');
  }

  const userid = req.userid;
  const { filename, path, size, mimetype } = req.file;
  const previous = await uploads.findOne({
    where:{userid:userid}
  });
  if(!previous)   return next(new ErrorResponse("Poll not found", 404));
  
  const updatedProfileInfo = {};

  if (req.file) {
    updatedProfileInfo.filename = filename;
    updatedProfileInfo.path = path;
    updatedProfileInfo.size= size;
    updatedProfileInfo.mimetype= mimetype;
  }
  await uploads.update(updatedProfileInfo, { where: { userid: userid } })
  .then((result) => {
    return res.status(200).json("Updated profile");
  })
  .catch((err) => {
    return res.status(500).json(err);
  });
})];