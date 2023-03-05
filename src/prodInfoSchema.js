const mongoose = require('mongoose');
const moment = require('moment');

const lowPriceSchema = new mongoose.Schema({
  date: { type: Date, default: moment().format(`YYYY-MM-DD`)},
  low_price: {type: Number},
  _id : false
});

const prodInfoSchema = new mongoose.Schema({
  pcode: { type: Number, required: true, unique: true },
  // pcode: { type: Number, required: true},
  name: { type: String, required: true},
  img_src: { type: String, required: true},
  save_date: { type: Date, default: moment().format(`YYYY-MM-DD`)},
  prices: [lowPriceSchema],
});

module.exports = mongoose.model('Prod_Info', prodInfoSchema);