const moment = require('moment');


// 테스트용 가격 입력
function input_test_data(prices) {
    //테스트 데이터 양
    const test_amount = 20;
    // 날짜 범위
    const date_range = 3;
    // 가격 오차 범위
    const price_range = 500;
    for (var i = 0; i < test_amount; i++) {
        const test_date = Number(moment().subtract(Math.floor(Math.random() * date_range) + date_range * i, 'days').format('YYYYMMDD'));
        const test_lowPrice = Number(prices[0].low_price) + Math.floor(Math.random() * price_range * 2) - price_range;

        prices.unshift({ date: test_date, low_price: test_lowPrice });
    }
    return prices
    
}


module.exports.input_test_data = input_test_data;
