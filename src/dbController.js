require('./prodInfoSchema.js');

exports.save_prod_info = (pcode, img_src) => {
  pro_info = new Pro_Info({
    pcode: pcode,
    img_src: img_src
  })
  pro_info.save().then(() => console.log('data_save'));
}