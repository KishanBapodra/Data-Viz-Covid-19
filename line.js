// set the dimensions and margins of the graph
const lineMargin = { top: 10, right: 30, bottom: 30, left: 100 },
  lineWidth = 550 - lineMargin.left - lineMargin.right,
  lineHeight = 360 - lineMargin.top - lineMargin.bottom;

function lineGraph(data) {

  d3.select(".lineSVG").remove();
  // append the svg object to the body of the page
  const lineSVG = d3.select("#line-viz")
    .append("svg")
    .attr("width", lineWidth + lineMargin.left + lineMargin.right)
    .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
    .attr("class", "lineSVG")
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);
  
  const timeStamps = data.map(d => d3.timeParse("%Y-%m-%d")(d.date));
  const domain = d3.extent(timeStamps);

  // filter the latest data out as it has bugs
  data = data.filter(d => d3.timeParse("%Y-%m-%d")(d.date) < d3.timeParse("%Y-%m-%d")("2023-03-06") )

  // Add X axis --> it is a date format (2020->2023)
  const x = d3.scaleTime()
    .domain(domain)
    .range([0, lineWidth]);
  lineSVG.append("g")
    .attr("transform", `translate(0, ${lineHeight})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.total_cases)])
      .range([lineHeight, 0]);
    lineSVG.append("g")
      .call(d3.axisLeft(y));

  // Draw the line
  const line = lineSVG.selectAll(".line")
    .data(d3.group(data, d => d.location))
    .join("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.3)
    .attr("d", d => d3.line()
      .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
      .y(d => y(+d.total_cases))
      (d[1])
    )
    .exit();
}
