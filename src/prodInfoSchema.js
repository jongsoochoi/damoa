const mongoose = require('mongoose');

const prodInfoSchema = new mongoose.Schema({
  pcode: { type: Number, required: true, unique: true },
  img_src: { type: String, required: true},
  save_date: { type: Date, default: Date.now }
});

const Pro_Info = mongoose.model('Prod_Info', prodInfoSchema);
exports = Pro_Info;