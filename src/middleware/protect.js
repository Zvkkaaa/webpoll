const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const morgan = require("morgan");
const logger = morgan("combined");

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({
      success: false,
      message: "Нэвтэрсний дараа энэ үйлдлийг хийх боломжтой",
    });
    return;
  }
  //request-н header хэсгээс bearer токен авах
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Нэвтэрсний дараа энэ үйлдлийг хийх боломжтой",
    });
    return;
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.decode(token, { complete: true });

    req.userid = decoded.payload.userid;
    // req.login = decoded.payload.login;
    // req.company_id = decoded.payload.company_id;
    // req.is_type = decoded.payload.is_type;
   
    // req.check_lot_id = decoded.payload.check_lot_id;
    // // req.username = decoded.payload.username;
    // // const connection_id = "odoo_undram";
    // // req.odoo_conn = odoo[connection_id];

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Токен хүчингүй байна.",
      err,
    });
    return;
  }
});
