function  linepie(label,linedataset,piedataset,width,height,percenMode= 'false'){
d3.select('#divC')
  .style('width',width)
  .style('height',height*0.5)
  .style('display','inline-block')
var    margin = 40
var oldValue;
// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width*0.8, height*0.6) / 2 - margin
var arc =  d3.arc()
.innerRadius(radius*0.6)         // This is the size of the donut hole
.outerRadius(radius)
// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#pie")
  .style("width", (radius+10)*2)
  .style("height", (radius+10)*2)
 // .style('height',500)
  .style('position', 'relative')
  //.style('background-color','red')
  .append("svg")
  .style("width",(radius+10)*2)
  .style("height",(radius+10)*2)
    .style('position','absolute')
    .style('left',0)
  .append("g")
    .attr("transform", "translate(" +(radius+10)+ "," + (radius+10) + ")");

// Create dummy data
var data = {a: 9, b: 20, c:30, d:8, e:12}
//var data2 = {a: 0, b: 20, c:30, d:8, e:12}
var colorList = []
linedataset.forEach(json=>{

  colorList.push(json.borderColor)
})
// set the color scale 
//d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, Object.keys(data).length+1))

var color = d3.scaleOrdinal()
  .domain(data)
  .range(colorList)


// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; }).sort(null)
var data_ready = pie(d3.entries(piedataset))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d',arc)
  .on("click", render)
  .attr('fill', function(d){ 
    current = d
    return(color(d.data.key)) })
  .attr("stroke", "white")
  .style("stroke-width", "4px")
  .style("opacity", 0.7)
d3.select('g').append('g')
  .attr("pointer-events", "none")
  .attr("text-anchor", "middle")
  .style("user-select", "none")
  .selectAll("text")
  .data(data_ready)
  .join("text")
    .attr("dy", "0.35em")
    .attr("transform", d => {
      const x = ((radius-(radius*0.6))/2)+(radius*0.6)
      const y = radius*((((d.endAngle-d.startAngle)/2)+d.startAngle)/Math.PI);
     return  `rotate(${y - 90}) translate(${x},0) rotate(${-y+90}) `;
   })
    .text(d=>{
      if(d.value !=0){
        if(percenMode ==true){
          var sum =0
          var keys = Object.keys(piedataset)
          keys.forEach(key =>{
            sum += piedataset[key]
          })
          var  percen = (d.value/sum)*100
          return String(percen.toFixed(2))+'%'
        }
      return d.value
    }}
      )
function render(){
  //console.log(event)
  oldValue = d3.selectAll('path').data() ;
  data_ready2 = pie(d3.entries(piedataset))
  //console.log(oldValue)
  svg
    .selectAll('path')
    .data(data_ready2)
    .transition()
    .duration(400)
    .attrTween("d",d=> arcTween(d))
  svg
    .selectAll('path')
    .data(data_ready2)
    .enter()
    .append('path')
    .attr('d',arc)
    .on("click", render)
    .attr('fill', function(d){ 
      current = d
      return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    
  d3.selectAll("text")
      .data(data_ready2)
      .join("text")
        .attr("dy", "0.35em")
        .attr("transform", d => {
           const x = ((radius-(radius*0.6))/2)+(radius*0.6)
           const y = radius*((((d.endAngle-d.startAngle)/2)+d.startAngle)/Math.PI);
          return  `rotate(${y - 90}) translate(${x},0) rotate(${-y+90}) `;
        })
        .text(d=>{
          if(d.value !=0){
            if(percenMode ==true){
              var sum =0
              var keys = Object.keys(piedataset)
              keys.forEach(key =>{
                sum += piedataset[key]
              })
              var  percen = (d.value/sum)*100
              return String(percen.toFixed(2))+'%'
            }
          return d.value
        }}
          );
  svg.selectAll("whatever")
    .data(data_ready2).exit().remove();
  parentCH = -1
}
function arcTween(d) {
  var i = d3.interpolate(parentCH,d);
  var interpolateStart = d3.interpolate(oldValue[d.index].startAngle, d.startAngle);
  var interpolateEnd = d3.interpolate(oldValue[d.index].endAngle, d.endAngle);
  return function(t) {
    return arc({
      startAngle: interpolateStart(t),
      endAngle: interpolateEnd(t),
    });
}
}

var chartx;
var inputs = {
  min: -100,
  max: 100,
  count: 8,
  decimals: 2,
  continuity: 1
};
var options = {
  maintainAspectRatio: false,
  spanGaps: false,
  elements: {
    line: {
      tension: 0.000001
    }
  },
  plugins: {
    filler: {
      propagate: false
    }
  },
  scales: {
    xAxes: [{
      ticks: {
        autoSkip: false,
        maxRotation: 0
      }
    }]
  }
};
var ch= d3.rgb("red")
ch.opacity = 0.5
window.onload = function() {
  // reset the random seed to generate the same data for all charts
        var ctx = document.getElementById('canvas').getContext('2d');
    window.chart = new Chart(ctx, {
    type: 'line',
    trueData: JSON.parse(JSON.stringify(piedataset)),
    data: {
      labels: label,
      datasets: linedataset
    },
    options:  {
      title: {
        text: 'fill: ' + 'start',
        display: true
                },
                legend:{
                    position: 'left',
                    onClick:function(t,e){
                      window.chart.data.datasets.forEach(ele => {
                        if(ele.label  ==  e.text){
                          if ( piedataset[e.text] ==0){
                            piedataset[e.text]  = window.chart.config.trueData[e.text]
                             //console.log(data2.copy())
                           }
                           else{
                            piedataset[e.text] = 0
                           }
                           return
                        }
                      });
                      
                     
                      render()
                      var n=e.datasetIndex,i=this.chart,a=i.getDatasetMeta(n);
                      a.hidden=null===a.hidden?!i.data.datasets[n].hidden:null,i.update(200)}
                }
    }
  });
}

}
module.exports = {linepie}