
function chords(data){
    var width = 840
    var height = width
    var innerRadius = Math.min(width, height) * 0.5 - 20
    var outerRadius = innerRadius + 6
    //console.log(data)
    var names = Array.from(new Set(data.flatMap(d => [d.source, d.target])))
    const index = new Map(names.map((name, i) => [name, i]));
    const matrix = Array.from(index, () => new Array(names.length).fill(0));
    for (const {source, target, value} of data) matrix[index.get(source)][index.get(target)] += value;
    var chord = d3.chordDirected()
        .padAngle(12 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)
    //d3.select('svg').style('background-color','red')
   //d3.select('svg').style('position','relative')
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    var ribbon = d3.ribbonArrow()
        .radius(innerRadius - 0.5)
        .padAngle(1 / innerRadius)
    
    var formatValue = x => `${x.toFixed(0)}B`

    var color = d3.scaleOrdinal(names, d3.schemeCategory10)

    const svg = d3.select("svg")
    .style('width',width)
    .style('height',height)
    .style('position','fixed')
    .attr("viewBox", [-width / 1.8, -height / 1.8, width*1.2, height*1.2]);
    
    const chords = chord(matrix);

    //const textId = DOM.uid("text");

    svg.append("path")
    .attr("fill", "none")
    .attr("d", d3.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}))

    svg.append("g")
    .attr("fill-opacity", 0.75)
    .selectAll("g")
    .data(chords)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", d => color(names[d.target.index]))
    .style("mix-blend-mode", "multiply")
    .append("title")
    .text(d => `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(d.source.value)}`);

    svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g")
    .data(chords.groups)
    .join("g")
    .call(g => g.append("path")
    .attr("d", arc)
    .attr("fill", d => color(names[d.index]))
    .attr("stroke", "#fff"))
    .call(g => g.append("text")
            .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
            .attr("dy", '0.35em')
            // .attr("startOffset", d => d.startAngle * outerRadius)
            .attr("transform", d => `
                rotate(${(d.angle * 180 / Math.PI - 90)})
                translate(${outerRadius + 5})
                ${d.angle > Math.PI ? "rotate(180)" : ""}
                `)
            .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
             .text(d => names[d.index]))
    .call(g => g.append("title")
    .text(d => `${names[d.index]}
    owes ${formatValue(d3.sum(matrix[d.index]))}
    is owed ${formatValue(d3.sum(matrix, row => row[d.index]))}`));
    }
module.exports = { chords}