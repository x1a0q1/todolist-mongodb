const mongoose = require("mongoose");
const dbConnector = require(`${__dirname}/dbConnector.js`);

const dbName = "todolistDB";

class todoListDB {
  constructor() {
    this.connect = () => {
      dbConnector.connectDB(dbName);
    };
    // task collection
    this.taskSchema = new mongoose.Schema({
      taskName: {
        type: String,
        required: [true, "I Need a Name!"],
      },
    });
    this.Task = mongoose.model("Task", this.taskSchema);

    // list collection
    this.listSchema = new mongoose.Schema({
      listTitle: String,
      tasks: [this.taskSchema],
    });
    this.List = mongoose.model("List", this.listSchema);

    // 3 Default Items for initial running
    this.defaultTasks = [
      new this.Task({
        taskName: "Welcome to your todolist!",
      }),
      new this.Task({
        taskName: "Hit the + button to add a new task.",
      }),
      new this.Task({
        taskName: "<-- Hit this to complete a task.",
      }),
    ];
    this.defaultListTitle = "🔥 Just Do It! 🔥";
  }
}

module.exports = todoListDB;
