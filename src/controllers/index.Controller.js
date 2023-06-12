exports.indexFirstFunc=async(req, res) => {
  console.log(req);
  console.log(res);
  res.status(201).json({text:'GrandMaster'});
};

