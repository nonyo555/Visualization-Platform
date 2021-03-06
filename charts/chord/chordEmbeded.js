const { drag } = require("d3");

function chords(data,width,height,ribbons,paths,jsonColor){
    var innerRadius = Math.min(width, height) * 0.5 - 20
    var outerRadius = innerRadius + 6
    var names = Array.from(new Set(data.flatMap(d => [d.source, d.target])))
    const index = new Map(names.map((name, i) => [name, i]));
    var matrix = Array.from(index, () => new Array(names.length).fill(0));
    for (const {source, target, value} of data) matrix[index.get(source)][index.get(target)] += value;
    var chord = d3.chordDirected()
        .padAngle(12 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
      //  .headRadius(5)
    
    var ribbon = d3.ribbonArrow()
        .radius(innerRadius - 0.5)
        .padAngle(1 / innerRadius)
        .headRadius(20)

        
    var color = d3.scaleOrdinal(names, d3.schemeCategory10)

    const div =d3.select('div')
        .style('width',width*1.1)
        .style('height',height*1.1)

function dragstarted(event) {
  d3.select(this).raise()
  .attr("stroke", "red")
  .attr("stroke-opacity",0.5)
  .style("stroke-width", "8px")
}
var maxRow = matrix.map(function(row){ return Math.max.apply(Math, row); });
var minRow = matrix.map(function(row){ return Math.min.apply(Math, row); });
var max = Math.max.apply(null, maxRow);
var min = Math.min.apply(null, minRow);
const lineW= 12
const radius = 20
const firHy = ((height*-0.476)+(radius/2))
const secHy = ((height*-0.476)+(height*0.95)-(radius/2))


var  linearDomain = d3.scaleLinear().range([min,max]).domain([secHy,firHy])
function dragged(event, d) {
  if (d3.select(this).attr("class")  == "firstHandle" ){
    if (d3.event.y < parseFloat(secH.attr('cy'))){
       firH.attr("cy",  d3.event.y);
    }
  else{
       firH.attr("cy",  secH.attr("cy"));
  }
  }
  else if (d3.select(this).attr("class")  == "secondHandle" ) {
    if (d3.event.y > parseFloat(firH.attr('cy'))){
      secH.attr("cy",  d3.event.y);
    }
    else{
      secH.attr("cy",   firH.attr("cy"));
  }
  }
  if (firH.attr('cy')<firHy){
    firH.attr("cy",   firHy);
  }
  else if (secH.attr('cy')>secHy){
    secH.attr("cy",   secHy);
  }
  labelTop.text(linearDomain(firH.attr("cy"))|0)
  labelDown.text(linearDomain(secH.attr("cy"))|0)
}

function arcTween(d) {
  let interpolateStart = d3.interpolate(oldPathValue[d.index].startAngle, d.startAngle);
  let interpolateEnd = d3.interpolate(oldPathValue[d.index].endAngle, d.endAngle);
  return function(t) {
    return arc({
      startAngle: interpolateStart(t),
      endAngle: interpolateEnd(t),
    });
}
}


function dragended(event, d) {
  d3.select(this).attr("stroke", null);
  render()
}
drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
    // input range
    d3.select('input')
        .style('position','absolute')
        .style('right','0px')

    const svg = d3.select("#graph")
        .style('width',width)
        .style('height',height)
        .style('position','fixed')

  
        .attr("viewBox", [-width / 1.8, -height / 1.8, width*1.2, height*1.2]);
    const chords = chord(matrix);
    
    const line = svg.append('rect')
            .style('width',lineW)
            .style('height',height*0.95)
            .attr('x',width *0.595)
            .attr('y',height*-0.476)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr('fill','red')
            .attr('fill-opacity',0.5)
    const firH =  svg.append('circle')
        .attr('cx',(width *0.595)+(lineW/2))
        .attr('cursor','pointer')
        .attr('cy',firHy)
        .attr('r',radius)
        .attr('class','firstHandle')
        .attr('fill','red')
        .call(drag)
    const secH =  svg.append('circle')
        .attr('cx',(width *0.595)+(lineW/2))
        .attr('cursor','pointer')
        .attr('cy',secHy)
        .attr('r',radius)
        .attr('class','secondHandle')
        .attr('fill','red')
        .call(drag)
    const labelTop = svg
          .append('text')
          .attr('id','firstHandle')
          .attr('type','number')
          .attr('x',width *0.595+(lineW/2))
          .attr('y',firHy-30)
          .style("text-anchor", "middle")
          .style("font-style","Serif")
          .style('font-size',20)
          .text (max.toString())
    const labelDown = svg
          .append('text')
          .attr('id','secondHandle')
          .attr('type','number')
          .attr('x',width *0.595+(lineW/2))
          .attr('y',secHy +40)
          .style('font-size',20)
          .style("text-anchor", "middle")
          .text (min.toString())


    svg.append("path")
        .attr("fill", "none")
        .attr("d", d3.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}))

    svg.append("g")
    .attr("fill-opacity", 0.75)
    .selectAll("g")
    .data(chords)
    .join("path")
    .attr('id','ribbon')
    .attr("d", ribbon)
    .attr("fill", d => {
      if(Object.keys(jsonColor).includes(names[d.target.index])){
        return jsonColor[names[d.target.index]]
      }
      return color(names[d.target.index])})
    .style("mix-blend-mode", "multiply")
    .append("title")
    .text(ribbons);

    
    svg.append("g")
    .attr('id','colorline')
    .attr("font-family", "bold serif")
    .attr("font-weight",900)
    .attr("font-size", () =>{
      if(parseInt(width/56<12)){
        return 12
      }
      else if(parseInt(width/56>25)){
        return 25
      }
      return parseInt(width/56>25 )

     }) 
    .selectAll("g")
    .data(chords.groups)
    .join("g")
    .call(g => g.append("path")
      .attr("d", arc)
      .attr('id','colorline')
      .attr('cursor','pointer')
      .each(d=> {d.clicked = false})
      .on('click',pathMouseClicked)
      .on('mouseover',pathMouseOver)
      .on('mouseout',pathMouseOut)
      .attr("fill", d => {
        if(Object.keys(jsonColor).includes(names[d.index])){
          return jsonColor[names[d.index]]
        }
        return color(names[d.index])})
      .attr("stroke", d => {
        if(Object.keys(jsonColor).includes(names[d.index])){
          return jsonColor[names[d.index]]
        }
        return color(names[d.index])})
      .attr('stroke-width', 3))
      .call(g => g.append("text")
                .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
                .attr("dy", '0.35em')
                .attr('id',d=>names[d.index])
                .attr("transform", d => `
                    rotate(${(d.angle * 180 / Math.PI - 90)})
                    translate(${outerRadius + 5})
                    ${d.angle > Math.PI ? "rotate(180)" : ""}
                    `)
                .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
                .text(d => names[d.index]))
        .call(g => g.append("title")
        .text(paths));

  var oldPathValue =  d3.selectAll('#colorline').selectAll('path').data()

  function pathMouseOver (event,d){
    d3.select(this)
    .attr('stroke-width', 7)

  }
  function pathMouseClicked (event,index){
      svg.selectAll('path')
        .attr("fill-opacity", 0.3)
      d3.select(this)
        .attr("fill-opacity", 1)
      allRib = d3.selectAll('#ribbon')
      let chCliked = d3.select(this).data()[0].clicked
      if(chCliked == false){
        allRib.each((d,i)=>{
              if (d.source.index == index ||d.target.index == index ){ 
                d3.select(allRib._groups[0][i])
                    .attr("fill-opacity", 0.75)
              }
        })
        d3.select(this).data()[0].clicked = true
      }
      else{
        d3.selectAll('#ribbon').attr("fill-opacity", 0.75)
        d3.selectAll("#colorline").selectAll('path').attr('fill-opacity',1)
        d3.select(this).data()[0].clicked = false
      }
      
  }
  function pathMouseOut(){
      d3.select(this)
        .attr('stroke-width', 3)
  }

  function render (){
      
      oldPathValue =  d3.selectAll('#colorline').selectAll('path').data()
      let maxV = linearDomain(firH.attr("cy"))|0
      let minV =  linearDomain(secH.attr("cy"))|0
      var demomatrix =   Array.from(index, () => new Array(names.length).fill(0));
      for (const {source, target, value} of data) demomatrix[index.get(source)][index.get(target)] += value;
      for(let i =0;i<demomatrix.length;i++){
        for(let j=0 ; j < demomatrix[i].length;j++){
            if(demomatrix[i][j] < minV || demomatrix[i][j] > maxV){
              demomatrix[i][j] = 0
            }
        }
      }
  let newchords = chord(demomatrix.slice())
  svg.select("path")
  .attr("fill", "none")
  .attr("d", d3.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}))

 svg
 .selectAll("#ribbon").remove()   ;


  svg.select('g').selectAll("g")
  .data(newchords)
  .join("path")
  .attr('id','ribbon')
  .attr("d", ribbon)

  .attr("fill", d => {
    if(Object.keys(jsonColor).includes(names[d.target.index])){
      return jsonColor[names[d.target.index]]
    }
    return color(names[d.target.index])})
  .style("mix-blend-mode", "multiply")
  .append("title")
  .text(ribbons);
 d3.selectAll('#colorline').selectAll('path').remove()
 d3.selectAll('#colorline').selectAll('title').remove()

  svg.select("#colorline")
  .selectAll("g")
  .data(newchords.groups)
  .join("g")
  .call(g => g.append("path")
      .attr("d", arc)
      .attr('cursor','pointer')
      .each(d=> {d.clicked = false})
      .on('click',pathMouseClicked)
      .on('mouseover',pathMouseOver)
      .on('mouseout',pathMouseOut)
      .transition()
      .duration(700)
      .attrTween("d",d=> arcTween(d))
      .attr('id','colorline')
      .attr("fill", d =>  {
        if(Object.keys(jsonColor).includes(names[d.index])){
          return jsonColor[names[d.index]]
        }
        return color(names[d.index])})
      .attr("stroke", d =>{
        if(Object.keys(jsonColor).includes(names[d.index])){
          return jsonColor[names[d.index]]
        }
        return color(names[d.index])})
      .attr('stroke-width', 3)
      )
      .each(async n=>{
              d3.select(document.getElementById(names[n.index]))
              .each(d =>{ 
                (d.newangle = (n.startAngle + n.endAngle) / 2)
              })
              .transition()
              .duration(700)
              .tween("text", function(d) {
                var i = d3.interpolate(d.angle, d.newangle);
                var rotate =d3.interpolate(0, 180);
                d.angle = d.newangle
                d3.select(document.getElementById(names[n.index]))
                .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
                return function(t) {
                  d3.select(this).attr("transform", d => `
                  rotate(${(i(t) * 180 / Math.PI - 90)})
                  translate(${outerRadius + 5})
                  ${d.newangle > Math.PI    ? `rotate(180)` : ""}  `)
                    };
                  }
                )
      })
      .call(g => g.append("title")
      .attr('id','colorline')
      .text(paths));
    }
    }
module.exports = { chords}