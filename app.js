require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

//Connecting to the server:
mongoose.connect(process.env.MONGODB_API);

//Schema of posts:
let postSchema = new mongoose.Schema({
  postTitle: String,
  postBlog: String
});

//Model of schema:
const Post = mongoose.model("Post", postSchema);

let homeStartingContent = "What do we have for today?";
let aboutContent = "This is a blogpost website made as a dairy to be written whenever I am free 😋";
let contactContent = "Wanna get in touch? Why don't send me a mail?";
let emojiList = ["🤭", "😏", "😌", "🤠", "😎", "🧐", "😳", "🙂", "😁"];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function(req, res) {
  Post.find({}, function(err, result){
    if(!err) {
      randomEmoji = emojiList[Math.floor(Math.random()*(emojiList.length))];  //Return a random emoji please, hehe!!
      res.render("home", {homeStartingContent: homeStartingContent, randomEmoji: randomEmoji, posts: result});
    } else {
      console.log(err);
      res.send(err);
    }
  });
  
});

app.get('/about', function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get('/compose', function(req, res) {
  res.render("compose");
});

app.get('/contact', function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get('/posts/:id', function(req, res) {
  console.log(typeof(req.params.id));

  const postId = req.params.id;

  Post.findById(postId, function(err, foundPost){
    if(err){
      console.log(err);
    } else {
      if(foundPost) {
        res.render("post", {postTitle: foundPost.postTitle, postData: foundPost.postBlog});
      } else {
        console.log(foundPost);
      }
    }
  });

  // Post.findById(req.params.id, function(err, foundPost){
  //   console.log(foundPost.id);
  //   if(err){
  //     console.log(err);
  //   } else {
  //     if(foundPost){
  //       if (foundPost.id === req.params.id){
  //         res.render("post", {postTitle: foundPost.postTitle, postData: foundPost.postBlog});
  //       } else {
  //         console.log('Not Found!');
  //         res.redirect('/');
  //       }
  //     } else {
  //       console.log(foundPost);
  //     }
  //   }
  // });
});

app.post('/compose', function(req, res) {
  Post.insertMany({postTitle: req.body.inputTitle,postBlog: req.body.inputPost}, function(err, docs){
    if(!err){
      console.log(docs);
    } else {
      console.log(err);
    }
  });
  setTimeout(function(){  //Create a delay to let the item save before accessing...
    res.redirect('/');
  }, 200);
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server @ " + (process.env.PORT || 3000));
});
