require('dotenv').config();
const mongoose = require('mongoose');
const Pro_info = require(`./prodInfoSchema.js`);


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, (err) => {
    if (!err) console.log('db connected');
    else console.log('db error');
});

async function findOneProdinfo(pcode) {
    return await Pro_info.findOne({ pcode : pcode });
};

async function findAll() {
    return await Pro_info.find();
};

async function saveProdinfo(pro_info) {
    return await pro_info.save();
};

module.exports.findOneProdinfo = findOneProdinfo;
module.exports.findAll = findAll;
module.exports.saveProdinfo = saveProdinfo;
