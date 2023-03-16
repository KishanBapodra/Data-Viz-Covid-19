// Dimensions of graph
const lineMargin = { top: 35, right: 30, bottom: 80, left: 80 };
const lineWidth = 620 - lineMargin.left - lineMargin.right;
const lineHeight = 400 - lineMargin.top - lineMargin.bottom;

function lineGraph(data) {
  d3.select(".line-svg").remove();
  
  // append the svg object to the body of the page using line-viz ID.
  const lineSvg = d3
    .select("#line-viz")
    .append("svg")
    .attr("width", lineWidth + lineMargin.left + lineMargin.right)
    .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
    .attr("class", "line-svg")
    .attr("stroke", "#98C1D9")
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);
  
    
  const timeStamps = data.map(d => d3.timeParse("%Y-%m-%d")(d.date));
  const domain = d3.extent(timeStamps);

  // filter the latest data out as it has bugs
  data = data.filter(d => d3.timeParse("%Y-%m-%d")(d.date) < d3.timeParse("%Y-%m-%d")("2023-03-06"));

  const x = d3.scaleTime().domain(domain).range([0, lineWidth]);

  // add extra 10% at the top
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.total_cases+d.total_cases*0.1)])
    .range([lineHeight, 0]);

  // add axis and label
  // x-axis
  lineSvg
    .append("g")
    .attr("transform", `translate(0, ${lineHeight})`)
    .call(d3.axisBottom(x))
    .call(g => g.append("text")
        .attr("x", lineWidth)
        .attr("y", lineMargin.bottom - 50)
        .attr("fill", "#98C1D9")
        .attr("text-anchor", "end")
        .text("Timeline →"));

  // y-axis
  lineSvg.append("g")
    .call(d3.axisLeft(y))
    .call(g => g.append("text")
    .attr("x", -lineMargin.left)
    .attr("y", -15)
    .attr("fill", "#98C1D9")
    .attr("text-anchor", "start")
    .text("↑ Total Covid-19 Cases"));

  // get data and create line
  const line = lineSvg
    .selectAll(".line")
    .data(d3.group(data, d => d.location))
    .join("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("d", d => { return d3.line()
      .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
      .y(d => y(+d.total_cases))
      (d[1])
    })
    .transition() // animate line
    .duration(1500) // animation duration
    .ease(d3.easeSin) 
    .attrTween("stroke-dasharray", function() {
      const len = this.getTotalLength();
      return function(t) {
        return d3.interpolateString(`0,${len}`, `${len},${len}`)(t);
      };
  });

  lineSvg.append('text')
    .attr("x", lineWidth/2)
    .attr("y", lineHeight + 60)
    .attr("text-anchor", "middle")
    .style("font-size", "0.75em")
    .style("fill", "black") 
    .text(() => {
      return "Growth of Covid-19 overtime: " + data[0].location;
    })
    .exit();
}