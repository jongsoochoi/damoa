const express = require('express');
const cors = require('cors');

const schedule = require('./schedule.js');
const db_connect = require('./db_connect.js');
const scraping = require('./scraping.js');
const sorting_prices = require(`./sorting_prices.js`);
const Pro_info = require(`./prodInfoSchema.js`);


const app = express();
app.use(cors());

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));


// 매 시간 데이터 최신화
schedule.hourlyRoutine();

// 매 일 DB prices 순서 정렬 체크 
schedule.dailyRoutine();

// 주소/crawl?pcode=(제품코드 또는 p_url) 또는
// 주소/crawl?p_url=(모바일공유시 생성된 주소) get방식으로 요청시
app.get('/crawl', async (req, res) => {

  // 데이터 스크랩핑 문서 pro_info에 저장
  const pro_info  = await scraping.parsing(req.query.pcode, req.query.p_url);

  if(!pro_info) {
    res.send("error data")
  } else {
    res.json(await db_connect.save_prod_info(pro_info));
  }

});


// 주소/sort 사용시 DB데이터 문서마다 prices 순서 오름차순으로 정렬
app.get('/sort', async (req, res) => {
  
  // 전 문서 저장
  const pro_infos = await Pro_info.find();

  //문서별 반복
  pro_infos.forEach(async pro_info => {
    
    // 문서내 prices 데이터 순서 오름차순 및 중복 데이터 삭제 후 저장
    await sorting_prices.removeDuplicatePrices(pro_info.prices);
    dbModel.saveProdinfo(pro_info);
  });

  res.json(pro_infos);

});
