// 1) Load env first
const dotenv = require("dotenv");
dotenv.config();

// 2) Imports
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

// 3) Create app
const app = express();

// 4) Express/EJS
app.set("view engine", "ejs");

// 5) Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static("global")); // your static folder

// 6) DB connect + logs
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// 7) Models
const Movie = require("./models/movies.js");
const Review = require("./models/review.js");

// 8) Routes

// 🏠 Home page — lists all movies (newest first)
app.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ _id: -1 });
    res.render("home", { movies }); // ✅ render home.ejs, not index
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading home page");
  }
});

// 🎬 Movies index page — optional separate list view
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render("movies/index", { movies }); // ✅ still fine (movies/index.ejs)
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading movies page");
  }
});

// 🎥 Show one movie + its reviews
app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) return res.status(404).send("Movie not found");

    const reviews = await Review.find({ movie: movie._id }).sort({ createdAt: -1 });
    res.render("movies/show", { movie, reviews }); // ✅ show.ejs exists here
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading movie page");
  }
});

// ✏️ Create a new review for a movie
app.post("/movies/:id/reviews", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");

    await Review.create({
      movie: movie._id,
      author: req.body.author,
      email: req.body.email,
      rating: req.body.rating,
      body: req.body.body,
    });

    res.redirect(`/movies/${encodeURIComponent(movie.title)}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
  }
});

// GET /movies/genre/:genre  → list movies in that genre
app.get('/movies/genre/:genre', async (req, res) => {
  const genre = req.params.genre;
  const movies = await Movie.find({ genre });
  res.render('home', { movies }); // reuses your grid on the home page
});

app.get('/movies/director/:name', async (req, res) => {
  const name = req.params.name; // Express decodes %20 automatically
  const movies = await Movie.find({ director: name });
  res.render('home', { movies });
});

// GET /movies/year/2010s → years 2010–2019
app.get('/movies/year/:bucket', async (req, res) => {
  const bucket = req.params.bucket;            // e.g., "2010s"
  const m = bucket.match(/^(\d{4})s$/);        // extract "2010"
  if (!m) return res.status(400).send('Invalid year bucket');

  const start = parseInt(m[1], 10);
  const end = start + 9;

  const movies = await Movie.find({ year: { $gte: start, $lte: end } });
  res.render('home', { movies });
});

// GET /movies/rating/:rating → movies with that rating
app.get('/movies/rating/:rating', async (req, res) => {
  const rating = parseFloat(req.params.rating);
  const movies = await Movie.find({ rating });
  res.render('home', { movies });
});


// 9) Listen
app.listen(3000, () => console.log("Listening on port 3000"));
