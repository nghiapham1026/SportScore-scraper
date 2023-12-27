const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');

router.post('', newsController.createNews);

module.exports = router;