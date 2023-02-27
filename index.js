// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 100 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#line-graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

  function lineGraph(data) {

    const timeStamps = data.map(d => d3.timeParse("%Y-%m-%d")(d.date));
    const domain = d3.extent(timeStamps);

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(domain)
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d.total_cases)])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // color palette
    const color = d3.scaleOrdinal()
      .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

    // Draw the line
    const line = svg.selectAll(".line")
      .data(d3.group(data, d => d.location))
      .join("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 1.5)
      .attr("d", d => d3.line()
        .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .y(d => y(+d.total_cases))
        (d[1])
      )
  }

  const lineGraphData = data.filter(d => ['United States', 'India', 'Germany'].includes(d.location))
  lineGraph(lineGraphData)
})