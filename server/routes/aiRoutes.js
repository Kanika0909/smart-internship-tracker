const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const { matchResumeFile } = require("../controllers/aiController");
const auth = require("../middleware/auth");

router.post("/match-file", auth, upload.single("resume"), matchResumeFile);

module.exports = router;