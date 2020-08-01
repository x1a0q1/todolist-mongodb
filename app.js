const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const localPORT = 3000;
const todolistDB = "todolistDB";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect(`mongodb://localhost:27017/${todolistDB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: [true, "I Need a Name!"],
  },
});

const Task = mongoose.model("Task", taskSchema);

const listSchema = new mongoose.Schema({
  listTitle: String,
  tasks: [taskSchema],
});

const List = mongoose.model("List", listSchema);

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

const defaultListTitle = "🔥 Just Do It! 🔥";

app.get("/", (req, res) => {
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
        res.render("list", { listTitle: defaultListTitle, newItemList: tasks });
      }
    }
  });
});

app.get("/:customlistTitle", (req, res) => {
  List.findOne({ listTitle: req.params.customlistTitle }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result === null) {
        const list = new List({
          listTitle: req.params.customlistTitle,
          tasks: defaultTasks,
        });
        list.save();
        res.redirect(`/${req.params.customlistTitle}`);
      } else {
        res.render("list", {
          listTitle: result.listTitle,
          newItemList: result.tasks,
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  const newTask = new Task({
    taskName: req.body.newItem,
  });
  if (req.body.btn === defaultListTitle) {
    newTask.save();
    res.redirect("/");
  } else {
    List.findOne({ listTitle: req.body.btn }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        result.tasks.push(newTask);
        result.save();
        res.redirect(`/${req.body.btn}`);
      }
    });
  }
});

app.post("/delete", (req, res) => {
  Task.findByIdAndRemove(req.body.checkedItem, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`_id: ${req.body.checkedItem} deleted!`);
      res.redirect("/");
    }
  });
});

app.listen(localPORT, () => {
  console.log(`Server Started on port: ${localPORT}`);
});
