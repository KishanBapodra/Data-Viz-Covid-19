// set the dimensions and margins of the graph
const width = 700;
const height = 700;

// append the svg object to the body of the page
const svg = d3.select("#map_data")
  .append("svg")
  .attr("class", "map_svg")
  .attr("width", width)
  .attr("height", height)

// Read data
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(data => {

    // Filter a bit the data -> more than 1 million inhabitants
    data = data.filter(d => d.date === "2023-03-07" && d.continent !== '' && d.total_cases > 100000);

    // Color palette for continents?
    const color = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "Africa", "Oceania", "North America", "South America"])
        .range(d3.schemeSet1);
    console.log(color);
    // Size scale for countries
    const size = d3.scaleLinear()
        .domain([0, 107000000])
        .range([16, 70]); // circle will be between 7 and 55 px wide

    // create a tooltip
    const Tooltip = d3.select("#map_data")
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
        Tooltip.style("opacity", 1);
    };

    const mousemove = (event, d) => {
        Tooltip
            .html('<u>' + d.location + '</u>' + "<br>" + parseInt(d.total_cases) + " cases")
            .style("position", "absolute")
            .style("left", (event.x + 15) + "px")
            .style("top", (event.y - 15) + "px");
    };

    const mouseleave = (event, d) => {
        Tooltip.style("opacity", 0);
    };

    const mouseclick = (event, d) => {
        console.log(event);
        console.log(d);
    }

    // Initialize the circle: all located at the center of the svg area
    const node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "node")
        .attr("r", d => size(d.total_cases))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", d => color(d.continent))
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", mouseclick);


    // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.total_cases)+3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
        }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }
});