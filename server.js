const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const TODO_FILE = path.join(__dirname, "todos.csv");

app.use(bodyParser.json());
app.use(express.static("public"));

// Helper functions
const readTodos = () => {
  if (!fs.existsSync(TODO_FILE)) {
    return [];
  }
  const data = fs.readFileSync(TODO_FILE, "utf8");
  return data.split("\n").filter((line) => line.trim() !== "");
};

const writeTodo = (todo) => {
  fs.appendFileSync(TODO_FILE, `${todo}\n`, "utf8");
};

// Routes
app.get("/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const todo = req.body.todo;
  if (todo) {
    writeTodo(todo);
    res.status(200).json({ message: "Todo added successfully" });
  } else {
    res.status(400).json({ message: "Invalid todo" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
