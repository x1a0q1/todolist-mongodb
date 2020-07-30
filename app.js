const express = require("express");
const bodyParser = require("body-parser");
const dateHelper = require(`${__dirname}/dateHelper.js`);

const localPORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const listName_work = "Work List";
const itemList = ["Buy Food", "Cook Food", "Eat Food"];
const workItemList = [];

app.get("/", (req, res) => {
  const dayOfTheWeek = dateHelper.getDate();
  res.render("list", { listName: dayOfTheWeek, newItemList: itemList });
});

app.get("/work", (req, res) => {
  const weekDay = dateHelper.getDay();
  res.render("list", {
    listName: `${weekDay}'s ${listName_work}`,
    newItemList: workItemList,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  if (req.body.btn === listName_work) {
    workItemList.push(req.body.newItem);
    res.redirect("/work");
  } else {
    itemList.push(req.body.newItem);
    res.redirect("/");
  }
});

app.listen(localPORT, () => {
  console.log(`Server Started on port: ${localPORT}`);
});
