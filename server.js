const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 5500; // Make sure this is the port you intend to use

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// GET route to fetch todos
app.get("/todos", (req, res) => {
  console.log("Started todos get");
  const todosFilePath = path.join(__dirname, "todos.json");
  fs.readFile(todosFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(JSON.parse(data));
  });
});

// POST route to add a new todo
app.post("/todos", (req, res) => {
  console.log("post todo started");
  console.log("Bucketlist item: "+req.body.todo+" added")
  const newTodo = req.body.todo;
  const todosFilePath = path.join(__dirname, "todos.json");

  fs.readFile(todosFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      res.status(500).send("Server error");
      return;
    }
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        console.error("Error writing todos file:", err);
        res.status(500).send("Server error");
        return;
      }
      res.status(201).send("Todo added");
    });
  });
});


// DELETE route to remove a todo
app.delete("/todos/:index", (req, res) => {
  const index = parseInt(req.params.index); // Parse the index from the request parameters
  const todosFilePath = path.join(__dirname, "todos.json");

  fs.readFile(todosFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      res.status(500).send("Server error");
      return;
    }

    const todos = JSON.parse(data); // Parse the JSON data from the file
    if (index >= 0 && index < todos.length) { // Check if the index is valid
      todos.splice(index, 1); // Remove the todo at the specified index
      fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), (err) => {
        if (err) {
          console.error("Error writing todos file:", err);
          res.status(500).send("Server error");
          return;
        }
        res.status(200).send("Todo removed"); // Send success response
      });
    } else {
      res.status(400).send("Invalid index"); // Send error response for invalid index
    }
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
