// models/movies.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number,
  genre: String,
  rating: Number,
  image: String,      // used for home page thumbnail
  showImage: String,  // used for the review page (show.ejs)
});

const Movie = mongoose.model("Movie", movieSchema); // create model

module.exports = Movie;
