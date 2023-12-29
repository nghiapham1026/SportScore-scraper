const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Assuming the date is in ISO string format
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      // New field for image link
      type: String,
      required: false, // Set to false if the image is not mandatory
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
); // Enable timestamps

const News = mongoose.model('News', newsSchema);

module.exports = News;
