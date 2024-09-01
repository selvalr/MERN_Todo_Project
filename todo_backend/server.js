const express = require("express");
const { default: mongoose } = require("mongoose");

const mongodb = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//let todos = [];

mongodb
  .connect("mongodb://localhost:27017/todo-app")
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//create schema
const todoSchema = new mongoose.Schema({
  title: {
    require: true,
    type: String,
  },
  description: String,
});

//create model
const todoModel = mongoose.model("Todo", todoSchema);

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  //   const newTodo = {
  //     id: todos.length + 1,
  //     title,
  //     description,
  //   };
  //   todos.push(newTodo);
  //   console.log(todos);
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//Get All Items
app.get("/todos", async (req, res) => {
  try {
    const todosMode = await todoModel.find();
    res.json(todosMode);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//Update Todo Item
app.put("/todos/:test", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.test;
    const updateTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );

    if (!updateTodo) {
      return res.status(404).json({ message: "todo not Found" });
    }
    res.json(updateTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//Delete Data
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.is;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//Start the server
const port = 8000;
app.listen(port, () => {
  console.log("server is listening " + port);
});
