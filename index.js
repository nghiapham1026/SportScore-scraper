const express = require('express');
const app = express();
require("dotenv").config();

app.get('/', (_, res) => {
    res.send('SportScore news scraper https://www.aljazeera.com/tag/football/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
