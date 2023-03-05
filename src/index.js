const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const db_connect = require('./db_connect.js');
const scraping = require('./scraping.js');

const app = express();

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

// 매일 전체 물건 가격 최신화
db_connect.node_schedule();



//  p_url를 포함하여 get방식으로 요청시
app.get('/crawl', async (req, res) => {
  const pro_info  = await scraping.parsing(req.query.pcode, req.query.p_url);

  // const get_data = await db_connect.get_prod_info(pcode, name, img_src, price);
  // console.log("index : " + get_data)

  res.json(await db_connect.save_prod_info(pro_info));
});
