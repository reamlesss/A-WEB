console.log("🚀 Server script starting...");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const os = require("os");
console.log("📦 Modules loaded, setting up database...");
const app = express();
const PORT = process.env.PORT || 5500;
console.log("📦 Modules loaded, setting up database...");
// MONGODB pass: TMC4mLc33dNOTiZz
// 1. DATABASE CONNECTION
// Replace 'YOUR_MONGODB_URI' with your actual connection string from MongoDB Atlas
// On Vercel, you should add this to your Environment Variables as MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://reamplays12_db_user:TMC4mLc33dNOTiZz@cluster0.rmidnce.mongodb.net/a-web?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging
})
  .then(() => console.log("✅ Connected to Cloud Database"))
  .catch(err => {
    console.error("❌ Database connection error:");
    console.error(err.message);
  });

// 2. DATA MODELS
const Todo = mongoose.model('Todo', { text: String });
const Movie = mongoose.model('Movie', { name: String, genre: String });

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// --- TODOS ROUTES ---
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos.map(t => t.text)); // Mapping to match your original front-end logic
  } catch (err) {
    res.status(500).send("Error fetching todos");
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.todo });
    await newTodo.save();
    console.log("Bucketlist item added to DB: " + req.body.todo);
    res.status(201).send("Todo added");
  } catch (err) {
    res.status(500).send("Error saving todo");
  }
});

app.delete("/todos/:index", async (req, res) => {
  try {
    const todos = await Todo.find();
    const target = todos[parseInt(req.params.index)];
    if (target) {
      await Todo.findByIdAndDelete(target._id);
      res.status(200).send("Todo removed");
    } else {
      res.status(404).send("Not found");
    }
  } catch (err) {
    res.status(500).send("Error deleting todo");
  }
});

// --- MOVIES ROUTES ---
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).send("Error fetching movies");
  }
});

app.post("/movies", async (req, res) => {
  try {
    const { name, genre } = req.body;
    const newMovie = new Movie({ name, genre });
    await newMovie.save();
    console.log("Movie added to DB: " + name);
    res.status(201).send("Movie added");
  } catch (err) {
    res.status(500).send("Error saving movie");
  }
});

app.delete("/movies/:index", async (req, res) => {
  try {
    const movies = await Movie.find();
    const target = movies[parseInt(req.params.index)];
    if (target) {
      await Movie.findByIdAndDelete(target._id);
      res.status(200).send("Movie removed");
    } else {
      res.status(404).send("Not found");
    }
  } catch (err) {
    res.status(500).send("Error deleting movie");
  }
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
