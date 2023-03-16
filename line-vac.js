// set the dimensions and Margins of the graph
const lineVacMargin = {top: 25, right: 30, bottom: 50, left: 60};
const lineVacWidth = 600 - lineVacMargin.left - lineVacMargin.right;
const lineVacHeight = 400 - lineVacMargin.top - lineVacMargin.bottom;

// Now I can use this dataset:
function lineVaccine(data) {

    // append the svg object to the body of the page
    const lineVacSVG = d3.select("#line-vaccine-viz")
        .append("svg")
        .attr("width", lineVacWidth + lineVacMargin.left + lineVacMargin.right)
        .attr("height", lineVacHeight + lineVacMargin.top + lineVacMargin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + lineVacMargin.left + "," + lineVacMargin.top + ")");
    
              
    const timeStamps = data.map(d => d3.timeParse("%Y-%m-%d")(d.date));
    const domain = d3.extent(timeStamps);
    filteredData = data.filter(d => d3.timeParse("%Y-%m-%d")(d.date) > d3.timeParse("%Y-%m-%d")("2021-01-01") && d3.timeParse("%Y-%m-%d")(d.date) < d3.timeParse("%Y-%m-%d")("2023-03-06"));
              
    // filter the latest data out as it has bugs

    // Add X axis
    const x = d3.scaleTime()
        .domain(domain)
        .range([ 0, lineVacWidth ]);
  
    lineVacSVG.append("g")
        .attr("transform", "translate(0," + lineVacHeight + ")")
        .call(d3.axisBottom(x));
  
    // Add Y axis
    const y1 = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.total_deaths+d.total_deaths*0.1)])
        .range([ lineVacHeight, 0]);
  
    lineVacSVG.append("g")
        .call(d3.axisLeft(y1))
        .call(g => g.append("text")
        .attr("x", -lineVacMargin.left)
        .attr("y", -15)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .text("↑ Total Covid-19 Deaths"));

    // Add second Y axis
    const y2 = d3.scaleLinear()
        .domain([0,1])
        .range([ lineVacHeight, 0]);
    
    lineVacSVG.append("g")
        .attr("transform", `translate(${lineVacWidth},0)`)
        .call(d3.axisRight(y2))
        .call(g => g.append("text")
        .attr("x", lineVacMargin.right)
        .attr("y", -15)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text("↑ Vaccination Rate (vaccinated/population)"));

    // Add the line
    lineVacSVG.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
        .y(function(d) { return y1(d.total_deaths) })
        )

    lineVacSVG.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
        .y(function(d) { return y2(d.people_fully_vaccinated/d.population) })
        )
    
    lineVacSVG.append('text')
        .attr("x", lineVacWidth/2)
        .attr("y", lineVacHeight + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "0.75em")
        .style("fill", "black") 
        .text("Vaccination Rate: Red , Total Deaths: Steelblue");
}