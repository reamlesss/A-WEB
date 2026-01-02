const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5500;
const TODOS_FILE = path.join(__dirname, "todos.json");

// Helper to ensure todos.json exists
if (!fs.existsSync(TODOS_FILE)) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(["Trip to the mountains", "Sunset picnic"], null, 2));
}

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// GET route to fetch todos
app.get("/todos", (req, res) => {
  fs.readFile(TODOS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos file:", err);
      return res.status(500).send("Server error");
    }
    let todos = [];
    try {
      todos = data ? JSON.parse(data) : [];
    } catch (e) {
      todos = [];
    }
    res.json(todos);
  });
});

// POST route to add a new todo
app.post("/todos", (req, res) => {
  const newTodo = req.body.todo;
  if (!newTodo) return res.status(400).send("Invalid todo");

  fs.readFile(TODOS_FILE, "utf8", (err, data) => {
    let todos = [];
    if (!err && data) {
      try {
        todos = JSON.parse(data);
      } catch (e) {
        todos = [];
      }
    }
    
    todos.push(newTodo);
    
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        console.error("Error writing todos file:", err);
        return res.status(500).send("Server error");
      }
      console.log("Bucketlist item added: " + newTodo);
      res.status(201).send("Todo added");
    });
  });
});

// DELETE route to remove a todo
app.delete("/todos/:index", (req, res) => {
  const index = parseInt(req.params.index);
  
  fs.readFile(TODOS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Server error");
    
    let todos = [];
    try {
      todos = JSON.parse(data);
    } catch (e) {
      return res.status(500).send("File error");
    }

    if (index >= 0 && index < todos.length) {
      const removed = todos.splice(index, 1);
      fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
        if (err) return res.status(500).send("Server error");
        console.log("Todo deleted: " + removed);
        res.status(200).send("Todo removed");
      });
    } else {
      res.status(400).send("Invalid index");
    }
  });
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
