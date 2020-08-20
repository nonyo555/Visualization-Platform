var d3 = require("d3");
const express = require('express')
const app = express()
// const root = partition(data);
console.log(d3)

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(80, () => {
  console.log('Start server at port 80.')
})