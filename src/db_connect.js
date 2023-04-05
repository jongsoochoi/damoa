require('dotenv').config();
const mongoose = require('mongoose');
const Pro_info = require(`./prodInfoSchema.js`);
const schedule = require('node-schedule');
const test_datas = require(`./test_datas.js`);
const scraping = require('./scraping.js');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, (err) => {
    if (!err) console.log('db connected');
    else console.log('db error');
});

//크롤링한 데이터를 저장할지 정하는 메소드
async function save_prod_info(pro_info) {

    // 크롤링한 정보(pro_info)에서 pcode와 동일한 값을 조회
    const same_pcode = await Pro_info.findOne({ pcode: pro_info.pcode });

    const today_date = pro_info.prices[0].date;
    const today_lowprice = pro_info.prices[0].low_price;

    if (!same_pcode) {
        console.log('최초 데이터와 테스트 데이터 입력');
        
        const new_prod_info = new Pro_info({
            pcode: pro_info.pcode,
            name: pro_info.name,
            img_src: pro_info.img_src,
            prices: pro_info.prices,
        });

        // 테스트용 데이터 입력
        new_prod_info.prices = test_datas.input_test_data(new_prod_info.prices)

        // 인접한 데이터의 low_price가 같다면 date를 비교해서 작은 date 값을 가지고 있는 것만 남긴다 
        new_prod_info.prices = test_datas.removeDuplicatePrices(new_prod_info.prices);

        return await new_prod_info.save();

    // } else if ( same_pcode.prices[0].date === today_date && today_lowprice < same_pcode.prices[0].low_price) {
    } else if ( today_date === same_pcode.prices.slice(-1)[0].date && today_lowprice < same_pcode.prices.slice(-1)[0].low_price ) {
        console.log('동일 날짜에 최저가 갱신');

        // pcode 일치하고 prices내 동일 date 없다면 가격 추가
        const filter = { pcode: pro_info.pcode};
        const update = { $set: { "prices.$[elem].low_price": today_lowprice } }; //prices 최신 데이터 앞에 저장
        const options = { new: true, arrayFilters: [ { "elem.date": today_date } ]}; // 문서를 반환합니다.

        return await Pro_info.findOneAndUpdate(filter, update, options);
    } else if (today_date > same_pcode.prices.slice(-1)[0].date && today_lowprice !== same_pcode.prices.slice(-1)[0].low_price) {
        console.log('최저가 변화로 인하여 신규 날짜와 최저가 입력');

        const filter = { pcode: pro_info.pcode};
        const update = { $push: { "prices": {low_price : today_lowprice, date : today_date} } }; //prices 최신 데이터 앞에 저장
        const options = { new: true, upsert: true}; // 문서를 반환합니다.

        return await Pro_info.findOneAndUpdate(filter, update, options);

    };
    return same_pcode;
};

function node_schedule() {

    // 최신 가격 업데이트 시간 (서버시간이 9시간 느림)
    const rule = new schedule.RecurrenceRule();
    rule.minute = 0;

    // 반복할 함수 입력
    schedule.scheduleJob(rule, async () => {

        // 제품 정보페이지를 저장
        const all_pcode = await Pro_info.find();

        // 제품마다 가격 최신화 실행
        all_pcode.forEach(async(value) => {
            save_prod_info(scraping.parsing(value.pcode))
        })

        console.log('데이터 최신화');
    });

}

module.exports.save_prod_info = save_prod_info;
module.exports.node_schedule = node_schedule;
