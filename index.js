require('dotenv').config();
const express = require('express');
/** Cross Origin Resource Sharing */
const cors = require('cors');
const app = express();

const axios = require('axios');
const cheerio = require('cheerio');

app.use(cors());

/** 땡땡 포트 번호 */
const port = 3000


//특정 url HTML 받기
const getHTML = async (pcode) => {
  try {
    return await axios.get("https://prod.danawa.com/info/?pcode=" + pcode);
  } catch (err) {
    console.log(err);
  };
};


//HTML 파싱
const parsing = async (pcode) => {
  const html = await getHTML(pcode);
  const $ = cheerio.load(html.data);

  //다나와 최저가 저장
  const price = $('em[class=prc_c]', '.lwst_prc').html();
  console.log(price)

  //다나와 이미지 src
  const imgsrc = $('#baseImage').attr('src').split('?')[0].split('/img/')[1];
  console.log(imgsrc);
}


app.get('/', function (req, res) {
  res.send(`Hello World`)
});

app.get('/find', function (req, res) {
  res.send(parsing(req.query.pcode).price)
});

app.listen(port, () => {
    console.log(`Example app Listening on port ${port}`)
});

