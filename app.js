//  Boiler Plate
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended : true
}));
app.use(express.static("public"));

//Connecting to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser : true});
const articleSchema = {
  title : String,
  content : String
};
const Article = mongoose.model("Article",articleSchema);

/////////////////////////////////// REQUEST HANDLING ALL TE ARTICLES //////////////////////////////////////////////////////
//Chained Routes
app.route("/articles")

// get route
.get(function(req,res){
  Article.find(function(err,results){
    if(!err){
      res.send(results);
    }else{
      res.send(err);
    }
  });
})

// Post Request
.post(function(req,res){
  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully Added New Article to the Collection.")
    }else{
      res.send(err);
    }
  });
})

// deleting multiple data
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully Deleted all Data.")
    }else{
      res.send(err);
    }
  });
});

/////////////////////////////////// REQUEST HANDLING SPECIFIC ARTICLE //////////////////////////////////////////////////////
//Chaining Routes
app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("Article Not Found");
    }
  });
})

.put(function(req,res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title : req.body.title, content : req.body.content},
    {overwrite : true},
    function(err){
      if(!err){
        res.send("Successfully Updated Article !!");
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    {title : req.params.articleTitle},
    {$set : req.body},
    function(err){
      if(!err){
        res.send("Successfully Patch Updated!!");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title : req.params.articleTitle}, function(err){
    if(!err){
      res.send("Successfully Deleted !!");
    }else{
      res.send(err);
    }
  });
});

// Lintening server to port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
