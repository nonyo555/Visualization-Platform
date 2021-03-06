const { drag } = require("d3");

function chords(data){
    var width = 840
    var height = width
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
    
    var ribbon = d3.ribbonArrow()
        .radius(innerRadius - 0.5)
        .padAngle(1 / innerRadius)
    
    var formatValue = x => `${x.toFixed(0)}B`

    var color = d3.scaleOrdinal(names, d3.schemeCategory10)

    //div
    const div =d3.select('div')
        .style('width',width*1.1)
        .style('height',height*1.1)
    //gVertical.call(sliderVertical);

// When starting a drag gesture, move the subject to the top and mark it as active.
function dragstarted(event) {
  d3.select(this).raise()
  .attr("stroke", "red")
  .attr("stroke-opacity",0.5)
  .style("stroke-width", "8px")
}
var min = 0
var max = 1000
const lineW= 12
const radius = 20
const firHy = ((height*-0.476)+(radius/2))
const secHy = ((height*-0.476)+(height*0.95)-(radius/2))



divided= (max-min)/(((height*-0.476)+(height*0.95)-(radius/2))-((height*-0.476)+(radius/2)))
function dragged(event, d) {
  if (this.id == "firstHandle" ){
    if (d3.event.y < parseFloat(secH.attr('cy'))){
       firH.attr("cy",  d3.event.y);
    }
  else{
       firH.attr("cy",  secH.attr("cy")-1);
  }
  }
  else if (this.id == "secondHandle" ) {
    if (d3.event.y > parseFloat(firH.attr('cy'))){
      secH.attr("cy",  d3.event.y);
    }
    else{
      secH.attr("cy",   firH.attr("cy")+1);
 }
  }
  if (firH.attr('cy')<firHy){
    firH.attr("cy",   firHy);
  }
  else if (secH.attr('cy')>secHy){
    secH.attr("cy",   secHy);
  }

let maxV = parseInt(max- ((firH.attr('cy')-firHy)*divided)).toString()
let minV =  parseInt(((secHy-secH.attr('cy'))*divided)+min).toString()
//console.log(maxV+'-'+minV)
labelTop.text(maxV)
labelDown.text(minV)
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
        .attr('cy',firHy)
        .attr('r',radius)
        .attr('id','firstHandle')
        .attr('fill','red')
        .call(drag)
    const secH =  svg.append('circle')
        .attr('cx',(width *0.595)+(lineW/2))
        .attr('cy',secHy)
        .attr('r',radius)
        .attr('id','secondHandle')
        .attr('fill','red')
        .call(drag)
    const labelTop = svg
          .append('text')
          .attr('id','range')
          .attr('type','number')
          .attr('x',width *0.595+(lineW/2))
          .attr('y',firHy-30)
          .style("text-anchor", "middle")
          .style('font-size',20)
          .text (max.toString())
    const labelDown = svg
          .append('text')
          .attr('id','range')
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
    .attr("fill", d => color(names[d.target.index]))
    .style("mix-blend-mode", "multiply")
    .append("title")
    .text(d => `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(d.source.value)}`);
    
    svg.append("g")
    .attr('id','colorline')
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g")
    .data(chords.groups)
    .join("g")
    .call(g => g.append("path")
      .attr("d", arc)
      .attr('id','colorline')
      .each(d=> {d.clicked = false})
      .on('click',pathMouseClicked)
      .on('mouseover',pathMouseOver)
      .on('mouseout',pathMouseOut)
      .attr("fill", d =>  color(names[d.index]))
      .attr("stroke", d => color(names[d.index]))
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
       // .attr('id','colorline')
    .text(d => `${names[d.index]}
    owes ${formatValue(d3.sum(matrix[d.index]))}
    is owed ${formatValue(d3.sum(matrix, row => row[d.index]))}`));

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var oldPathValue =  d3.selectAll('#colorline').selectAll('path').data()
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function pathMouseOver (event,d){
    d3.select(this)
    .attr('stroke-width', 7)

  }
  function pathMouseClicked (event,index){
      //let sel =
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function render (){
      oldPathValue =  d3.selectAll('#colorline').selectAll('path').data()
      let maxV = parseInt(max- ((firH.attr('cy')-firHy)*divided))
      let minV =  parseInt(((secHy-secH.attr('cy'))*divided)+min)
      //test demomatrix
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
 // .attr('background-color','blue')  
 // svg.style('background-color','blue')  
 svg
 .selectAll("#ribbon").remove()   ;
//  console.log(chords)
//  console.log(newchords.groups)

  svg.select('g').selectAll("g")
  .data(newchords)
  .join("path")
  .attr('id','ribbon')
  .attr("d", ribbon)
  // .transition()
  // .duration(400)
  // .attrTween("d",d=> arcTween(d))
  .attr("fill", d => color(names[d.target.index]))
  .style("mix-blend-mode", "multiply")
  .append("title")
  .text(d => `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(d.source.value)}`);
  
 // d3.selectAll('#colorline').selectAll('*').remove()
 d3.selectAll('#colorline').selectAll('path').remove()

  svg.select("#colorline")
  .selectAll("g")
  .data(newchords.groups)
  .join("g")
  .call(g => g.append("path")
      .attr("d", arc)
      .each(d=> {d.clicked = false})
      .on('click',pathMouseClicked)
      .on('mouseover',pathMouseOver)
      .on('mouseout',pathMouseOut)
      .transition()
      .duration(700)
      .attrTween("d",d=> arcTween(d))
      .attr('id','colorline')
      .attr("fill", d =>  color(names[d.index]))
      .attr("stroke", d => color(names[d.index]))
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
  .text(d => `${names[d.index]}
  owes ${formatValue(d3.sum(matrix[d.index]))}
  is owed ${formatValue(d3.sum(matrix, row => row[d.index]))}`))
    }
    }
module.exports = { chords}