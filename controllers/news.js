const NewsData = require('../models/news');
// Assuming webScrape is a module you've created for scraping news articles
const webScrape = require('./scrapeController');

exports.createNews = (req, res) => {
  // Create a new instance of NewsData with data from the request body
  const news = new NewsData({
    name: req.body.name,
    author: req.body.author,
    date: req.body.date,
    body: req.body.body,
  });

  // Save the news data to the database
  news
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'News added successfully',
        news: {
          ...result._doc,
          id: result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Failed to create news article',
        error: err.message,
      });
    });
};

exports.fetchNews = async (_, res) => {
  try {
    // Use the scrapeNews function to fetch news data
    const scrapedNews = await webScrape.scrapeNews();

    // Respond with the fetched news articles
    res.status(200).json({
      message: 'News articles fetched successfully',
      articles: scrapedNews
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch news articles',
      error: err.message,
    });
  }
};
