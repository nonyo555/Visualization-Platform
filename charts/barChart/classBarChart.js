const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const bar = require('./embeded.js')

class BarChart {
    constructor(){
        this.width = 800;
        this.height = 500;
        this.data = [];
        this.color = "\"steelblue\"";
    }
    setWidth(width) {
        if (typeof width === 'number'){
            this.width = width;
        }
    }
    setHeight(height) {
        if (typeof height === 'number'){
            this.height = height;
        }
    }
    setColor(color){
        if(typeof color == 'string'){
            this.color = color;
        }
    }
    setData(data){
        if(data!=[])
            this.data = data;
    }
    setAttr(data,config){
        var keys = Object.keys(config)
        //if (key.includes = )
        if (keys.includes('width') && keys.includes('height') ){
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        if(keys.includes('color')){
            this.setColor(config.color);
        }
        //this.setLabel(config.templatelabel)
        this.setData(data);
    }
    getWidth() {
       return this.width
    }
    getHeight() {
        return this.height
    }
    getData(){
        return this.data
    }

    generateHTML(){
        var dom = new JSDOM(`
                </html><!DOCTYPE html>
                <html lang="en">
                <style>
                body {
                    font: 10px sans-serif;
                  }
                  
                  .bar:hover {
                    fill: orange ;
                  }
                  
                .d3-tip {
                    line-height: 1;
                    font-weight: bold;
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.8);
                    color: #fff;
                    border-radius: 2px;
                  }
                  
                  /* Creates a small triangle extender for the tooltip */
                  .d3-tip:after {
                    box-sizing: border-box;
                    display: inline;
                    font-size: 10px;
                    width: 100%;
                    line-height: 1;
                    color: rgba(0, 0, 0, 0.8);
                    content: "\\25BC";
                    position: absolute;
                    text-align: center;
                  }
                  
                  /* Style northward tooltips differently */
                  .d3-tip.n:after {
                    margin: -1px 0 0 0;
                    top: 100%;
                    left: 0;
                  }
                  </style>
                </style>
                <head>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                    <script src="https://d3js.org/d3.v5.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
                    <script src="https://d3js.org/d3-color.v2.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.min.js"></script>
                </head>
                <body>
                    <select id="order">
                    </select>
                    <div id=chart>
                    </div>
                <script>
                `+bar.createForm.toString()+`
                `+bar.barChart.toString()+`
                createForm();
                var bar = barChart(`+JSON.stringify(this.data)+`,`+this.color+`,`+this.width+`,`+this.height+`)
                $(document).ready(function() {
                    $("#order").change(function () {
                        var selected = $(this).val()
                        bar.update(selected);
                    })
                })
                </script>
                </body>
                </html>
        `)
        return dom.serialize()
    }
}
function object (){return  new BarChart();}
module.exports = {object}