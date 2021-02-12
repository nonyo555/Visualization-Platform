
const scatter = require('./scatterEmbeded')
class rtscatter{
    constructor(){

    }
    generateHTML(){
        {
            var dom = `
    
            <head>
                <script src="https://d3js.org/d3.v5.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
                <script src="https://d3js.org/d3-color.v2.min.js"></script>
                <script src ="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js"></script>
            </head>
    
            <body>
              <div style="position: relative;">
              <div id ='scatter'>
              </div>
              </div>
            <script>
                `+ scatter.scatter.toString() + `
                scatter()
            </script>
            </body>
            `
            return dom
        }
    }
}
function object() { return new rtscatter() }
module.exports = { object }