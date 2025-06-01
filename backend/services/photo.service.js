
const Photo = require("../models/photo.model");
const Album = require("../models/album.model");
const { uploadToS3 } = require("./s3.service");

const upload = async (url, albumId, title, description, tags) => {
  const photo = new Photo({ url, albumId, title, description, tags });
  return photo.save();
};

const updatePhoto = async (
  url,
  albumId,
  title,
  description,
  tags,
  photoId,
  isFav
) => {
  const updated = await Photo.findByIdAndUpdate(
    photoId,
    { url, albumId, title, description, tags, isFav },
    { new: true }
  );
  if (!updated) throw new Error("Photo not found");
  return updated;
};

const uploadPhoto = async (file) => {
  const url = await uploadToS3(file.buffer, file.originalname, file.mimetype);
  return { url };
};

const getPhotos = async (
  pageNumber,
  pageSize,
  searchText,
  albumId,
  isFav,
  isDeleted
) => {
  const query = isDeleted === true ? { isDeleted: true } : { isDeleted: false };
  if (albumId) query.albumId = albumId;
  if (isFav) query.isFav = isFav;
  if (searchText?.trim()) {
    const regex = new RegExp(searchText, "i");
    query.$or = [{ title: regex }, { description: regex }, { tags: regex }];
  }

  const totalItems = await Photo.countDocuments(query);
  const totalPages = Math.ceil(totalItems / pageSize);
  const skip = (pageNumber - 1) * pageSize;

  const photos = await Photo.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);

  return { pageNumber, pageSize, totalItems, totalPages, photos };
};

const addPhotoToAlbum = async (photoId, albumId) => {
  const photo = await Photo.findById(photoId);
  if (!photo) throw new Error("Photo not found");
  photo.albumId = albumId;
  return photo.save();
};

const createAlbum = async (name) => {
  const album = new Album({ name });
  return album.save();
};

const getAlbums = () => {
  return Album.find({ isDeleted: false });
};

const deletePhoto = async (photoIds) => {
  await Photo.updateMany(
    { _id: { $in: photoIds } },
    { $set: { isDeleted: true } }
  );
  return "Photos deleted successfully";
};

const deleteAlbum = async (albumId) => {
  const album = await Album.findById(albumId);
  if (!album) throw new Error("Album not found");
  album.isDeleted = true;
  await album.save();

  await Photo.updateMany({ albumId }, { isDeleted: true });
  return album;
};

const markUnmarkPhotoAsFavorite = async (photoId, isFav) => {
  const photo = await Photo.findById(photoId);
  if (!photo) throw new Error("Photo not found");
  photo.isFav = isFav;
  return photo.save();
};

const getCollectionMonth = async () => {
  const pipeline = [
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        photos: { $push: "$$ROOT" },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gte: 4 } } },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ];

  return Photo.aggregate(pipeline);
};

module.exports = {
  upload,
  updatePhoto,
  uploadPhoto,
  getPhotos,
  addPhotoToAlbum,
  createAlbum,
  getAlbums,
  deletePhoto,
  deleteAlbum,
  markUnmarkPhotoAsFavorite,
  getCollectionMonth,
};
