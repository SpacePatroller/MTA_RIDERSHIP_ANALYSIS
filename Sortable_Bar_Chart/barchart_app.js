

// Load and munge data, then make the visualization.
  var fileName = "data/fares_190209.csv";
  var fareType = ["FF", "30-D UNL","7-D UNL", "SEN/DIS", "7-D AFAS UNL","30-D AFAS/RMF UNL", 
      "JOINT RR TKT", "14-D RFM UNL", "1-D UNL", "14-D UNL", "7D-XBUS PASS", "TCMC", 
      "RF 2 TRIP", "RR UNL NO TRADE", "TCMC ANNUAL MC", "MR EZPAY EXP", "MR EZPAY UNL", "PATH 2-T", 
      "AIRTRAIN FF", "AIRTRAIN 30-D", "AIRTRAIN 10-T", "AIRTRAIN MTHLY", "STUDENTS", "NICE 2-T", 
      "CUNY-120", "CUNY-60"];

// ["FF","SEN/DIS", "7-D AFAS UNL", "30-D AFAS/RMF UNL", "JOINT RR TKT", "7-D UNL", "30-D UNL", "7D-XBUS PASS", "TCMC", "RF 2 TRIP", "RR UNL NO TRADE", "TCMC ANNUAL MC", "MR EZPAY EXP", "MR EZPAY UNL", "PATH 2-T","AIRTRAIN FF","STUDENTS","CUNY-120"];
  d3.csv(fileName, function(error, data) {
    var stationMap = {};
    data.forEach(function(d) {
      var station = d.STATION;
      stationMap[station] = [];
      console.log(stationMap)

      // { stationName: [ bar1Val, bar2Val, ... ] }
      fareType.forEach(function(field) {
        stationMap[station].push( +d[field] );
      });
    });
    makeVis(stationMap);
    });

    var makeVis = function(stationMap) {
       // Define dimensions of vis
       var margin = { top: 30, right: 50, bottom: 80, left: 50 },
       width  = 1000 - margin.left - margin.right,
       height = 500 - margin.top  - margin.bottom;

      // Make x scale
      var xScale = d3.scaleBand()
          .domain(fareType)
          .padding([0.1])
          .range([0, width]);
      ``    


         // .rangeRound([0, width], 0.1);

      // Make y scale, the domain will be defined on bar update
      var yScale = d3.scaleLinear()
          .range([height, 0]);

      // Create canvas
      var canvas = d3.select("#mtaChart")
        .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Make x-axis and add to canvas
        var xAxis = d3.axisBottom()
          .scale(xScale)
          //.orient("bottom");

                //canvas.append("g")
                  //  .attr("class", "x axis")
                  //  .attr("transform", "translate(0," + height + ")")
                  //  .call(xAxis);

          canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")                          
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-35)");

        // Make y-axis and add to canvas
        var yAxis = d3.axisLeft()
            .scale(yScale)
            //.orient("left");

        var yAxisHandleForUpdate = canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        yAxisHandleForUpdate.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value");

        var updateBars = function(data) {
            // First update the y-axis domain to match data
            yScale.domain( d3.extent(data) );
            yAxisHandleForUpdate.call(yAxis);

            var bars = canvas.selectAll(".bar").data(data);

            // Add bars for new data
            bars.enter()
              .append("rect")
              .attr("class", "bar")
              .attr("x", function(d,i) { return xScale( fareType[i] ); })
              .attr('width', xScale.bandwidth())
              .attr("y", function(d,i) { return yScale(d); })
              .attr("height", function(d,i) { return height - yScale(d); });

            // Update old ones, already have x / width from before
            bars
                .transition().duration(250)
                .attr("y", function(d,i) { return yScale(d); })
                .attr("height", function(d,i) { return height - yScale(d); });

            // Remove old ones
            bars.exit().remove();
                };

        // Handler for dropdown value change
        var dropdownChange = function() {
            var newStation = d3.select(this).property('value'),
                newData   = stationMap[newStation];

            updateBars(newData);
        };

        // Get names of stations for dropdown
        var stations = Object.keys(stationMap).sort();

        var dropdown = d3.select("#mtaChart")
            .insert("select", "svg")
            .on("change", dropdownChange);

        dropdown.selectAll("option")
            .data(stations)
            .enter().append("option")
            .attr("value", function (d) { return d; })
            .text(function (d) {
                return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
            });

        var initialData = stationMap[ stations[0] ];
        updateBars(initialData);
    };
