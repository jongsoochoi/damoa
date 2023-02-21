const mongoose = require('mongoose');

const prodInfoSchema = new mongoose.Schema({
  pcode: { type: Number, required: true, unique: true },
  img_src: { type: String },
  save_date: { type: Date, default: Date.now }
});

const Pro_Info = mongoose.model('prod_info', prodInfoSchema);
exports = Pro_Info;