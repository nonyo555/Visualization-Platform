const bubbleEm = require('./bubbleEmbeded')
class bubbleChart{
    constructor(){
        this.width = 800;
        this.height = 800;
        this.data = [{xCol:'123'}];
        this.labelConfig = {
                typeCol:'typeCol',
                labelCol:'labelCol',
                xCol:'xCol',
                yCol:'yCol',
                valueCol:'valueCol',};
        this.title = function (d) {
            return ` x: ${d[labelConfig.xCol]}  y: ${d[labelConfig.yCol]} value:${d[labelConfig.valueCol]} `}
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
    setTootip(config){
        if (Object.keys(config).includes('title')){
            if(typeof title == 'string' || typeof title =='function'){
                this.title = title
            }
            else 
                throw "Your tooltip text is wrong"
        }
    }
    setData(data) {
        this.data = data
    }
    setLabelConfig(config){
        let keys = Object.keys(config);
        if(keys.includes('typeCol')){
            this.labelConfig['typeCol'] = config['typeCol']
        }
        if(keys.includes('labelCol')){
            this.labelConfig['labelCol'] = config['labelCol']
        }
        if(keys.includes('xCol')){
            this.labelConfig['xCol'] = config['xCol']
        }
        if(keys.includes('yCol')){
            this.labelConfig['yCol'] = config['yCol']
        }
        if(keys.includes('valueCol')){
            this.labelConfig['valueCol'] = config['valueCol']
        }
    }
    setAttr(data, config) {
        let keys = Object.keys(config)
        if (keys.includes('width') && keys.includes('height')) {
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        this.setData(data)
        this.setLabelConfig(config)
        this.setTootip(config)
    }
    generateHTML(){
        var dom = `
        <head>
            <script src="https://d3js.org/d3.v5.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
            <script src="https://d3js.org/d3-color.v2.min.js"></script>
        </head>

        <body>
          <div id = 'bubbleChart' style = position:'relative'>
           
          </div>
        <script>
        var labelConfig = ${JSON.stringify(this.labelConfig)}
        ${bubbleEm.bubble.toString()}
        bubble(${JSON.stringify(this.data)},${this.width.toString()},${this.height.toString()},${this.title.toString()})
        </script>
        </body>
        `
        return dom
    }
}
function object() { return new bubbleChart() }
module.exports = { object }