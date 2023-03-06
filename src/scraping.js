const axios = require('axios');
const cheerio = require('cheerio');
const Pro_info = require(`./prodInfoSchema.js`);
const moment = require('moment');

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
  
  // 파라미터로 pcode(제품 코드) 입력 후 해당 url의 HTML 파싱 한 후 [ 해당 제품 당일 최저가 , 해당 제품 이미지 src ] return
  const parsing = async (p_code, p_url) => {

    let url = "";

    if(p_code != null) {
        console.log("pcode 입력 : " + p_code);
        url = "https://prod.danawa.com/info/?pcode=" + p_code;
        console.log(url);
    } else if (p_url != null) {
        console.log("p_url 입력 : " + p_url);
        url = "https://danawa.page.link/" + p_url;
        console.log(url);
    };

    const html = await getHTML(url);
    const $ = cheerio.load(html.data);

    //리턴값
    const pro_info = new Pro_info();
  
    // 제품 JSON
    const p_json = JSON.parse($('[type=application/ld+json]').html());
  
    // 다나와 제품 코드 저장
    pro_info.pcode = Number(p_json.sku);
  
    // 다나와 제품명 저장
    pro_info.name = p_json.name;
  
    // 다나와 이미지 src 저장
    pro_info.img_src = "https:" + p_json.image[0];
  
    // 다나와 최저가 저장
    pro_info.prices.push({low_price : Number(p_json.offers.lowPrice), date : Number(moment().format(`YYYYMMDD`))});

    
    console.log("parsing : " + pro_info)

    return pro_info;
  };



  
module.exports.parsing = parsing;