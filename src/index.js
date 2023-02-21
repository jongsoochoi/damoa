const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

//특정 url HTML 받기
const getHTML = async (url) => {
  try {
    return await axios.get(url);
  } catch (err) {
    console.log(err);
  };
};

// 파라미터로 pcode(제품 코드) 입력 후 해당 url의 HTML 파싱 한 후 [ 해당 제품 당일 최저가 , 해당 제품 이미지 src ] return
const parsing = async (url) => {
  const html = await getHTML(url);
  const $ = cheerio.load(html.data);

  //다나와 최저가 저장
  
  //다나와 이미지 src
  const p_json = $('[type=application/ld+json]').html();
  const name = $('id=productBlog-productName').html();
  const price = JSON.parse(p_json).offers.lowPrice;
  const img_src = JSON.parse(p_json).image[0];
  console.log(price);
  console.log(img_src);
  
  return [name, price, img_src];
};

// pcode포함하여 get방식으로 요청시 
app.get('/crawl', async (req, res) => {
  const url = req.query.url; // Get the pcode from the request query
  const [name, low_price, img_src]  = await parsing(url)

  res.json({name: name ,price : low_price, img_src : img_src, })
});
