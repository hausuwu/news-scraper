
// Dependencies
// =======================================================
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");


//  scraping tools
// =======================================================
const axios = require("axios");
const cheerio = require("cheerio");

// Require Models
// =======================================================
var db = require("./models");

// APP port
var PORT = process.env.PORT || 3000;


// Initalize express
// =======================================================
var app = express();

// Set Handlebars as the defualt templating engine
// =======================================================
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Configure middleware
// =======================================================

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Connect to Mongo db
// =======================================================
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });


// ROUTES
// =======================================================

// GET route for scraping the website
app.get("/scrape", function(req, res){
    axios.get("https://old.reddit.com/r/houseplants/").then(function(response){
        var $ = cheerio.load(response.data);

        $("p.title").each(function(i, element){
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            
            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(err){
                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});


// SERVER
// =======================================================
app.listen(PORT, function() {
    console.log("App running on port http://localhost/" + PORT );
});