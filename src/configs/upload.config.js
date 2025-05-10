const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

global.upload = upload;
