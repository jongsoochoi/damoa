const test_datas = require(`./test_datas.js`);
const dbModel = require('./dbModel.js');
const sorting_prices = require(`./sorting_prices.js`);

//크롤링한 데이터를 저장할지 정하는 메소드
async function save_prod_info(pro_info) {
    
    // 크롤링한 정보(pro_info)에서 pcode와 동일한 값을 조회
    const same_pcode_pro_info = await dbModel.findOneProdinfo( pro_info.pcode)

    const today_date = pro_info.prices[0].date;
    const today_lowprice = pro_info.prices[0].low_price;

    if (!same_pcode_pro_info) { // same_pcode_pro_info가 없다면

        console.log('최초 데이터와 테스트 데이터 입력');
        
        // 테스트용 데이터 입력
        pro_info.prices = test_datas.input_test_data(pro_info.prices)

        // 인접한 데이터의 low_price가 같다면 date를 비교해서 작은 date 값을 가지고 있는 것만 남긴다 
        pro_info.prices = sorting_prices.removeDuplicatePrices(pro_info.prices);

        return await dbModel.saveProdinfo(pro_info);
        
    // 오늘 날짜 , DB문서 최신 날짜 가 같고
    // 오늘 최저 가격이 DB문서 최신 가격보다 작다면
    } else if ( today_date === same_pcode_pro_info.prices.slice(-1)[0].date && today_lowprice < same_pcode_pro_info.prices.slice(-1)[0].low_price ) { 
        
        console.log(`${today_date} ${same_pcode_pro_info.prices.slice(-1)[0].low_price} >> ${today_lowprice} 최저가 변경`)
        same_pcode_pro_info.prices.splice(-1, 1, {date : today_date , low_price : today_lowprice});

        return dbModel.saveProdinfo(same_pcode_pro_info);

    // 오늘 날짜 , DB문서 최신 날짜 더 최신이고
    // 오늘 최저 가격이 DB문서 최신 가격 다르다면
    } else if (today_date > same_pcode_pro_info.prices.slice(-1)[0].date && today_lowprice !== same_pcode_pro_info.prices.slice(-1)[0].low_price) {

        console.log(`${today_date} ${today_lowprice} 최저가 추가`)
        same_pcode_pro_info.prices.push({date : today_date , low_price : today_lowprice});

        return dbModel.saveProdinfo(same_pcode_pro_info);
    };

    return same_pcode_pro_info;
};


module.exports.save_prod_info = save_prod_info;
