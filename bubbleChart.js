
const bubbleChart = (data) => {

  // remove country's with no gdp or very low gdp to avoid clutter 
  data = data.filter(d => d.gdp_per_capita > 1000);
  // set the dimensions and margins of the graph
  const bubbleChartMargin = {top: 40, right: 20, bottom: 38, left: 80};
  const bubbleChartWidth = 750 - bubbleChartMargin.left - bubbleChartMargin.right;
  const bubbleChartHeight = 520 - bubbleChartMargin.top - bubbleChartMargin.bottom;

  // append the svg object to the body of the page
  const bubbleChartSVG = d3.select("#bubble-chart-viz")
    .append("svg")
      .attr("width", bubbleChartWidth + bubbleChartMargin.left + bubbleChartMargin.right)
      .attr("height", bubbleChartHeight + bubbleChartMargin.top + bubbleChartMargin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + bubbleChartMargin.left + "," + bubbleChartMargin.top + ")");

  // create a tooltip
  const bubbleChartTooltip = d3.select("#bubble-chart-viz")
      .append("div")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "0.3em");

  const mouseOver = (event, d) => {
    bubbleChartTooltip.style("opacity", 1);
  }

  const mouseMove = (event, d) => {
    bubbleChartTooltip
        .html('<u>' + d.location + '</u>' + "<br>" + parseInt(d.total_cases_per_million) + " cases per million")
        .style("position", "fixed")
        .style("left", (event.x + 15) + "px")
        .style("top", (event.y) + "px");
  };

  const mouseLeave = (event, d) => {
    bubbleChartTooltip.style("opacity", 0);
  }

  const mouseClick = (event,d) => {
    d3.selectAll(".Country")
      .transition()
      .delay(1000)
      .duration(100)
      .style("opacity", .5)
      .transition()
      .delay(3000)
      .duration(200)
      .style("opacity", 1);
    d3.selectAll(`.${d.iso_code}`)
      .transition()
      .duration(100)
      .style("opacity", 1);
  }

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 60000])
    .range([ 0, bubbleChartWidth ]);

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, 1000000])
  .range([ bubbleChartHeight, 0]);


  bubbleChartSVG.append("g")
    .attr("transform", "translate(0," + bubbleChartHeight + ")")
    .call(d3.axisBottom(x))
    .call(g => g.append("text")
        .attr("x", bubbleChartWidth)
        .attr("y", bubbleChartMargin.bottom - 2)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("GDP per capita (dollars) →"))


   bubbleChartSVG.append("g")
     .call(d3.axisLeft(y))
     .call(g => g.append("text")
     .attr("x", -bubbleChartMargin.left + 10)
     .attr("y", -15)
     .attr("fill", "currentColor")
     .attr("text-anchor", "start")
     .text("↑ Covid-19 Cases Per Million"));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain([0, 1000000])
    .range([ 1, 40]);

  // Add dots
  bubbleChartSVG.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", d => `${d.iso_code}-gdp`)
      .attr("cx", function (d) { return x(d.gdp_per_capita); } )
      .attr("cy", function (d) { return y(d.total_cases_per_million); } )
      .attr("r", function (d) { return z(d.total_cases_per_million); } )
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")
      .on("mouseover", mouseOver) 
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave)
      .on("click", mouseClick);
  }