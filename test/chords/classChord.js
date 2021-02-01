var fs = require('fs');
var d3 = require('d3');
var chord = require('./chordEmbeded')
function csvtojson(csvText){
    let data = []
    let rows = csvText.split('\n');
    let col = rows[0].split('\r')[0].split(',')
    for(let i=1 ; i<rows.length;i++){
        var  r =  rows[i].split('\r')[0]
        r =     r.split(',')
        var json = {}
        for(let j = 0; j<col.length;j++){
            if (r[j]!= "" && r[j] != undefined){
                json[col[j]] = r[j]
            }
        }
        // {} == {} => false wtf
        if(Object.keys(json).length != 0){
        data.push(json)
        }
    }
    return data
  }

class Chord{
    constructor(){
        this.test = csvtojson(fs.readFileSync('chords/debt.csv').toString())
    }
    getTest(){
        return this.test
    }
    generateHTML(){
       // console.log(this.test)
        var dom = `
        <head>
        <script src="https://d3js.org/d3.v5.js"></script>
        <script src="https://d3js.org/d3-color.v2.min.js"></script>
        <script src="https://d3js.org/d3-path.v2.min.js"></script>
        <script src="https://d3js.org/d3-chord.v2.min.js"></script>
    </head>

    <body>
      <div style="position: relative;">
      <svg id ='graph'>
      </svg>
      </div>
      </div>
      
    <script>
        var dataset = `+ JSON.stringify(this.test)+`
        `+chord.chords.toString()+`
        chords(dataset)
    </script>
    </body>
        `
    return dom
    }
} 
function object (){return  new Chord();}
module.exports = {object}