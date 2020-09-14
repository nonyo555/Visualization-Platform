
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
app.get('/thaiPolygon', (req, res) => {
  var thaipoly = Vgen.Vgen.createThaiPolygon()
  var JsonList=[
    {pro:'Nan',label:'Hello',data:123},
    {pro:'Nan',label:'Hello',data:153},
    {pro:'Nan',label:'Hello',data:143},
    {pro:'Bueng Kan',label:'Hello',data:233},
    {pro:'Bueng Kan',label:'Hello',data:523},
    {pro:'Bueng Kan',label:'Hello',data:323},
    {pro:'Bangkok',label:'Hello',data:173},
    {pro:'Bangkok',label:'Hello',data:193},
    {pro:'Bangkok',label:'Hello',data:133}
  ];
  thaipoly.setJsontoJsonDataset(JsonList,'pro','label','data')
  res.send(thaipoly.generateHTML())
})

app.get('/thai', (req, res) => {
  res.sendFile(path.join(__dirname + '/thailandPolygon.js'));
})
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname + '/testPerformance.html'));
})
app.get('/vgenTest.js', (req, res) => {3
  var sunburst = Vgen.Vgen.createSunburst()
  res.send(sunburst.generateHTML())
})
app.get('/thailand.json', (req, res) => {
  console.log('lol')
  res.sendFile(path.join(__dirname + '/thailand.json'));
})
app.listen(80, () => {
  //console.log(Vgen.Vgen.createSunburst().genConfig('del','abc',{'name2':'Aunaun'}))
  console.log('Start server at port 80.')
})

