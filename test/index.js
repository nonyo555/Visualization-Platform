const express = require('express')
const path = require('path')
const app = express()
const Vgen = require('./vgenTest.js')
const chord  = require('./chords/classChord')
const rtscatter = require('./scatter/scatterClass')
const moment = require('moment')
var  testScatter =  [{"x":5471142,"y":37,"index":"tweleve"},{"x":276832,"y":48,"index":"seven"},{"x":1557893,"y":53,"index":"six"},{"x":5806689,"y":86,"index":"six"},{"x":6099186,"y":68,"index":"six"},{"x":5420379,"y":38,"index":"four"},{"x":8317289,"y":89,"index":"six"},{"x":4585352,"y":47,"index":"one"},{"x":539544,"y":51,"index":"one"},{"x":1658061,"y":25,"index":"two"},{"x":8705645,"y":99,"index":"eight"},{"x":5665567,"y":26,"index":"ten"},{"x":9270070,"y":77,"index":"two"},{"x":2274416,"y":90,"index":"tweleve"},{"x":2953237,"y":13,"index":"five"},{"x":4424880,"y":0,"index":"six"},{"x":3501071,"y":64,"index":"eleven"},{"x":2825819,"y":27,"index":"six"},{"x":244983,"y":84,"index":"six"},{"x":8926212,"y":1,"index":"six"},{"x":616911,"y":67,"index":"one"},{"x":3551177,"y":56,"index":"eleven"},{"x":7060220,"y":15,"index":"eight"},{"x":8852676,"y":40,"index":"four"},{"x":996698,"y":88,"index":"four"},{"x":4954373,"y":91,"index":"tweleve"},{"x":6675924,"y":33,"index":"six"},{"x":2787570,"y":74,"index":"two"},{"x":2415148,"y":66,"index":"seven"},{"x":518256,"y":37,"index":"eight"},{"x":1396027,"y":6,"index":"six"},{"x":903214,"y":58,"index":"ten"},{"x":7276743,"y":54,"index":"eight"},{"x":6751188,"y":58,"index":"four"},{"x":3509543,"y":80,"index":"four"},{"x":4846067,"y":91,"index":"two"},{"x":6529270,"y":5,"index":"five"},{"x":7387401,"y":46,"index":"eight"},{"x":5229310,"y":70,"index":"nine"},{"x":6661213,"y":79,"index":"six"},{"x":620747,"y":79,"index":"one"},{"x":3098408,"y":57,"index":"eight"},{"x":9079463,"y":92,"index":"four"},{"x":8217920,"y":5,"index":"eleven"},{"x":9352700,"y":76,"index":"seven"},{"x":8253361,"y":60,"index":"six"},{"x":2373225,"y":20,"index":"tweleve"},{"x":373377,"y":62,"index":"nine"},{"x":7572856,"y":57,"index":"four"},{"x":1722899,"y":74,"index":"three"},{"x":3073026,"y":3,"index":"eight"},{"x":923123,"y":69,"index":"nine"},{"x":1396608,"y":58,"index":"one"},{"x":4909746,"y":36,"index":"eleven"},{"x":9429303,"y":15,"index":"one"},{"x":3577223,"y":48,"index":"five"},{"x":1201707,"y":39,"index":"six"},{"x":3060018,"y":18,"index":"four"},{"x":2006172,"y":27,"index":"tweleve"},{"x":2428847,"y":52,"index":"tweleve"},{"x":7688537,"y":41,"index":"three"},{"x":9506566,"y":46,"index":"four"},{"x":9232790,"y":0,"index":"six"},{"x":3018107,"y":64,"index":"eight"},{"x":1846910,"y":12,"index":"three"},{"x":7794060,"y":48,"index":"nine"},{"x":1410188,"y":34,"index":"six"},{"x":4879130,"y":8,"index":"five"},{"x":2374978,"y":10,"index":"eleven"},{"x":5504948,"y":88,"index":"three"},{"x":71140,"y":4,"index":"three"},{"x":6723453,"y":99,"index":"eight"},{"x":5558168,"y":98,"index":"six"},{"x":5518622,"y":22,"index":"five"},{"x":2036469,"y":61,"index":"six"},{"x":5237664,"y":38,"index":"seven"},{"x":2232923,"y":48,"index":"eight"},{"x":9205031,"y":72,"index":"seven"},{"x":190257,"y":43,"index":"ten"},{"x":6385662,"y":84,"index":"nine"},{"x":951988,"y":94,"index":"eleven"},{"x":1016708,"y":33,"index":"four"},{"x":6072828,"y":53,"index":"three"},{"x":3796706,"y":85,"index":"tweleve"},{"x":8000991,"y":58,"index":"three"},{"x":800189,"y":29,"index":"three"},{"x":7191729,"y":42,"index":"six"},{"x":1933652,"y":93,"index":"five"},{"x":4073438,"y":42,"index":"seven"},{"x":419371,"y":68,"index":"eight"},{"x":4001695,"y":62,"index":"five"},{"x":354871,"y":14,"index":"five"},{"x":5166826,"y":25,"index":"ten"},{"x":6567846,"y":68,"index":"seven"},{"x":4283937,"y":7,"index":"eleven"},{"x":7377059,"y":74,"index":"five"},{"x":9946185,"y":81,"index":"seven"},{"x":5620131,"y":86,"index":"tweleve"},{"x":7101359,"y":79,"index":"one"},{"x":7207316,"y":19,"index":"two"},{"x":49420,"y":45,"index":"nine"},{"x":2984214,"y":78,"index":"six"},{"x":8988741,"y":12,"index":"seven"},{"x":5083335,"y":18,"index":"ten"}]
const bubble  =require('./bubble/bubbleClass')
const makeRandomData = (nb) => {
  const res = [];
  const type = ['one','two','three','four','five','six','six','seven','eight','nine','ten','eleven','tweleve']
  for (i = 0; i < nb; i++) {
    res.push({
      x:  moment().unix() + ((moment().unix()%30)*86400) + ((Math.random()*24|0)*3600) ,
      y: Math.random() * 100 | 0,
      index: type[Math.random() * 13 | 0]
    });
  }
  return res;
};
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  next();
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/test.htm'));
})
app.get('/bubble', (req, res) => {
  let bub = bubble.object()
  res.send(bub.generateHTML())
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
  let data = testScatter
  let config = { 
    xLabel:'x',
    yLabel: 'y',
    typeLabel:'index' ,
    delay: '6000',
    timeMode: 'true',
    linkAPI: 'http://localhost/random'
  }
  let scatter = rtscatter.object()
  scatter.setAttr(data,config)
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

