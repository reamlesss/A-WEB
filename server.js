const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.get("/todos", (req, res) => {
  const todosFilePath = path.join(__dirname, "todos.json");
  fs.readFile(todosFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      res.status(500).send("Server error");
      return;
    }
    let todos = [];
    if (data && data.trim() !== "") {
      try {
        todos = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing todos JSON:", parseErr);
        todos = [];
      }
    }
    res.json(todos);
  });
});

// POST route to add a new todo
app.post("/todos", (req, res) => {
  console.log("post todo started");
  console.log("Bucketlist item: " + req.body.todo + " added");
  const newTodo = req.body.todo;
  const todosFilePath = path.join(__dirname, "todos.json");

  fs.readFile(todosFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      res.status(500).send("Server error");
      return;
    }

    let todos = [];
    if (data && data.trim() !== "") {
      try {
        todos = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing todos JSON:", parseErr);
        // If file is corrupted, we might want to start fresh or return error
        // For now, let's start fresh to keep it working
        todos = [];
      }
    }

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
  const index = parseInt(req.params.index);
  const todosFilePath = path.join(__dirname, "todos.json");

  fs.readFile(todosFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      res.status(500).send("Server error");
      return;
    }

    let todos = [];
    if (data && data.trim() !== "") {
      try {
        todos = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing todos JSON:", parseErr);
        todos = [];
      }
    }

    if (index >= 0 && index < todos.length) {
      todos.splice(index, 1);
      fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), (err) => {
        if (err) {
          console.error("Error writing todos file:", err);
          res.status(500).send("Server error");
          return;
        }
        res.status(200).send("Todo removed");
      });
    } else {
      res.status(400).send("Invalid index");
    }
  });
  console.log("Todo deleted");
});

// Funkce na získání IP adresy
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (details.family === "IPv4" && !details.internal) {
        return details.address;
      }
    }
  }
  return "Nedostupná";
}

// Start serveru
app.listen(PORT, () => {
  const localIP = getLocalIPAddress();
  console.log(`Server běží na lokální adrese: http://localhost:${PORT}`);
  console.log(`Připojení z jiného zařízení: http://${localIP}:${PORT}`);
});
