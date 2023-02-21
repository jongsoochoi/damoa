const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

//특정 url HTML 받기
const getHTML = async (pcode) => {
  try {
    return await axios.get("https://prod.danawa.com/info/?pcode=" + pcode);
  } catch (err) {
    console.log(err);
  };
};

// 파라미터로 pcode(제품 코드) 입력 후 해당 url의 HTML 파싱 한 후 [ 해당 제품 당일 최저가 , 해당 제품 이미지 src ] return
const parsing = async (pcode) => {
  const html = await getHTML(pcode);
  const $ = cheerio.load(html.data);

  //다나와 최저가 저장
  const price = $('em[class=prc_c]', '.lwst_prc').html();
  
  //다나와 이미지 src
  const img_src = 'https:' + $('#baseImage').attr('src').split('?')[0];
  
  return [price,img_src];
};


// pcode포함하여 get방식으로 요청시 
app.get('/crawl', async (req, res) => {
  const pcode = req.query.pcode; // Get the pcode from the request query
  const [low_price, img_src]  = await parsing(pcode)

  res.json({price : low_price, img_src : img_src})
});