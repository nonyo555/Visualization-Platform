const express = require('express')
const path = require('path')
const app = express()
const Vgen = require('./vgenTest.js')
const chord  = require('./chords/classChord')
const rtscatter = require('./scatter/scatterClass')

const makeRandomData = (nb) => {
  const res = [];
  for (i = 0; i < nb; i++) {
    res.push({
      x: Math.random() * 100 | 0,
      y: Math.random() * 100 | 0,
      index: Math.random() * 8 | 0
    });
  }
  return res;
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/test.htm'));
})
app.get('/zoomablesunburst.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/zoomablesunburst.js'));
  //res.send(test.chart())
  //console.log(test.chart().style)
})
app.get('/random',(req,res)=>{
  res.send( makeRandomData(104))
})
app.get('/rtscatter',(req,res)=>{
  let scatter = rtscatter.object()
  res.send(scatter.generateHTML())
})
app.get('/linepie', (req, res) => {
  var linepie = Vgen.Vgen.createLinepie()
  var JsonList=[
    {pro:'Nan',label:'Hello1',data:123},
    {pro:'Nan',label:'Hello2',data:153},
    {pro:'Nan',label:'Hello3',data:143},
    {pro:'Bueng Kan',label:'Hello1',data:233},
    {pro:'Bueng Kan',label:'Hello2',data:523},
    {pro:'Bueng Kan',label:'Hello3',data:323},
    {pro:'Bangkok',label:'Hello1',data:173},
    {pro:'Bangkok',label:'Hello2',data:193},
    {pro:'Bangkok',label:'Hello3',data:133}
  ];
  linepie.setJsontoJsonDataset(JsonList,'label','data')
  linepie.generateHTML();
  res.send(linepie.generateHTML(true))
})
// //console.log(test.a());
app.get('/thaiPolygon', (req, res) => {
  var thaipoly = Vgen.Vgen.createThaiPolygon()
  var JsonList=[
    {pro:'Nan',label:'Hello',data:123},
    {pro:'Nan',label:'Hello',data:153},
    {pro:'Nan',label:'Hello',data:143},
    {pro:'Nan',label:'Hello2',data:123},
    {pro:'Nan',label:'Hello2',data:153},
    {pro:'Nan',label:'Hello2',data:143},
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

app.get('/chord', (req, res) => {
  let  test  = chord.object()
  res.send(test.generateHTML());
})
app.get('/thai', (req, res) => {
  res.sendFile(path.join(__dirname + '/thailandPolygon.js'));
})
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname + '/testPerformance.html'));
})
app.get('/vgenTest.js', (req, res) => {
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

