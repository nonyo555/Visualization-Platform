
function bubble(data,sWidth,sHeigth,titleText,color){

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = sWidth- margin.left - margin.right;
    const height = sHeigth- margin.top - margin.bottom;
    d3.select('#bubbleChart')
      .style('width',sWidth)
      .style('height',sHeigth)
    lengthX = d3.extent(data, d => parseInt(d[labelConfig.xCol]));
    ReserveLengthX =  (lengthX[1] - lengthX[0])*8/100 |0
    lengthX[0] -= ReserveLengthX
    lengthX[1] += ReserveLengthX
    lengthY = d3.extent(data, d => parseInt(d[labelConfig.yCol]));
    ReserveLengthY =  (lengthY[1] - lengthY[0])*8/100 |0
    lengthY[0] -= ReserveLengthY
    lengthY[1] += ReserveLengthY
    const x = d3.scaleLinear()
                 .domain(lengthX)
                .range([0, width]);
                          
    const y = d3.scaleLinear()
                .domain(lengthY)
                .range([height, 0])

    const r = d3.scaleLinear()
                .domain(d3.extent(data, d => parseInt(d[labelConfig.valueCol])))
                .range([ 4, 40]);

    const svg = d3.select("#bubbleChart").append('svg')
                .attr('width',sWidth)
                .attr('height',sHeigth)
                .attr('overflow','auto')
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const legends = svg.append('g')
                .attr('id','legends')
    const xAxis = d3.axisBottom(x).ticks(8)
    const yAxis = d3.axisLeft(y).ticks(8)
  var Rainbowcolor =d3.scaleSequential()
    .domain([0, 100])
    .interpolator(d3.interpolateRainbow);
  var uniCollection = []
  var labels = []

    
    //.attr("y", 0)
  
  // Add X axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add Y axis
  svg.append("g")
    .call(yAxis);
  //var color = {}
  function getColor(type){ 
      let lengthDomain = 100/uniCollection.length
      let index = uniCollection.indexOf(type)
      if (Object.keys(color).length ==0 || Object.keys(color).length > uniCollection.length)
        return Rainbowcolor(lengthDomain*index)
      else
        return  color[type]
  }
  makeLegend(data)

  
  function makeLegend(newdata){
    newdata.forEach(ele =>{
      if(!uniCollection.includes(ele[labelConfig.typeCol])){
        uniCollection.push(ele[labelConfig.typeCol])
      }
      if(!labels.includes(ele[labelConfig.labelCol])){
        labels.push(ele[labelConfig.labelCol])
      }
    })
    legends.selectAll('#legend')
    .data(uniCollection)
    .join('g')
      .on('click',clickLegend)
      .attr('id','legend' )
      .append('text')
      .style('font-family','monospace')
      .style('font-weight',800)
      .style('font-size',10)
      .text(d=> d)
      .attr('x',width -margin.right)
      .attr('y',(d,i)=>+20+(15*i))
      
    legends.selectAll('#legend')
      .data(uniCollection)
      .join('g')
        .attr('opacity',0.8)
        .append('circle')
        .style('r',5)
        .attr('cx',width -margin.right-20)
        .attr('cy',(d,i)=>17.5+(15*i))
        .attr("fill", (d) => getColor(d))
  }
  
  svg.append('g')
  .attr('class','gCircle')
  render(labels[0])
  // .selectAll("circle")
  // .data(data)
  // .enter()
  // .append("circle")
  //   .attr('id',d=>'type'+d.type.toString())
  //   .attr("cx", function (d) { return x(d.x); } )
  //   .attr("cy", function (d) { return y(d.y); } )
  //   .attr("r", function (d) { return r(d.value); } )
  //   .style("fill", function (d) { return getColor(d.type) } )
  //   .style("fill-opacity", "0.8")
  //   .attr("stroke", "white")
  //   .style("stroke-width", "2px")

  //  .on('mouseover',createTooltip)
  //////////////////////////////////////////////
  //button
  d3.select('#bubbleChart').append('div')
  .style('position','absolute')
  .style('width',sWidth)
  .style('text-align','center')
  .style('top','15px')
  //.style('width','100%')
  .selectAll("text")
  .data(labels)
  .enter()
  .append('button')
    .text(d=> {return d})
    .attr('class','labelBt')
    .attr('clicked',(d,i)=> { 
      if(i==0){
      return true
    }
      return false})
    .style('color',(d,i)=> { 
      if(i==0){
      return 'white'
    }
      return 'black'})
    .style('background-color',(d,i)=> { 
      if(i==0){
      return 'black'
    }
      return 'white'})
    .attr('id',(d,i)=>i)
    .style('font-family','monospace')
    .style('font-weight',800)
    .on('click',btClicked)
    .on('mouseover',btMOver)
    .on('mouseout',btMout)
    

  //legend
  function clickLegend(legend){
    if (d3.select(this).attr('opacity')== 0.8){
      d3.select(this).attr('opacity',0.2)
      d3.selectAll('#type'+legend.toString())
       .transition()
       .duration(500)
       .tween("circle" ,(d)=>{
        var i = d3.interpolate( r(d[labelConfig.valueCol]),0 );
        return function(t) {
          d3.select(this)
          .attr("r", i(t) )
            };
          }
        )
    }
    else{
      d3.select(this).attr('opacity',0.8)
      d3.selectAll('#type'+legend.toString())
      .transition()
      .duration(500)
      .tween("circle" ,(d)=>{
        var i = d3.interpolate( 0, r(d[labelConfig.valueCol]));
        return function(t) {
          d3.select(this)
          .attr("r", i(t) )
            };
          }
        )
    }
  }

function btClicked(){
  d3.selectAll('.labelBt')
      .style('color','black')
      .style('background-color','white')
      .attr('clicked',false);
  d3.select(this)
      .attr('clicked',true) 
      .style('color','white')
      .style('background-color','black')
 render(d3.select(this).text())
}
function btMOver(){
  d3.select(this)
    .style('color','black')
    .style('background-color','grey')
}
function btMout(){
  if (d3.select(this).attr('clicked') == 'false'){
    d3.select(this)
    .style('color','black')
    .style('background-color','white')
  }
  else {
    d3.select(this)
    .style('color','white')
    .style('background-color','black')
  }
  }
function render(selected){
  let filterD  = []
  data.forEach(json =>{
    if(json[labelConfig.labelCol] == selected){
      filterD.push(json)
    }
  })  

  d3.select('.gCircle').selectAll("circle").remove()
  d3.select('.gCircle').selectAll("circle")
  .data(filterD)
  .enter()
  .append("circle")
    .attr('id',d=>{return'type'+d[labelConfig.typeCol].toString()})
    .attr("cx", function (d) { return x(d[labelConfig.xCol]); } )
    .attr("cy", function (d) {  return y(d[labelConfig.yCol]); } )
    .style("fill", function (d) { return getColor(d[labelConfig.typeCol]) } )
    .style("fill-opacity", "0.8")
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .transition()
    .duration(500)
    .tween("circle" ,(d)=>{
      var i = d3.interpolate( 0, r(d[labelConfig.valueCol]));
      return function(t) {
        d3.select(this)
        .attr("r", i(t) )
          };
        }
      )
    d3.select('.gCircle').selectAll("circle")    
    .append('title')
        .text(titleText)
        
    d3.selectAll('g').selectAll('#legend').attr("opacity", "0.8")
}

}
    
module.exports = { bubble }