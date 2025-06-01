const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const photoService = require("../services/photo.service");

router.post("/upload/photos", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) throw new Error("File is required");
    const result = await photoService.uploadPhoto(req.file);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/save/photo", async (req, res) => {
  const { url, albumId, title, description, tags } = req.body;
  try {
    const result = await photoService.upload(
      url,
      albumId,
      title,
      description,
      tags
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/update", async (req, res) => {
  const { photoId, albumId, title, description, tags, url, fav } = req.body;
  try {
    const result = await photoService.updatePhoto(
      url,
      albumId,
      title,
      description,
      tags,
      photoId,
      fav
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get/photos", async (req, res) => {
  const { pageNumber, pageSize, searchText, albumId, isFav, isDeleted } =
    req.query;
  try {
    const result = await photoService.getPhotos(
      parseInt(pageNumber),
      parseInt(pageSize),
      searchText,
      albumId,
      isFav === "true",
      isDeleted === "true"
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add/photo/album", async (req, res) => {
  const { photoId, albumId } = req.body;
  try {
    const result = await photoService.addPhotoToAlbum(photoId, albumId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/create/album", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await photoService.createAlbum(name);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get/albums", async (_req, res) => {
  try {
    const result = await photoService.getAlbums();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/delete", async (req, res) => {
  const { photoIds } = req.body;
  try {
    const result = await photoService.deletePhoto(photoIds);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/mark/photo/as/favorite", async (req, res) => {
  const { photoId, isFav } = req.body;
  try {
    const result = await photoService.markUnmarkPhotoAsFavorite(photoId, isFav);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
