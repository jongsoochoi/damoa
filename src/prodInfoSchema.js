const mongoose = require('mongoose');

const lowPriceSchema = new mongoose.Schema({
  date: { type: Number, unique: true},
  low_price: {type: Number},
  _id : false
});

const prodInfoSchema = new mongoose.Schema({
  pcode: { type: Number, required: true, unique: true },
  name: { type: String, required: true},
  img_src: { type: String, required: true},
  save_date: { type: Date, default: Date.now},
  prices: [lowPriceSchema],
});

module.exports = mongoose.model('Prod_Info', prodInfoSchema);