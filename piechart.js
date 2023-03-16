const pieChart = (data) => {

    // set the dimensions and margin of the graph
    const pieWidth = 850;
    const pieHeight = 850;
    const pieMargin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one).
    const radius = Math.min(pieWidth, pieHeight) / 2 - pieMargin
    console.log(data);
    pieDataObjects = data.map(d => {
        const continent = d.location
        return {
            [continent]: d.total_cases
        }
    })    
    const pieData = Object.assign({}, ...pieDataObjects);


    // append the svg object to the pie-viz called
    const pieSVG = d3.select("#pie-viz")
        .append("svg")
        .attr("width", pieWidth)
        .attr("height", pieHeight)
        .append("g")
        .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

    const pieTooltip = d3.select("#pie-viz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "0.3em");

    const mouseOver = (event, d) => {
        pieTooltip.style("opacity",1);
    }

    const mouseMove = (event, d) => {
        pieTooltip
            .html('<u>' + d.data[0] + '</u>' + "<br>" + parseInt(d.data[1]) + " Total cases")
            .style("position", "fixed")
            .style("left", (event.x + 15) + "px")
            .style("top", (event.y) + "px");
     };

    const mouseLeave = (event, d) => {
        pieTooltip.style("opacity", 0);
    }

    // set the color scale  
    const color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']); 

    // Compute the position of each group on the pie:
    const pie = d3.pie()
            .value(function(d) {return d[1]});   

    const computed_data = pie(Object.entries(pieData));

    // shape helper to build arcs:
    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)

    // pie chart; generate arcs using arcGenerator method.
    pieSVG
      .selectAll('arc')
      .data(computed_data)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', (d,i) => { return(color(i)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("mousemove", mouseMove);
}