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
        type: Date,
        required: true,
        default: Date.now
    },
    body: {
        type: String,
        required: true
    }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
