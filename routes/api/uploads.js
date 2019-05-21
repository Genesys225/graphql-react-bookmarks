const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./client/public/uploads",
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage
}).single("image-file");

router.post("/", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send({
          msg: "Error: No File Selected!"
        });
      } else {
        res.send({
          msg: "File Uploaded!",
          file: `uploads/${JSON.stringify(req.file, null, 2)}`
        });
      }
    }
  });
});

module.exports = router;
