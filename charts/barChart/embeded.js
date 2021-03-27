function createForm() {
    var select = document.getElementById("order");
    const options = [
        { label: "Select Order", value: "select order" },
        { label: "Alphabetical", value: (a, b) => a.name.localeCompare(b.name) },
        { label: "Frequency, ascending", value: (a, b) => a.value - b.value },
        { label: "Frequency, descending", value: (a, b) => b.value - a.value }
    ];

    for (var i = 0; i < options.length; i++) {
        var opt = options[i]
        var el = document.createElement("option");
        el.textContent = opt.label;
        el.value = opt.value;
        select.appendChild(el);
    }
}

function barChart(data, color, width, height) {
    console.log("data:", data);
    console.log("color:", color);
    console.log("width:", width);
    console.log("height:", height);

    var margin = { top: 10, right: 30, bottom: 30, left: 60 };
    width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //var data = d3.csvParse(await FileAttachment("alphabet.csv").text(), ({letter, frequency}) => ({name: letter, value: +frequency}));

    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.value + "</span>";
        })
    svg.call(tip);

    const bar = svg.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .style("mix-blend-mode", "multiply")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth())
        .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    const gx = svg.append("g")
        .call(xAxis);

    const gy = svg.append("g")
        .call(yAxis);

    return Object.assign(svg.node(), {
        update(order) {
            if (order != "select order") {
                x.domain(data.sort(eval(order)).map(d => d.name));

                const t = svg.transition()
                    .duration(750);

                bar.data(data, d => d.name)
                    .order()
                    .transition(t)
                    .delay((d, i) => i * 20)
                    .attr("x", d => x(d.name));

                gx.transition(t)
                    .call(xAxis)
                    .selectAll(".tick")
                    .delay((d, i) => i * 20);
            }
        }
    });
}

module.exports = { barChart, createForm }