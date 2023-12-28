const puppeteer = require('puppeteer');
const { newsUrl } = require('./constants');
const News = require('../models/news'); // assuming the file path is correct

async function scrapeNews() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(newsUrl, { waitUntil: 'networkidle2' });

    // Extract details of the first 10 articles on the main page
    const articles = await page.$$eval('li.item[data-testid="article-card"]', items => 
        items.slice(0, 10).map(item => { // Limiting to the first 10 articles
            const link = item.querySelector('a[href]').href;
            return { link };
        })
    );

    let allNews = [];
    for (const article of articles) {
        await page.goto(article.link, { waitUntil: 'networkidle2', timeout: 30000 }); // 30 seconds timeout

        // Extracting the full article details
        const articleDetails = await page.evaluate(() => {
            const name = document.querySelector('h1.article_title__9p8Mp') ? document.querySelector('h1.article_title__9p8Mp').innerText : null;
            const author = document.querySelector('.author-link_authors__7vfIl a') ? document.querySelector('.author-link_authors__7vfIl a').innerText : 'Unknown';
            const date = document.querySelector('time[datetime]') ? document.querySelector('time[datetime]').getAttribute('datetime') : null;
            const body = document.querySelector('.article-body_body__ASOmp') ? document.querySelector('.article-body_body__ASOmp').innerText : null;

            return { name, author, date, body };
        });

        allNews.push(new News(articleDetails));
    }

    await browser.close();
    return allNews;
}

module.exports = {
    scrapeNews,
};
