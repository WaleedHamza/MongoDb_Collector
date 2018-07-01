// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

// Dependencies
var express = require("express");
var mongoose = require("mongoose");
// var logger = require("morgan");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
// Require request and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 8080;
// Initialize Express
var app = express();
// app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use( express.static('public'));
app.use(express.static("views"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper2";
mongoose.connect(MONGODB_URI);


// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.render("home");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // console.log("in all");
//   // Find all results from the scrapedData collection in the db
  db.Article.find({})
  .then((dbArticle)=>{
    // console.log("article returned", dbArticle);
    res.render("home", {dbArticle: dbArticle})
  })
  .catch((err)=>{
    res.json(err);
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scraped", function(req, res) {
axios.get("https://www.reddit.com/r/webdev").then(function (response) {
  var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $("p.title").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var result = {};
      result.title = $(element).text();
      result.link = $(element).children().attr("href");
      // If this found element had both a title and a link
      db.Article.create(result)
      .then ((dbArticle)=>{
        // console.log("article", dbArticle);
      })
      .catch((err)=>{
        return res.json(err)

    });
  });
  res.redirect("/")
})
.catch((err) => {
  return res.json(err)

});
});


app.listen(PORT, function() {
  console.log("http://localhost:"+PORT);
});
