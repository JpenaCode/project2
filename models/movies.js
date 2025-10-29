// models/movies.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number,
  genre: String,
  rating: Number,
  image: String,      
  showImage: String,  
});

const Movie = mongoose.model("Movie", movieSchema); 

module.exports = Movie;
