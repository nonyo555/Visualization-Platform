
function scatter(){
  //Set up
    const makeRandomData = (nb) => {
        const res = [];
        for (i = 0; i < nb; i++) {
          res.push({
            x: Math.random() * 100 | 0,
            y: Math.random() * 100 | 0,
            index: Math.random() * 8 | 0,
          });
        }
        return res;
      };

    function httpGet(theUrl)
    {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
    }
    var rdata ;

      const data = makeRandomData(104);
      const color = d3.schemeCategory10;

      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const width = 480 - margin.left - margin.right;
      const height = 480 - margin.top - margin.bottom;
      var domainRange = [0,100]

      const x = d3.scaleLinear()
        .range([0, width])
        .nice();
        
      const y = d3.scaleLinear()
        .range([height, 0]);

      const xAxis = d3.axisBottom(x).ticks(12),
        yAxis = d3.axisLeft(y).ticks(12 * height / width);
      
      const xAxis2 = d3.axisBottom(x).ticks(12),
        yAxis2 = d3.axisLeft(y).ticks(12 * height / width);
      
      // const brush = d3.brush()
      //   .extent([[0, 0], [width, height]])
      //  .on("end", brushended);
      // const zoom = d3.zoom()
      // .scaleExtent([1, 5])
      // .translateExtent([[0, 0], [width, height]])
      // .on("zoom", () => {console.log('hello')});

      // let idleTimeout,
      //   idleDelay = 350;
      
      const svg = d3.select("#scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      // ขอบนอก  
      const clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clipRect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

      x.domain(d3.extent(data, d => d.x)).nice();
      y.domain(d3.extent(data, d => d.y)).nice();
//////////////////////////////////////////////////////////////////////////////////////////////////////      
    //create scatter
      const scatter = svg.append("g")
           .attr("id", "scatterplot")
           .attr("clip-path", "url(#clip)");
      // ทำเป๋น  realtime
      scatter.selectAll(".dot")
          .data(data)
        //.enter()//.append('g')
          .join("circle")
          .attr("class", "dot")
          .attr('id',d=>'type'+d.index.toString())
          .attr("r", 5)
          .attr("cx", d => x(d.x))
          .attr("cy", d => y(d.y))
          .attr("opacity", 0.6)
          .attr("fill", (d) => color[d.index % 9])
          .on('mouseover',tootipPos)
          .on('mouseout',tooltipDis)

         // .exit();
      // scatter.selectAll('g')
      //       .append('rect')
      //       .attr('width',50)
      //       .attr('height',50)
      //       .attr('x',d=> x(d.x))
      //       .attr('y',d=> y(d.y))
      //       .attr('fill','red')
      //       .attr('fill-opacity',0.2);

      // scatter.selectAll('g')
      //       .append('text')
      //       .attr('x',d=> x(d.x)-10)
      //       .attr('y',d=> y(d.y)-10)
      //       .text('Hellooooooo')    

      const tooltipBox =svg.append('g')
        .attr('id','tooltipBox')
      const tooltipText = tooltipBox.append('text')
        .attr('class','tooltipText')
        .attr('x',margin.top)
        .attr('y',margin.right)
        //.text('hello')
        .style('font-size',15)
        //.attr('fill-opacity',0.2);
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
        let str = JSON.stringify(d)//' hello \n wolrd \n aunaun'
        let maxL = strLongest(str)
        let strList =  str.split('\n')
        tooltipText
        .attr('x',()=>{
                    if(x(d.x)+maxL*7+50 > margin.left+width+margin.right){
                    return x(d.x)-(tooltipBox.text().length*7)-5
                    }
                    else{
                    return x(d.x)+5
                    }
            })
          .attr('y',y(d.y))
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
            if(x(d.x)+maxL*7+50 > margin.left+width+margin.right){
                    return x(d.x)-(tooltipBox.text().length*7)-5
                }
                else{
                    return x(d.x)+5
                }
          })
          .attr('height',()=>{
             return    (strList.length *15)+5

          })
          .attr('y',y(d.y)-15)
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
      
      // svg.append("text")
      //   .style("text-anchor", "end")
      //   .attr("x", width - 4)
      //   .attr("y", height - 8)
      //   .text("X axis");

      //scale  แกน Y
      svg.append("g")
          .attr("class", "y axis")
          .attr('id', "axis--y")
          .call(yAxis);
      // svg.append("text")
      //     .attr("transform", "rotate(-90)")
      //     .attr("x", -5)
      //     .attr("y", 4)
      //     .attr("dy", "1em")
      //     .style("text-anchor", "end")
      //     .text("Y axis");
      
      //  scatter.append("g")
      //      .attr("class", "brush")
      //      .call(zoom);
      
      // function brushended() {
      //   const s = d3.event.selection;
      //   console.log(s)
      //   if (!s) {
      //       if (!idleTimeout) {
      //         return idleTimeout = setTimeout(() => {
      //           idleTimeout = null;
      //         }, idleDelay);
      //       }
      //       x.domain(d3.extent(data, d => d.x)).nice();
      //       y.domain(d3.extent(data, d => d.y)).nice();
      //   } else {
      //       x.domain([s[0][0], s[1][0]].map(x.invert, x));
      //       y.domain([s[1][1], s[0][1]].map(y.invert, y));
      //       scatter.select(".brush").call(brush.move, null);
      //   }
      //   zoom();
      // }

      scatter.append('rect')
      window.setInterval( async function(){
        rdata = await httpGet('http://localhost/random')
        render(JSON.parse(rdata))
    }, 5000)
    // Promise.delay(5000).then(() => {
    //   rdata = httpGet('http://localhost/random')
    //   render(JSON.parse(rdata))
    // });
    var uniCollection = []
      const legends = svg.append('g')
        .attr('id','legends')

      makeLegend(data)
      function makeLegend(newdata){
        newdata.forEach(ele =>{
          if(!uniCollection.includes(ele.index)){
            uniCollection.push(ele.index)
          //  console.log(uniCollection)
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
            .attr('id',d=>'type'+d.toString())
            .append('circle')
            .style('r',5)
            .attr('cx',10+width)
            .attr('fill',0.6)
            .attr('cy',(d,i)=>17.5+(15*i))
            .attr("fill", (d) => color[d % 9])
        
      }
          
      function render(newdata){
      let scat = d3.select("g#scatterplot");
      scatter.selectAll('circle').remove()
      //console.log( scat.selectAll('*'))
      
      scatter.selectAll(".dot").data(newdata).join("circle")
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", d =>{
           // console.log(d)
            return x(d.x)
          })
          .attr("cy", d => {
            return y(d.y)
          })
          .attr('id',d=>'type'+d.index.toString())
          .attr("opacity", 0.6)
          .attr("fill", (d) => color[d.index % 9])
          .on('mouseover',tootipPos)
          .on('mouseout',tooltipDis)
          .transition()
          .duration(700)
          .tween("circle" ,(d)=>{
            var i = d3.interpolate(0, x(d.x));
            var j = d3.interpolate(0, y(d.y));
            return function(t) {
              d3.select(this)
              .attr("cx" ,i(t))
              .attr("cy" ,j(t))
                };
              }
            )
        x.domain(d3.extent(newdata, d => d.x)).nice();
        y.domain(d3.extent(newdata, d => d.y)).nice();
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
        d3.selectAll('#type'+d.toString())
        .attr('opacity',d=>{
          if( d3.select(this).attr('opacity') == 0.2){
            return 0.6
          }
          else 
          return 0.2})
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
          .attr("cx", d => x(d.x))
          .attr("cy", d => y(d.y));
      }
    //   const zoom = d3.zoom()
    //   .scaleExtent([1, 5])
    //   .translateExtent([[0, 0], [width, height]])
    //   .on("zoom", () => { zoomed(d3.event.transform); });
      
    //   scatter.append('g')
    //   .attr('id','zoomed')
    //   .call(zoom);

    //  clip.on('dblclick.zoom', () => {
    //     zoomed(d3.zoomTransform({x: 0, y: 0, k: 1}))
    //   });
    const drag = d3.drag()
    .on("start",dragstarted)
    .on("drag", dragSc)
  //  .on("end",dragEnd)
    //   function zoomed() {
    //     console.log('yes')
    //   }
    // clip.call(drag)

    // const zoom = d3.zoom()
    // .scaleExtent([1, 5])
    // .translateExtent([[0, 0], [width, height]])
    // .on("zoom", () => {console.log('hello')});

    d3.select('.domain').on('wheel',scroll)
    d3.select('.domain').call(drag)
    function scroll(d){
      let event = d3.event;
      let s = new Array(4) 
      s[0]= d3.event.x - 150//190 //sx1
      s[1]= d3.event.y - 150  //y1
      s[2]=d3.event.x + 150//258  //x2
      s[3]= d3.event.y+150//330   //y2
      if (event.deltaY == -100){
        x.domain([s[0], s[2]].map(x.invert, x));
        y.domain([s[3],s[1]].map(y.invert, y));
        zoom();
      }
      //scroll down
      else if(event.deltaY == 100){
      let curX =  x.domain()
      let curY = y.domain()
      x.domain([curX[0]-15, curX[1]+15]);
      y.domain([curY[0]-15, curY[1]+15]);
      zoom()
      }
    }
    var startDragXy ;
    function dragstarted(event) {
      startDragXy = [d3.event.x,d3.event.y]
      //console.log(startDragXy)
    }
    function dragSc(event){
      let curX =  x.domain()
      let curY = y.domain()
      let midX = x.invert(d3.event.x) - x.invert(startDragXy[0])
      let midY = y.invert(d3.event.y) - y.invert(startDragXy[1])
    //s  console.log([midX,midY])
      x.domain([curX[0]- midX, curX[1]- midX]);
      y.domain([curY[0]-midY, curY[1]-midY]);
      zoom()
      startDragXy  = [d3.event.x,d3.event.y]
    }

    // cannot detect if not have color (wtf!!!!!!!)
    d3.select('.domain').attr('fill','white')
     .attr('fill-opactiy',0.0)
}
module.exports = {scatter}
        