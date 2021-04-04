
function scatter(screenWidth,screenHeight,color ,tooltip,delay,dataset,timemode,labelConfig){
    
    function httpGet(theUrl)
    {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
    }

    var Rainbowcolor =d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateRainbow);

    var data =[];
    if(typeof dataset == 'string'){
      data = JSON.parse( httpGet(dataset))
      window.setInterval( async function(){
        let rdata = await httpGet(dataset)
        // let  mdata = mergeJson(data,JSON.parse(rdata))
        //data = data.concat(JSON.parse(rdata))
        data = rdata
        render(data)
      }, delay)
    }
    else if(Array.isArray(dataset)){
      data  = dataset
    }
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const width = screenWidth - margin.left - margin.right;
      const height = screenHeight- margin.top - margin.bottom;

      const x = d3.scaleLinear()
        .range([0, width])
        .nice();
      
      const y = d3.scaleLinear()
        .range([height, 0]);

      const xAxis = d3.axisBottom(x).ticks(8).tickFormat(
        d=>{
          if(timemode){
            let domain = x.domain()
            let timelength = domain[1]-domain[0]
            //Years
            if (timelength >31536000*10){
              return  moment.unix(d).format('YYYY')
            }
            // Month
            else if(timelength >2678400*10)
              return  moment.unix(d).format('MMMM YYYY')
            // day  
            else if (timelength > 86400*10){
              return  moment.unix(d).format('DD MMMM')
            }
            else
              return moment.unix(d).format('LT')
          }
          else  
            return d
        }
      ),
        yAxis = d3.axisLeft(y).ticks(12 * height / width);
      
      const xAxis2 = d3.axisBottom(x).ticks(8),
        yAxis2 = d3.axisLeft(y).ticks(12 * height / width);
      
      var uniCollection = []
      const svg = d3.select("#scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      const legends = svg.append('g')
        .attr('id','legends')

      makeLegend(data)
      // ขอบนอก  
      const clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clipRect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

        if (timemode ==true){
          data.forEach( json=>{
            if (typeof json['x'] != 'number')
              json['x'] = moment(json['x']).unix()
          })
        }
        x.domain(d3.extent(data, d => d[labelConfig.x])).nice();
        y.domain(d3.extent(data, d => d[labelConfig.y])).nice();
        var curX =  x.domain()
        var curY = y.domain()
//////////////////////////////////////////////////////////////////////////////////////////////////////      
    //create scatter
      const scatter = svg.append("g")
           .attr("id", "scatterplot")
           .attr("clip-path", "url(#clip)");
      // ทำเป๋น  realtime
      scatter.selectAll(".dot")
          .data(data)
          .join("circle")
          .attr("class", "dot")
          .attr('id',d=>'type'+d[labelConfig.type].toString())
          .attr("r", 5)
          .attr("cx", d => x(d[labelConfig.x]))
          .attr("cy", d => y(d[labelConfig.y]))
          .attr("opacity", 0.8)
          .attr("fill", (d) => getColor(d[labelConfig.type]))
          .on('mouseover',tootipPos)
          .on('mouseout',tooltipDis)

      const tooltipBox =svg.append('g')
        .attr('id','tooltipBox')
      const tooltipText = tooltipBox.append('text')
        .attr('class','tooltipText')
        .attr('x',margin.top)
        .attr('y',margin.right)
        .style('font-size',15)
      tooltipBox.insert('rect')
        .attr('class','tooltip')
        .attr('width',50)
        .attr('height',50)
        .attr('x',margin.top)
        .attr('y',margin.right)
        .attr('fill','red')
        .attr('fill-opacity',0.2)
        .style('visibility','hidden')
        
      function strLongest(str){
        strList = str.split('\n')
        let max = 0;
        strList.forEach(str => {
            if (str.length > max){
                max = str.length
            }
        });
        return max
      }
      function tootipPos(d){
        let str = tooltip(d)
        let maxL = strLongest(str)
        let strList =  str.split('\n')
        tooltipBox.select('rect').attr('fill',d3.select(this).attr('fill'))
        tooltipText
        .attr('x',()=>{
                    if(x(d[labelConfig.x])+maxL*7+50 > margin.left+width){
                    return x(d.x)-(maxL*7)-5
                    }
                    else{
                    return x(d[labelConfig.x])+5
                    }
            })
          .attr('y',y(d[labelConfig.y]))
          .style('visibility','visible')

        tooltipBox.selectAll('tspan').remove()
          for(let i  =0 ; i < strList.length;i++){
              tooltipText.append('tspan')   
                  .text(strList[i])
                  .attr('x',tooltipText.attr('x'))
                  .attr('y',parseInt(tooltipText.attr('y'))+(i*15))
                  .style('font-size',15)
          }

        d3.select('.tooltip')
          .attr('x',()=>{
            if(x(d[labelConfig.x])+maxL*7+50 > margin.left+width){
                    return x(d.x)-(maxL*7)-5
                }
                else{
                    return x(d[labelConfig.x])+5
                }
          })
          .attr('height',()=>{
             return    (strList.length *15)+5

          })
          .attr('y',y(d[labelConfig.y])-15)
         .attr('width',maxL*7)
          .style('visibility','visible')
      }
      function tooltipDis(){
        d3.select('.tooltip')
         .style('visibility','hidden')
        tooltipText
          .style('visibility','hidden')
      }
      //


      makeGrid();
      
      //scale  แกน X
      svg.append("g")
         .attr("class", "x axis")
         .attr('id', "axis--x")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);
      
      //scale  แกน Y
      svg.append("g")
          .attr("class", "y axis")
          .attr('id', "axis--y")
          .call(yAxis)
      
      scatter.append('rect')

    //  makeLegend(data)
      function makeLegend(newdata){
        newdata.forEach(ele =>{
          if(!uniCollection.includes(ele[labelConfig.type])){
            uniCollection.push(ele[labelConfig.type])
          }
        })
        legends.selectAll('#legend')
        .data(uniCollection)
        .join('g')
          .on('click',clickLegned)
          .attr('id','legend' )
          .append('text')
          .style('font-size',10)
          .text(d=> d)
          .attr('x',width+20)
          .attr('y',(d,i)=>+20+(15*i))
          
        legends.selectAll('#legend')
          .data(uniCollection)
          .join('g')
            .attr('opacity',0.8)
            .append('circle')
            .style('r',5)
            .attr('cx',10+width)
            .attr('cy',(d,i)=>17.5+(15*i))
            .attr("fill", (d) => getColor(d))
      }
          
      function render(newdata){
      scatter.selectAll(".dot").data(newdata).enter().append("circle")
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", d =>{
            return x(d[labelConfig.x])
          })
          .attr("cy", d => {
            return y(d[labelConfig.y])
          })
          .attr('id',d=>'type'+d[labelConfig.type].toString())
          .attr("opacity", 0.8)
          .attr("fill", (d) => getColor(d[labelConfig.type]))
          .on('mouseover',tootipPos)
          .on('mouseout',tooltipDis)
          .transition()
          .duration(700)
          .tween("circle" ,(d)=>{
            var i = d3.interpolate( x(d[labelConfig.x]), x(d[labelConfig.x]));
            var j = d3.interpolate(0, y(d[labelConfig.y]));
            return function(t) {
              d3.select(this)
              .attr("cx" ,i(t))
              .attr("cy" ,j(t))
                };
              }
            )
        x.domain(d3.extent(data, d => d[labelConfig.x])).nice();
        y.domain(d3.extent(data, d => d[labelConfig.y])).nice();
        zoom()
        d3.select('#legends').selectAll('*').remove()
        makeLegend(newdata)
      }
      function makeGrid() {
        svg.append("g", '#scatterplot')
          .attr("class", "grid grid-x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis2
            .tickSize(-height)
            .tickFormat(''));
      
        svg.insert("g", '#scatterplot')
          .attr("class", "grid grid-y")
          .call(yAxis2
            .tickSize(-width)
            .tickFormat(''));
      
        svg.selectAll('.grid')
          .selectAll('line')
          .attr('stroke', 'lightgray');
      }

      function clickLegned(d){
        if (d3.select(this).attr('opacity')== 0.8){
          d3.select(this).attr('opacity',0.2)
          d3.selectAll('#type'+d.toString())
            .attr('opacity',0.2)
        }
        else{
          d3.select(this).attr('opacity',0.8)
          d3.selectAll('#type'+d.toString())
            .attr('opacity',0.8)
        }
      }

      function zoom() {
        const t = scatter.transition().duration(750);
        svg.select("#axis--x").transition(t).call(xAxis);
        svg.select(".grid-x")
            .transition(t)
            .call(xAxis2
              .tickSize(-height)
              .tickFormat(''))
            .selectAll('line')
            .attr('stroke', 'lightgray');
        
        svg.select("#axis--y").transition(t).call(yAxis);
        svg.select(".grid-y")
            .transition(t)
            .call(yAxis2
              .tickSize(-width)
              .tickFormat(''))
            .selectAll('line')
            .attr('stroke', 'lightgray');
      
        scatter.selectAll("circle")
          .transition(t)
          .attr("cx", d => x(d[labelConfig.x]))
          .attr("cy", d => y(d[labelConfig.y]));
      }

    const drag = d3.drag()
    .on("start",dragstarted)
    .on("drag", dragSc)

    d3.select('.domain').on('wheel',scroll)
    d3.select('.domain').call(drag)
    function scroll(d){
      let event = d3.event;
      let s = new Array(4) 
      s[0]= d3.event.x - 150
      s[1]= d3.event.y - 150 
      s[2]=d3.event.x + 150
      s[3]= d3.event.y+150
      if (event.deltaY == -100){
        x.domain([s[0], s[2]].map(x.invert, x));
        y.domain([s[3],s[1]].map(y.invert, y));
        zoom();
      }
      //scroll down
      else if(event.deltaY == 100){
      curX =  x.domain()
      curY = y.domain()
      let maxMinX =d3.extent(data, d => d[labelConfig.x])
      let maxminY =d3.extent(data, d => d[labelConfig.y])
      let lengthX =(maxMinX[1]-maxMinX[0])*5/100 |0
      let lengthY =(maxminY[1]-maxminY[0])*5/100 |0
      x.domain([curX[0]-lengthX, curX[1]+lengthX]);
      y.domain([curY[0]-lengthY, curY[1]+lengthY]);
      zoom()
      }
    } 
    var startDragXy ;
    function dragstarted(event) {
      startDragXy = [d3.event.x,d3.event.y]
    }
    function getColor(type){ 
      let lengthDomain = 100/uniCollection.length
      let index = uniCollection.indexOf(type)
      if (Object.keys(color).length ==0 || Object.keys(color).length > uniCollection.length)
        return Rainbowcolor(lengthDomain*index)
      else
        return  color[type]
    }
    function dragSc(){
      let curX =  x.domain()
      let curY = y.domain()
      let midX = x.invert(d3.event.x) - x.invert(startDragXy[0])
      let midY = y.invert(d3.event.y) - y.invert(startDragXy[1])
      x.domain([curX[0]- midX, curX[1]- midX]);
      y.domain([curY[0]-midY, curY[1]-midY]);
      zoom()
      startDragXy  = [d3.event.x,d3.event.y]
    }

    d3.select('.domain').attr('fill','white')
     .attr('fill-opactiy',0.0)
}
module.exports = {scatter}
        