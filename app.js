const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const todoListDB = require(`${__dirname}/todoListDB.js`);

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const db = new todoListDB();
db.connect();

app.get("/", (req, res) => {
  db.Task.find({}, (err, tasks) => {
    if (err) {
      console.log(err);
    } else {
      if (tasks.length === 0) {
        db.Task.insertMany(db.defaultTasks, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default tasks to DB!");
            res.redirect("/");
          }
        });
      } else {
        res.render("list", {
          listTitle: db.defaultListTitle,
          newItemList: tasks,
        });
      }
    }
  });
});

app.get("/:customlistTitle", (req, res) => {
  const customlistTitle = _.capitalize(req.params.customlistTitle);
  db.List.findOne({ listTitle: customlistTitle }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result === null) {
        const list = new db.List({
          listTitle: customlistTitle,
          tasks: db.defaultTasks,
        });
        list.save();
        res.redirect(`/${customlistTitle}`);
      } else {
        res.render("list", {
          listTitle: result.listTitle,
          newItemList: result.tasks,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const newTask = new db.Task({
    taskName: req.body.newItem,
  });
  if (req.body.btn === db.defaultListTitle) {
    newTask.save();
    res.redirect("/");
  } else {
    db.List.findOne({ listTitle: req.body.btn }, (err, result) => {
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
  if (req.body.listTitle === db.defaultListTitle) {
    db.Task.findByIdAndRemove(req.body.checkedItem, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`_id: ${req.body.checkedItem} deleted!`);
        res.redirect("/");
      }
    });
  } else {
    db.List.findOneAndUpdate(
      { listTitle: req.body.listTitle },
      { $pull: { tasks: { _id: req.body.checkedItem } } },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(`/${req.body.listTitle}`);
        }
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
