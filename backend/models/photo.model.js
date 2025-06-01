const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: { type: String },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  email: { type: String },
  isDeleted: { type: Boolean, default: false },
  title: { type: String },
  tags: { type: String },
  description: { type: String },
  isFav: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);