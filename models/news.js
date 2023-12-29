const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: String, // Changed to String if the date is in ISO string format
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }}); // Enable timestamps

const News = mongoose.model('News', newsSchema);

module.exports = News;
