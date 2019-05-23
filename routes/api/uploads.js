const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
var fs = require("fs");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const witeDir = `./client/public/uploads/${file.fieldname}/${req.base64Id}/`;
    if (!fs.existsSync(witeDir))
      fs.mkdirSync(witeDir, {
        recursive: true
      });
    cb(null, witeDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage
}).single("fileUpload");

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
