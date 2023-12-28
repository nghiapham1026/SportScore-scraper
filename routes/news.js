const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const scrapeController = require('../controllers/scrapeController');

router.post('', newsController.createNews);
router.get('/fetchNews', newsController.fetchNews);

// Testing scrapeNews
router.get('/getNews', scrapeController.scrapeNews);

module.exports = router;
