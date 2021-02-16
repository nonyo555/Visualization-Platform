
const scatter = require('./scatterEmbeded')
class rtscatter{
    constructor(){
        this.width = 800
        this.height = 800
        this.color = []
        this.title = function (d) {
                //timeMode
                // return `x:`+moment.unix(d.x).format('ll')+`\ny:`+d.y
                return `x:`+d.x+`\ny:`+d.y
        }
       // this.linkAPI = `"http://localhost/random"`
        this.data  = ``
        this.delay = 60000
        this.timeMode;
        this.labelConfig = {x:'x',y:'y',index:'index'}
    }
    setWidth(width) {
        if (!isNaN(width) ) {
            this.width = parseInt(width) 
        }
    }
    setHeight(height) {
        if (!isNaN(height)) {
            this.height = parseInt(height)
        }
    }
    setTimeMode(bool){
        //console.log(bool)
        if (bool.toLowerCase() == 'true'){
            this.timeMode = true
        }
        else if(bool.toLowerCase() == 'false'){
            this.timeMode = false
        }
        else 
            throw 'Selecting time mode is failed'
    }
    setAttr(data,config){
        var keys = Object.keys(config)
        if (keys.includes('width') && keys.includes('height')) {
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        this.setTimeMode(config.timeMode)
        this.setDelay(config.delay)
        this.setColor(config)
        this.setTooltip(config)
        this.setData(data,config)
        this.setLabelConfig(config)
    }
    setLabelConfig(config){
        console.log('label config')
        this.labelConfig = {
            x:config.xLabel,
            y:config.yLabel,
            type:config.typeLabel
        }
    }
    setColor(config){
        console.log('color')
        if (Object.keys(config).includes('color')){
                this.color = config.color
        }    
    }
    setTooltip(config){
        console.log('tooltip')
        if(!Object.keys(config).includes('title') && this.timeMode){
            this.title = function (d) {
                //timeMode
                 return `x:`+moment.unix(d.x).format('ll')+`\ny:`+d.y
            }
        }
        else if (Object.keys(config).includes('title')){
            if(typeof title == 'string' || typeof title =='function'){
                this.title = title
            }
            else 
                throw "Your tooltip text is wrong"
        }
    }
    setData(data,config){
        // check is url in the future
        console.log('data')
        if(Object.keys(config).includes('linkAPI')){
            this.data =  `"${config.linkAPI}"`
        }
        else if(Array.isArray(data)){
            this.data = JSON.stringify(data)
            
        }
        else
            throw 'Error data format'
    }
    setDelay(delay){
        if (this.timeMode){
            if(!isNaN(delay))
                this.delay = delay 
            else
                throw "Your delay is not a number"
        }
    }
    generateHTML(){
        //add data
        {
            var dom = `
            <head>
                <script src="https://d3js.org/d3.v5.js"></script>
                <script src="https://d3js.org/d3-color.v2.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==" crossorigin="anonymous"></script>
            </head>
    
            <body>
              <div style="position: relative;">
              <div id ='scatter'>
              </div>
              </div>
            <script>
                `+ scatter.scatter.toString() + `
                scatter(`+this.width.toString()+`,`+this.height.toString()+`,`+JSON.stringify(this.color)+`,`+this.title.toString()+`,`+this.delay.toString()+`,`+this.data+`,`+this.timeMode.toString()+`,${JSON.stringify(this.labelConfig)})
            </script>
            </body>
            `
            return dom
        }
    }
}
function object() { return new rtscatter() }
module.exports = { object }