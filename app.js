const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dateHelper = require(`${__dirname}/dateHelper.js`);

const localPORT = 3000;
const todolistDB = "todolistDB";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect(`mongodb://localhost:27017/${todolistDB}`, {
  useNewUrlParser: true,
});

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: [true, "I Need a Name!"],
  },
});

const Task = mongoose.model("Task", taskSchema);

// 3 Default Items for initial running
const defaultTasks = [
  new Task({
    taskName: "Welcome to your todolist!",
  }),
  new Task({
    taskName: "Hit the + button to add a new task.",
  }),
  new Task({
    taskName: "<-- Hit this to complete a task.",
  }),
];

const listName_work = "Work List";
const itemList = ["Buy Food", "Cook Food", "Eat Food"];
const workItemList = [];

app.get("/", (req, res) => {
  const dayOfTheWeek = dateHelper.getDate();

  Task.find({}, (err, tasks) => {
    if (err) {
      console.log(err);
    } else {
      if (tasks.length === 0) {
        Task.insertMany(defaultTasks, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default tasks to DB!");
            res.redirect("/");
          }
        });
      } else {
        res.render("list", { listName: dayOfTheWeek, newItemList: tasks });
      }
    }
  });
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
