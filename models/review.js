const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    author: String,
    email: String,
    rating: Number,          // optional user rating
    body: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
