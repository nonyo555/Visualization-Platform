const d3 = require('d3');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
var data = {'root':'root',
            'children' : [{
            'name': 'New York',
             'children': [
               {'name':'orange','value':2020},
               {'name':'strawberry','value': 3547},
               {'name':'mango','value':1234},
               {'name':'banana','value':2587},
               {'name': 'coconut','value':1785}
             ],
            'color':'blue'
            },
            { 
            'name': 'London',
            'children': [
                {'name':'orange','value':4040},
                {'name':'strawberry','value': 7543},
                {'name':'mango','value':4321},
                {'name':'banana','value':2857},
                {'name':'coconut','value':1597},
            ],
            'color':'pink'
            }
        ]
    }
partition = data => {
        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        return d3.partition()(root);
      }
var dom = new JSDOM(`<svg width = '80' height='80'></svg>`)
var svg = d3.select(dom.window.document.querySelector("svg"))
            .attr("viewBox",[0,0,800,800])
            .style("font","10px sans-serif")

const g = svg.append("g")
        .attr("transform", `translate(400,400)`);
const root = partition(data);
const path = g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));
// root.each(function(d){
//     console.log(d)
//     console.log('///////////////')
// })
function barChart(){
    return svg.node()
}
console.log()