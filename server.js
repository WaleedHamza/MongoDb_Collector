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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
mongoose.connect(MONGODB_URI);

//json body route
app.get('/all',function (req, res){
  db.Article.find({}).then((dbArticles)=>{
    res.send({dbArticles})
  }).catch((err)=>{
    res.json(err);
  });
});

// Retrieve data from the db
app.get("/", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.Article.find({})
  .then((dbArticle)=>{
    // console.log("article returned", {dbArticle : dbArticle});
    res.render("home", {dbArticle: dbArticle})
  })
  .catch((err)=>{
    res.json(err);
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scraped", function(req, res) {
  // console.log("in scraped")
axios.get("https://www.reddit.com/r/webdev").then(function (response) {

    // Load the html body from request into cheerio

  var $ = cheerio.load(response.data);

    // For each element with a "title" class
    $(".scrollerItem").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var result = {};
      result.title = $(element).find("h2").text();
      result.link = $(element).find("[data-click-id='timestamp']").attr("href");
      // If this found element had both a title and a link
      db.Article.create(result)
      .then ((dbArticle)=>{
      })
      .catch((err)=>{
        return res.json(err)

    });
  });
  res.redirect("/")
})
});

app.get("/saved", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.Article.find({saved : true})
  .then((dbArticle)=>{
    res.render("saved", {dbArticle: dbArticle})
  })
  .catch((err)=>{
    res.json(err);
  });
});

// Route to change the save boolean value
  app.post("/all/:id", function (req, res){
    console.log("in post all", req.body)
    db.Article.findOneAndUpdate({ _id: req.params.id }, {$set: req.body}, function(err, data){
      if (err) throw err;
      console.log("inside the server put Method", data);
      res.sendStatus(200);
    });
  });

  //Route to add notes to the articles 
  app.post("/notes", function (req, res){
    console.log("inside app.post /note", req.body)
    db.Note.create({
      note: req.body.note
    })
    .then( function(dbNote){
      return db.Article.findOneAndUpdate({_id:req.body.noteId}, {$push: {note: dbNote}}, {new: true})
    })
    .then( function (dbArticle){
      res.json(dbArticle);
    })
    .catch( function (error){
      res.json(error)
    });
  });

  //Route to delete note
  // app.delete("/note/:id", function(req, res){
  //   db.Note.remove({_id:req.params.id}, function(error, data){
  //     if (error) throw error;
  //     console.log("Note removed", data)
  //     res.sendStatus(200);
  //   });
  // })

//Route to populate the note to the article 
  app.get("/all/:id", function (req, res){
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .exec(function(err, dbArticle){
      if (err) throw err;
      res.render('saved', {dbArticle: dbArticle
      });
      console.log("inside the populate method", dbArticle)
      console.log("inside the populate method", (dbArticle.note[0].note))
    })
    // .catch( function(error){
    //   res.json(error);
    // })
  });




app.listen(PORT, function() {
  console.log("http://localhost:"+PORT);
});
