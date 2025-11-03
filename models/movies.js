// models/movies.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number,
  rating: String,
  genre: String,
  addToFavorites: Boolean,

});

const Movie = mongoose.model("Movie", movieSchema); // create model

// models/movies.js

module.exports = Movie;
