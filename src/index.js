const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const app = express();

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

//특정 url HTML 받기
const getHTML = async (url) => {
  try {
    return await axios({
      method: "get",
      url: url
    });
  } catch (err) {
    console.log(err);
  };
};

const getEUCKR = async (text) => {
  return await iconv.decode(text,'utf16');
};

// 파라미터로 pcode(제품 코드) 입력 후 해당 url의 HTML 파싱 한 후 [ 해당 제품 당일 최저가 , 해당 제품 이미지 src ] return
const parsing = async (url) => {
  const html = await getHTML(url);
  const $ = cheerio.load(html.data);

  
  // 제품 JSON
  const p_json = JSON.parse($('[type=application/ld+json]').html());

  // 다나와 제품명 저장
  const name = p_json.name;
  // const name = "rr"

  // 다나와 제품 코드 저장
  const pcode = p_json.sku;
  // const pcode = "rr"

  // 다나와 최저가 저장
  const price = p_json.offers.lowPrice;

  // 다나와 이미지 src 저장
  const img_src = p_json.image[0];

  return [name, pcode, price, img_src];
};

//  p_url를 포함하여 get방식으로 요청시
app.get('/crawl', async (req, res) => {
  if(req.query.pcode != null) {
    const p_code = req.query.pcode;
    const [name, pcode, low_price, img_src]  = await parsing("https://prod.danawa.com/info/?pcode=" + p_code);
    res.json({name: name ,pcode : pcode, price : low_price, img_src : img_src});
  } else if (req.query.p_url != null) {
    const p_url = req.query.p_url;
    const [name, pcode, low_price, img_src]  = await parsing("https://danawa.page.link/" + p_url);
    res.json({name: name ,pcode : pcode, price : low_price, img_src : img_src});
  }
});
