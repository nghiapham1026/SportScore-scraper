const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");

const newsRoutes = require("./routes/news.js");

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB);
}

app.get('/', (_, res) => {
    res.send('SportScore news scraper https://www.aljazeera.com/tag/football/');
});

app.use(express.json());
app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
