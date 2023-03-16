// set the dimensions and margins of the graph
const bubbleWidth = 590;
const bubbleHeight = 420;

// store data globally to be used by other graphs
let mainData;
let bubbleData;

// append the svg object to the bubble-viz id of the page
const svg = d3.select("#bubble-viz")
  .append("svg")
  .attr("class", "bubble-svg")
  .attr("width", bubbleWidth)
  .attr("height", bubbleHeight);

// Read data from repo
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

    // Filter the data on latest updated date without blanks.
    bubbleData = data.filter(d => d.date === "2023-03-07" && d.continent !== '' && d.location !== '');
    mainData = data;
    continentData = data.filter(d => d.date === "2023-03-07" && ['OWID_AFR','OWID_ASI','OWID_EUR','OWID_NAM','OWID_OCE','OWID_SAM'].includes(d.iso_code));

    // Centers of different continent to sort them accordingly making it easier to find countries
    const continentCenters = {"North America": 10, "South America": 50, "Europe": 120, "Africa": 170, "Asia": 240, "Oceania": 290}

    // Color palette for continents
    const color = d3.scaleOrdinal()
        .domain(["North America", "South America", "Europe", "Africa", "Asia", "Oceania"])
        .range(d3.schemeSet1);

    // Size scale for countries
    const size = d3.scaleLinear()
        .domain([0, 107000000])
        .range([7, 50]); // circle will be between 16 and 70 px wide
    
    svg.append('text')
    .attr("x", bubbleWidth/2)
    .attr("y", bubbleHeight-30)
    .attr("text-anchor", "middle")
    .style("font-size", "0.96em")
    .style("fill", "#98C1D9") 
    .text("Total Covid-19 cases of countries (2023-03-07). Sorted by continent (North-America - Oceania)");
    
    // create a tooltip
    const bubbleTooltip = d3.select("#bubble-viz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "0.3em");

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseOver = (event, d) => {
        bubbleTooltip.style("opacity", 1);
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5);
        d3.selectAll(`.${d.iso_code}`)        
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
    };
    
    const mouseMove = (event, d) => {
        bubbleTooltip
            .html('<u>' + d.location + '</u>' + "<br>" + parseInt(d.total_cases) + " Total cases")
            .style("position", "fixed")
            .style("left", (event.x + 15) + "px")
            .style("top", (event.y - (scrollY/5)) + "px");
     };

    const mouseLeave = (event, d) => {
        bubbleTooltip.style("opacity", 0);
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 1);
    };

    const mouseclick = (event, d) => {
        lineGraph(data.filter(datum => d.location === datum.location))
    }

    // Initialize the circle: all located at the center of the svg area
    const node = svg.append("g")
        .selectAll("circle")
        .data(bubbleData)
        .join("circle")
        .attr("class", d => `node Country ${d.iso_code}`)
        .attr("r", d => size(d.total_cases))
        .attr("cx", bubbleWidth/2)
        .attr("cy", bubbleHeight/2)
        .style("fill", d => color(d.continent))
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 3)
        .on("mouseover", mouseOver) 
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave)
        .on("click", mouseclick);
        
    // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.1).x( function(d){ return continentCenters[d.continent] }))
    .force("y", d3.forceY().strength(0.1).y( bubbleHeight/2 ))
        .force("center", d3.forceCenter().x(bubbleWidth/2).y(bubbleHeight/2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) 
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.total_cases)+3) }).iterations(1)) // Force that avoids circle overlapping

    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(bubbleData)
        .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    
    // call line chart and bubble chart using the data from csv
    lineGraph(data.filter(d => d.location === 'World'));
    bubbleChart(bubbleData);
    lineVaccine(data.filter(d => d.location === 'World'));
    pieChart(continentData);
});