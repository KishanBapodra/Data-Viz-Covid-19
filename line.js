// set the dimensions and margins of the graph
const lineMargin = { top: 10, right: 30, bottom: 30, left: 100 },
  lineWidth = 500 - lineMargin.left - lineMargin.right,
  lineHeight = 400 - lineMargin.top - lineMargin.bottom;

// Read the data
// d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

  function lineGraph(data) {

    d3.select(".lineSVG").remove();
    // append the svg object to the body of the page
    const lineSVG = d3.select("#line-graph")
      .append("svg")
      .attr("width", lineWidth + lineMargin.left + lineMargin.right)
      .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
      .attr("class", "lineSVG")
      .append("g")
      .attr("stroke", "white")
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
      .attr("stroke", "white")
      .attr("stroke-width", 1.3)
      .attr("d", d => d3.line()
        .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .y(d => y(+d.total_cases))
        (d[1])
      )
      .exit();
  }

  // const lineGraphData = data.filter(d => ['Fiji'].includes(d.location))
  // console.log(lineGraphData);
  // lineGraph(lineGraphData);

// })

// function singleLineGraph(data) {
  
//   // set the dimensions and margins of the graph
//   const lineMargin = { top: 10, right: 30, bottom: 30, left: 100 },
//   lineWidth = 460 - lineMargin.left - lineMargin.right,
//   lineHeight = 400 - lineMargin.top - lineMargin.bottom;

  // append the svg object to the body of the page
//   const lineSvg = d3.select("#line-graph")
//     .append("svg")
//     .attr("width", lineWidth + lineMargin.left + lineMargin.right)
//     .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
//     .append("g")
//     .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

//   const timeStamps = data.map(d => d3.timeParse("%Y-%m-%d")(d.date));
//   const domain = d3.extent(timeStamps);

//   // Add X axis --> it is a date format
//   const x = d3.scaleTime()
//     .domain(domain)
//     .range([0, lineWidth]);
//   lineSvg.append("g")
//     .attr("transform", `translate(0, ${lineHeight})`)
//     .call(d3.axisBottom(x).ticks(5));

//   // Add Y axis
//   const y = d3.scaleLinear()
//     .domain([0, d3.max(data, d => +d.total_cases)])
//     .range([lineHeight, 0]);
//   lineSvg.select("g")
//     .call(d3.axisLeft(y));

//   // color palette
//   const color = d3.scaleOrdinal()
//     .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

//   // Draw the line
//   const line = lineSvg.selectAll(".line")
//     .data(d3.group(data, d => d.location))
//     .join("path")
//     .attr("fill", "none")
//     .attr("stroke", d => color(d[0]))
//     .attr("stroke-width", 3.5)
//     .attr("d", d => d3.line()
//       .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
//       .y(d => y(+d.total_cases))
//       (d[1])
//     )
// }