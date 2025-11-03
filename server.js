const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file

const express = require("express"); // express: runs the web server and handles routes
const app = express(); // this creates the apps, makes express usable

const mongoose = require("mongoose");
// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
});

const methodOverride = require("method-override");
const morgan = require("morgan"); 

app.set("view engine", "ejs"); // reads .ejs files as webpages
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// Import the Movie model
const Movie = require("./models/movies.js");


app.get("/", async (req, res) => {
  res.send("Movie Addicts");
});


app.get("/home", async (req, res) => {
  res.render("home.ejs");
});

app.get("/movies/new", (req, res) => {
  res.render("user/new.ejs");
});


// POST new favorite movies
app.post("/movies", async (req, res) => {
  if (req.body.addToFavorites === "on") {
    req.body.addToFavorites = true;
  } else {
    req.body.addToFavorites = false;
  }
  await Movie.create(req.body);
  res.redirect("/movies");
});

//GET /fruits
app.get("/movies", async (req, res) => {
  const allMovies = await Movie.find();
  res.render("user/index.ejs", {movies: allMovies});
});

app.get("/movies/:movieId", async (req, res) => {
  const foundMovie = await Movie.findById(req.params.movieId);
  res.render("user/show.ejs", { movie: foundMovie });
});

app.delete("/movies/:movieId", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.movieId);
  res.redirect("/movies");
});

// GET /movies/:movieId/edit
app.get("/movies/:movieId/edit", async (req, res) => {
  const foundMovie = await Movie.findById(req.params.movieId);
  res.render("user/edit.ejs", { movie: foundMovie });
});


app.put("/movies/:movieId", async (req, res) => {
  if (req.body.addToFavorites === "on") {
    req.body.addToFavorites = true;
  } else {
    req.body.addToFavorites = false;
  }
   await Movie.findByIdAndUpdate(req.params.movieId, req.body);
  res.redirect(`/movies/${req.params.movieId}`);
});


// Listen
app.listen(2000);
