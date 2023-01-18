const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

/** 땡땡 포트 번호 */
const port = 3000

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(port, () => {
    console.log('Example app Listening on port ${port}')
})