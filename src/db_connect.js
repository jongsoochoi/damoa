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

    const same_pcode = await Pro_info.findOne({ pcode : pro_info.pcode });
    console.log(same_pcode);
    if(same_pcode){
        const prices = same_pcode.prices
        prices.sort((a, b) => b.date - a.date);
        console.log(prices);
    }

    const today_date = Number(moment().format(`YYYYMMDD`));
    const today_lowprice = pro_info.prices[0].low_price;

    // pcode 일치가 없다면 전부 저장
    if(!same_pcode) {
        
        console.log(pro_info.pcode + "동일 pcode 없음")
    
        await pro_info.save();

        return pro_info;

    // pcode 일치하고 prices내 동일 date 없다면 가격 추가
    } else if (same_pcode.prices[0].date != today_date){

        console.log(pro_info.pcode + "동일 pcode 있음, prices내 동일 date 없음")

        await Pro_info.updateOne({pcode:pro_info.pcode},{$push: {prices : {low_price : today_lowprice, date : today_date}}});

        await pro_info.prices.push({low_price : today_lowprice , date : today_date});

        return pro_info;

    } else {

        console.log(pro_info.pcode + "동일 pcode 있음, prices내 동일 date 있음");
        return same_pcode;
    }

};



const node_schedule = async () => {

    // 최신 가격 업데이트 시간
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;

    // 반복할 함수 입력
    schedule.scheduleJob(rule, async () =>  {

        // 제품 정보페이지를 저장
        const all_pcode = await Pro_info.find();

        // 제품마다 가격 최신화 실행
        all_pcode.forEach((value, index, array)=>{
            save_prod_info(value)
        })

    console.log('데이터 최신화');
  });

}


module.exports.save_prod_info = save_prod_info;
module.exports.node_schedule = node_schedule;
