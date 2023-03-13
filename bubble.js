// set the dimensions and margins of the graph
const width = 550;
const height = 550;

// append the svg object to the body of the page
const svg = d3.select("#bubble-viz")
  .append("svg")
  .attr("class", "bubble-svg")
  .attr("width", width)
  .attr("height", height);

    // Read data
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

    // Filter a bit the data on latest updated date 
    bubbleData = data.filter(d => d.date === "2023-03-07" && d.continent !== '' && d.location !== '');
    const continentCenters = {"Asia":10,"Europe":50,"North America":120,"Oceania":170,"Africa":240,"South America":290}
    
    // Color palette for continents?
    const color = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "Africa", "Oceania", "North America", "South America"])
        .range(d3.schemeSet1);
    // Size scale for countries
    const size = d3.scaleLinear()
        .domain([0, 107000000])
        .range([9, 45]); // circle will be between 16 and 70 px wide
    svg.append('text')
    .attr("x", width/2)
    .attr("y", height-30)
    .attr("text-anchor", "middle")
    .style("font-size", "1.3em")
    .style("fill", "#CCC") 
    .text("Total Covid-19 cases of the countries as of 2023-03-07");
    
    
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
    const mouseover = (event, d) => {
        bubbleTooltip.style("opacity", 1);
    };
    const mousemove = (event, d) => {
        bubbleTooltip
            .html('<u>' + d.location + '</u>' + "<br>" + parseInt(d.total_cases) + " cases")
            .style("position", "absolute")
            .style("left", (event.x + 15) + "px")
            .style("top", (event.y + scrollY) + "px");
     };

    const mouseleave = (event, d) => {
        bubbleTooltip.style("opacity", 0);
    };

    const mouseclick = (event, d) => {
        // console.log(d);
        // singleLineGraph(data.filter(datum => d.location === datum.location))
    }
    // console.log(d3.extent(bubbleData.total_cases_per_million));
    // Initialize the circle: all located at the center of the svg area
    const node = svg.append("g")
        .selectAll("circle")
        .data(bubbleData)
        .join("circle")
        .attr("class", d => `node Country ${d.iso_code}`)
        .attr("r", d => size(d.total_cases))
        .attr("cx", width/2)
        .attr("cy", height/2)
        .style("fill", d => color(d.continent))
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 3)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", function(event, d) {
            if(d3.select(this)._groups[0][0].classList.contains('circle-click'))
                d3.select(this).classed("circle-click", false);
            else 
                d3.select(this)
                .classed("circle-click", true); // add the class 'clicked' to the selected circle
            mouseclick(event,d);
        });

    // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.1).x( function(d){ return continentCenters[d.continent] }))
    .force("y", d3.forceY().strength(0.1).y( height/2 ))
        .force("center", d3.forceCenter().x(width/2).y(height/2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.total_cases)+3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(bubbleData)
        .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });


});