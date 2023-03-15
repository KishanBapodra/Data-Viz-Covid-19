
const bubbleChart = (data) => {

  data = data.filter(d => d.gdp_per_capita > 5000);
  // set the dimensions and margins of the graph
  const bubbleChartMargin = {top: 10, right: 20, bottom: 30, left: 80};
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
    console.log(event);
    bubbleChartTooltip.style("opacity", 1);
  }

  const mouseMove = (event, d) => {
    bubbleChartTooltip
        .html('<u>' + d.location + '</u>' + "<br>" + parseInt(d.total_cases) + " cases")
        .style("position", "fixed")
        .style("left", (event.x + 15) + "px")
        .style("top", (event.y) + "px");
  };

  const mouseLeave = (event, d) => {
    bubbleChartTooltip.style("opacity", 0);
  }

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 60000])
    .range([ 0, bubbleChartWidth ]);
  bubbleChartSVG.append("g")
    .attr("transform", "translate(0," + bubbleChartHeight + ")")
    .call(d3.axisBottom(x));

   // Add Y axis
   const y = d3.scaleLinear()
     .domain([0, 1000000])
     .range([ bubbleChartHeight, 0]);
   bubbleChartSVG.append("g")
     .call(d3.axisLeft(y));

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
      .attr("cx", function (d) { return x(d.gdp_per_capita); } )
      .attr("cy", function (d) { return y(d.total_cases_per_million); } )
      .attr("r", function (d) { return z(d.total_cases_per_million); } )
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")
      .on("mouseover", mouseOver) 
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave);
  }