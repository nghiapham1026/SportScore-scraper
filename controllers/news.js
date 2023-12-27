const NewsData = require('../models/news');
// Assuming webScrape is a module you've created for scraping news articles
const webScrape = require('./scrapeController');

exports.createNews = (req, res) => {
  // Create a new instance of NewsData with data from the request body
  const news = new NewsData({
    name: req.body.name,
    author: req.body.author,
    date: req.body.date,
    body: req.body.body
  });

  // Save the news data to the database
  news.save()
    .then(result => {
      res.status(201).json({
        message: "News added successfully",
        news: {
          ...result._doc,
          id: result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to create news article"
      });
    });
};
