
const express = require('express')
const path = require('path')
//const test = require('./zoomablesunburst.js')
const app = express()
const Vgen = require('./vgenTest.js')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/test.htm'));
})
app.get('/zoomablesunburst.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/zoomablesunburst.js'));
  //res.send(test.chart())
  //console.log(test.chart().style)
})
// //console.log(test.a());
app.get('/test.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/test.js'));
})
app.get('/vgenTest.js', (req, res) => {3
  var sunburst = Vgen.Vgen.createSunburst()
  res.send(sunburst.generateHTML())
})
app.listen(80, () => {
  //console.log(Vgen.Vgen.createSunburst().genConfig('del','abc',{'name2':'Aunaun'}))
  console.log('Start server at port 80.')
})

