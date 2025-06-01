
const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photo.controller");

module.exports = router.use("/photos", photoController);
