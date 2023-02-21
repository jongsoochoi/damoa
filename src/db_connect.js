require('dotenv').config();
const mongoose = require('mongoose');
// const { save_prod_info } = require('./dbController.js');
mongoose.connect(process.env.MONGO_URI, (err) => {
    if (!err) console.log('db connected');
    else console.log('db error');
});

const prodInfoSchema = mongoose.Schema({
    pcode: { type: Number, required: true, unique: true },
    img_src: { type: String },
    save_date: { type: Date, default: Date.now }
});

const Pro_Info = mongoose.model('prod_info', prodInfoSchema);

const save_prod_info = (pcode, img_src) => {
    pro_info = new Pro_Info({
        pcode : pcode,
        img_src : img_src
    })
    pro_info.save().then(() => console.log('data_save'));
}

save_prod_info(1279000 , 'https//img.danawa.com/prod_img/500000/779/715/img/17715779_1.jpg')

