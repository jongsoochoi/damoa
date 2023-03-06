const mongoose = require('mongoose');
const moment = require('moment');

const lowPriceSchema = new mongoose.Schema({
  date: { type: Number},
  low_price: {type: Number, unique: true},
  _id : false
});

const prodInfoSchema = new mongoose.Schema({
  pcode: { type: Number, required: true, unique: true },
  // pcode: { type: Number, required: true},
  name: { type: String, required: true},
  img_src: { type: String, required: true},
  save_date: { type: Date, default: Date.now},
  prices: [lowPriceSchema],
});

module.exports = mongoose.model('Prod_Info', prodInfoSchema);