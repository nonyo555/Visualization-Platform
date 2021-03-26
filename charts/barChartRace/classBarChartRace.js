const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const barChartRace = require('./embedded.js')

class BarChartRace {
    constructor(){
        this.data = [];
        this.duration = 250;
        this.n =12;
        this.barSize = 48;
    }

    setDuration(duration) {
        if (typeof duration === 'number'){
            this.duration = duration;
        }
    }
    setN(n) {
        if (typeof n === 'number'){
            this.n = n;
        }
    }
    setBarSize(barSize){
        if (typeof barsize === 'number'){
            this.barSize = barSize;
        }
    }
    setData(data){
        if(data!=[])
            this.data = data;
    }

    setAttr(data,config){
        var keys = Object.keys(config)
        //if (key.includes = )
        if (keys.includes('duration')){
            this.setDuration(config.duration)
        }
        if (keys.includes('n')){
            this.setN(config.n)
        }
        if (keys.includes('barSize')){
            this.setBarSize(config.barSize)
        }

        this.setData(data);
    }
    getDuration() {
        return this.duration;
    }
    getN() {
        return this.n;
    }
    getBarSize(){
        return this.barSize;
    }
    getData(){
        return this.data;
    }

    generateHTML(){
        var dom = new JSDOM(`
                <head>
                    <script src="https://d3js.org/d3-color.v2.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/6.6.1/d3.min.js"></script>
                </head>
                <body>
                    <div id=chart>
                    </div>
                <script>
                `+barChartRace.barChartRace.toString()+`
                var barChartRace = barChartRace(`+JSON.stringify(this.data)+`,`+this.duration+`,`+this.n+`,`+this.barSize+`)
                </script>
                </body>
                </html>
        `)
        return dom.serialize()
    }
}
function object (){return  new BarChartRace();}
module.exports = {object}