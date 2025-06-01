// app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const photoRoutes = require("./routes/photo.routes");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(photoRoutes); // now clean and mounted at /photos

module.exports = app;
