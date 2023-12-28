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

exports.fetchNews = async (_, res) => {
    try {
        // Use the scrapeNews function to fetch news data
        const scrapedNews = await webScrape.scrapeNews();

        // Process and save each news article to the database
        const savedArticles = await Promise.all(
            scrapedNews.map(article => {
                const news = new NewsData({
                    name: article.name,
                    author: article.author,
                    date: article.date,
                    body: article.body
                });
                return news.save();
            })
        );

        // Respond with the saved articles
        res.status(201).json({
            message: "News articles fetched and saved successfully",
            savedArticles: savedArticles.map(article => ({
                ...article._doc,
                id: article._id
            }))
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch and create news articles",
            error: err.message
        });
    }
};