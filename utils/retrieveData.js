const News = require('../models/news'); // Replace with the path to your News model

/**
 * Retrieves the latest 5 news articles from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of the latest 5 news articles.
 */
const retrieveLatestNews = async () => {
  try {
    // Query the database for the latest 5 news articles, sorted by date
    const latestNews = await News.find({})
      .sort({ date: -1 }) // Assuming 'date' field holds ISO date string
      .limit(5);

    return latestNews;
  } catch (err) {
    console.error('Error retrieving news articles: ', err);
    throw err;
  }
};

module.exports = retrieveLatestNews;
