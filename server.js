// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");
// Require request and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;
// Initialize Express
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
mongoose.connect("mongodb://localhost/mongoScraper");
var db = mongoose.connection;

db.on("error", (err)=>{
  console.log('Mongoose Error: ', err);
});
db.once('open', ()=>{
  console.log('\nMongoose connected !\n')
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  console.log("in all");
//   // Find all results from the scrapedData collection in the db
  db.Article.find({})
  .then((dbArticle)=>{
    console.log("article returned", dbArticle);
    res.json(dbArticle)
  })
  .catch((err)=>{
    res.json(err);
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scraped", function(req, res) {
//   // Make a request for the news section of `ycombinator`
axios.get("https://www.reddit.com/r/webdev/", function(response) {
//     // Load the html body from request into cheerio
console.log(response);
    var $ = cheerio.load(response.data);
    console.log(response.data);
//     // For each element with a "title" class
    $(".title").each(function(i, element) {
//       // Save the text and href of each link enclosed in the current element
      var result = {};
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
    //   var image = $(element).children("a").attr("img");
//       // If this found element had both a title and a link
      console.log(result);
      db.Article.create(result)
      .then ((dbArticle)=>{
        console.log(dbArticle);
      })
      .catch((err)=>{
        return res.json(err)
      });
    });
  });
  res.send("scrape complete")
});


// Listen on port 3000
app.listen(PORT, function() {
  console.log("http://localhost:"+PORT);
});
