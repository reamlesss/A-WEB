const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5500;
const TODOS_FILE = path.join(__dirname, "todos.json");
const MOVIES_FILE = path.join(__dirname, "movies.json");

// Helper to ensure files exist
if (!fs.existsSync(TODOS_FILE)) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(["Trip to the mountains", "Sunset picnic"], null, 2));
}
if (!fs.existsSync(MOVIES_FILE)) {
  fs.writeFileSync(MOVIES_FILE, JSON.stringify([
    { name: "The Notebook", genre: "Romance" },
    { name: "About Time", genre: "Drama/Romance" }
  ], null, 2));
}

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// --- TODOS ROUTES ---
app.get("/todos", (req, res) => {
  fs.readFile(TODOS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Server error");
    let todos = [];
    try { todos = data ? JSON.parse(data) : []; } catch (e) { todos = []; }
    res.json(todos);
  });
});

app.post("/todos", (req, res) => {
  const newTodo = req.body.todo;
  if (!newTodo) return res.status(400).send("Invalid todo");
  fs.readFile(TODOS_FILE, "utf8", (err, data) => {
    let todos = [];
    if (!err && data) { try { todos = JSON.parse(data); } catch (e) { todos = []; } }
    todos.push(newTodo);
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) return res.status(500).send("Server error");
      res.status(201).send("Todo added");
    });
  });
});

app.delete("/todos/:index", (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile(TODOS_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Server error");
    let todos = [];
    try { todos = JSON.parse(data); } catch (e) { return res.status(500).send("File error"); }
    if (index >= 0 && index < todos.length) {
      todos.splice(index, 1);
      fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
        if (err) return res.status(500).send("Server error");
        res.status(200).send("Todo removed");
      });
    } else { res.status(400).send("Invalid index"); }
  });
});

// --- MOVIES ROUTES ---
app.get("/movies", (req, res) => {
  fs.readFile(MOVIES_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Server error");
    let movies = [];
    try { movies = data ? JSON.parse(data) : []; } catch (e) { movies = []; }
    res.json(movies);
  });
});

app.post("/movies", (req, res) => {
  const { name, genre } = req.body;
  if (!name || !genre) return res.status(400).send("Invalid movie data");
  fs.readFile(MOVIES_FILE, "utf8", (err, data) => {
    let movies = [];
    if (!err && data) { try { movies = JSON.parse(data); } catch (e) { movies = []; } }
    movies.push({ name, genre });
    fs.writeFile(MOVIES_FILE, JSON.stringify(movies, null, 2), (err) => {
      if (err) return res.status(500).send("Server error");
      res.status(201).send("Movie added");
    });
  });
});

app.delete("/movies/:index", (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile(MOVIES_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Server error");
    let movies = [];
    try { movies = JSON.parse(data); } catch (e) { return res.status(500).send("File error"); }
    if (index >= 0 && index < movies.length) {
      movies.splice(index, 1);
      fs.writeFile(MOVIES_FILE, JSON.stringify(movies, null, 2), (err) => {
        if (err) return res.status(500).send("Server error");
        res.status(200).send("Movie removed");
      });
    } else { res.status(400).send("Invalid index"); }
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
