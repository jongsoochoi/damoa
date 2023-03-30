const moment = require('moment');

//테스트용 가격 입력
function input_test_data(prices) {
    for (var i = 0; i < 20; i++) {
        const test_date = Number(moment().subtract(Math.floor(Math.random() * 3) + 3 * i, 'days').format('YYYYMMDD'));
        const test_lowPrice = Number(prices[0].low_price) + Math.floor(Math.random() * 1000) - 500;

        prices.push({ date: test_date, low_price: test_lowPrice });
    }
    return prices
}

// 인접한 데이터의 low_price가 같다면 date를 비교해서 작은 date 값을 가지고 있는 것만 남긴다 
function removeDuplicatePrices(prices) {

    for (let i = 0; i < prices.length - 1; i++) {
        if (prices[i].low_price === prices[i + 1].low_price) {
            if (prices[i].date > prices[i + 1].date) {
                prices.splice(i, 1);
            } else {
                prices.splice(i + 1, 1);
            };
            i--;
        };
    };
    return prices;
}


module.exports.input_test_data = input_test_data;
module.exports.removeDuplicatePrices = removeDuplicatePrices;