const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//////////////Request targeting all targets
app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then(function (foundArticles) {
        res.send(foundArticles);
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .post((req, res) => {
    const postArticle = req.body.title;
    const contentArticle = req.body.content;
    const newArticle = new Article({
      title: postArticle,
      content: contentArticle,
    });
    newArticle.save();
    res.redirect("/articles");
  })
  .delete((req, res) => {
    Article.deleteMany()
      .then(function (deleted) {
        res.redirect("/articles");
      })
      .catch(function (err) {
        console.log(err);
      });
  });

/////Request targeting individual articles

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then(function (foundArticle) {
        res.send(foundArticle);
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwritten: true }
    )
      .then(function (updateOne) {
        res.send("Helo");
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
      .then(function (updateArticle) {
        res.send("/");
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(function (delteOne) {
        res.send("Done");
      })
      .catch(function (err) {
        console.log(err);
      });
  });

app.listen("3000", () => {
  console.log("Server is working on 3000");
});
