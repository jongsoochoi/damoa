const schedule = require('node-schedule');
const moment = require('moment');

const scraping = require('./scraping.js');
const db_connect = require('./db_connect.js');
const sorting_prices = require(`./sorting_prices.js`);
const dbModel = require('./dbModel.js');


// 매 시간 반복하는 함수
function hourlyRoutine() {

    console.log(`데이터 최신화 ${moment().add(9, 'hours')}`);

    const rule = new schedule.RecurrenceRule();
    rule.minute = 0;

    // 반복할 함수 입력
    schedule.scheduleJob(rule, async () => {

        // 전 제품 정보페이지를 저장
        const pro_infos = await dbModel.findAll();

        // 제품마다 가격 최신화 실행
        pro_infos.forEach(async (pro_info) => {
            db_connect.save_prod_info(await scraping.parsing(pro_info.pcode));
        })

    });
};


//매일 반복하는 함수
function dailyRoutine() {

    console.log(`데이터 최신화 ${moment().add(9, 'hours')}`);

    // 최신 가격 업데이트 시간 
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0 + 15; //(서버시간이 9시간 느림)
    rule.minute = 0;

    // 반복할 함수 입력
    schedule.scheduleJob(rule, async () => {

        // 전 제품 정보페이지를 저장
        const pro_infos = await dbModel.findAll();

        // 문서 별 반복
        pro_infos.forEach(async (pro_info) => {
            // 문서내 prices 데이터 순서 오름차순 및 중복 데이터 삭제 후 저장
            pro_info.prices = await sorting_prices.removeDuplicatePrices(pro_info.prices);
            dbModel.saveProdinfo(pro_info);

        })
    });
};


module.exports.hourlyRoutine = hourlyRoutine;
module.exports.dailyRoutine = dailyRoutine;
