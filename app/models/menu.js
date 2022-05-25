const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const menuSchema = new Schema({
      name: {
          type: String,
          required: true
      },
      price: {
           type: Number,
           required: true
      },
      rating: {
          type: Number,
          default: 5
      },
      ratingCout:{
          type: Number,
          default: 1
      },
      image: {
          type: String,
          required: true
      }
});

const menuModel = mongoose.model('menu',menuSchema);

module.exports = menuModel;