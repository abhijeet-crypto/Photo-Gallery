const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Album', albumSchema);