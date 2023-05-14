// 인접한 데이터의 low_price가 같다면 date를 비교해서 작은 date 값을 가지고 있는 것만 남긴다.
// 인접한 데이터의 date가 같다면 low_price를 비교해서 작은 low_price를 값을 가지고 있는 것만 남긴다.
function removeDuplicatePrices(prices) {

    prices.sort((a, b) => a.date - b.date);

    for (let i = 0; i < prices.length - 1; i++) {

        if (prices[i].date === prices[i + 1].date) {
            if (prices[i].low_price > prices[i + 1].low_price) {
                console.log(`날짜 : ${prices[i].date} 가격 ${prices[i + 1].low_price} 제거`);
                prices.splice(i + 1, 1);
            } else {
                console.log(`날짜 : ${prices[i].date} 가격 ${prices[i].low_price} 제거`);
                prices.splice(i, 1);
            };
            i--;
        };

        if (prices[i].low_price === prices[i + 1].low_price) {
            if (prices[i].date < prices[i + 1].date) {
                console.log(`가격 ${prices[i].low_price} 날짜 ${prices[i + 1].date} 제거`);
                prices.splice(i + 1, 1);
            } else {
                console.log(`가격 ${prices[i].low_price} 날짜 ${prices[i].date} 제거`);
                prices.splice(i, 1);
            };
            i--;
        };
    };

    return prices;
};


module.exports.removeDuplicatePrices = removeDuplicatePrices;
