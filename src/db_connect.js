require('dotenv').config();
const mongoose = require('mongoose');
const Pro_info = require(`./prodInfoSchema.js`);
const moment = require('moment');
const schedule = require('node-schedule');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://admin:15ad06min15@svc.sel3.cloudtype.app:32398/?authMechanism=DEFAULT", (err) => {
// mongoose.connect(process.env.MONGO_URI, (err) => {
    if(!err) console.log('db connected');
    else console.log('db error');
});

const save_prod_info = async (pro_info) => {

    // console.log("pcode : " + pro_info.pcode)
    // console.log("name : " + pro_info.name)
    // console.log("img_src : " + pro_info.img_src)
    // console.log("price : " + pro_info.prices[0].low_price)

    const same_pcode = await Pro_info.findOne().where('pcode').equals(pro_info.pcode);

    // pcode 일치가 없다면 전부 저장
    if(!same_pcode) {
        
        console.log(pro_info.pcode + "동일 pcode 없음")
    
        await pro_info.save();

        return pro_info;

    // pcode 일치하고 prices내 동일 date 없다면 가격 추가
    } else if (moment(same_pcode.prices[same_pcode.prices.length - 1].date).format(`YYYY-MM-DD`) != moment().format(`YYYY-MM-DD`)){

        console.log(pro_info.pcode + "동일 pcode 있음, prices내 동일 date 없음")

        await Pro_info.updateOne({pcode:pro_info.pcode},{$push: {prices : {low_price : pro_info.prices[0].low_price}}});

        await pro_info.prices.push({low_price : pro_info.prices[0].low_price, date : moment().format(`YYYY-MM-DD`)});

        return pro_info;

    } else {

        console.log(pro_info.pcode + "동일 pcode 있음, prices내 동일 date 있음")
        // await Pro_info.updateOne({pcode:pro_info.pcode},{$push: {prices : {low_price : pro_info.prices[0].low_price, date : moment("2023-03-03").format(`YYYY-MM-DD`)}}});
        return same_pcode;
    }

};

// const get_prod_info = async (pro_info) => {
//     const same_pcode = await Pro_info.findOne().where('pcode').equals(pro_info.pcode);

//     // pcode 일치가 없다면
//     if(!same_pcode) {

//         return pro_info;

//     // pcode 일치하고 prices내 동일 date 없다면 가격 추가
//     } else if (moment(same_pcode.prices[same_pcode.prices.length - 1].date).format(`YYYY-MM-DD`) != moment().format(`YYYY-MM-DD`)) {



//     } else {

//     }

// };

const node_schedule = async () => {
    const job = schedule.scheduleJob('0 * * *', async function(){
        console.log('데이터 최신화');
        const all_pcode = await Pro_info.find();
        all_pcode.forEach((value, index, array)=>{
            save_prod_info(value)
        })
      });
}


module.exports.save_prod_info = save_prod_info;
// module.exports.get_prod_info = get_prod_info;
module.exports.node_schedule = node_schedule;
