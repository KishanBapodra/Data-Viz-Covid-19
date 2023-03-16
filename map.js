const mapWidth = 52;
const mapHeight = 80;

  // The svg
const mapSvg = d3.select("#map-viz")
            .append("svg")
            .attr("class", "map-svg")
            .attr("width", `${mapWidth}vw`)
            .attr("height",`${mapHeight}vh`);

// Map and projection
const mapPath = d3.geoPath();
const projection = d3.geoMercator()
  .scale(100)
  .center([0,20])
  .translate([ window.innerWidth * mapWidth / 200 , window.innerHeight * mapHeight / 200]);

  // Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([0, 1000, 10000, 50000, 100000, 200000, 300000, 500000])
  .range(d3.schemeReds[9]);
// .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 20000000, 50000000])

let arr = [];
// Load external data and boot
Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",function (d) {
    if(d.date === "2023-03-07") {
        data.set(d.iso_code, d.total_cases_per_million)
        arr.push(d.total_cases_per_million);
    };
  })])
  .then(function(loadData) {
    let topo = loadData[0];

    // filter antartica out
    // topo.features = topo.features.filter(d => d.id !== )

    let mouseOver = function(event, d) {
        mapTooltip.style("opacity", 1);
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5);
        d3.selectAll(`.${event.target.classList[1]}`)        
        .transition()
        .duration(200)
        .style("opacity", 1);
    }

    const mouseMove = (event, d) => {
      mapTooltip
          .html('<u>' + d.properties.name + '</u>' + "<br>" + parseInt(d.total) + " cases per million")
          .style("position", "fixed")
          .style("left", (event.x + 15) + "px")
          .style("top", (event.y - (scrollY/5)) + "px");
   };

    let mouseLeave = function(event, d) {
        mapTooltip.style("opacity", 0);
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 1);
    }
    
    let mouseClick = function(event, d) {
        if(d.id !== 'ATA' )
          lineGraph(mainData.filter(datum => datum.iso_code === d.id))
        else
          lineGraph(mainData.filter(datum => datum.location === 'World'))
        d3.select(`.${event.target.classList[1]}-gdp`)
          .transition()
          .delay(1000)
          .duration(800)
          .attr("stroke", "white")
          .attr("stroke-width", 3)
          .transition()
          .delay(3000)
          .duration(600)
          .attr("stroke", "black")
          .attr("stroke-width", );
    }

    // create a tooltip
    const mapTooltip = d3.select("#map-viz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "0.3em");


    // Draw the map
    mapSvg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "black")
      .attr("class", function(d){ return `Country ${d.id}` } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mousemove", mouseMove)
      .on("click", mouseClick)
      .on("mouseleave", mouseLeave );

});

// ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"]