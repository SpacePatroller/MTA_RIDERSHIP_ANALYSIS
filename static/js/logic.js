var greenIcon = L.icon({
  iconUrl: '/static/images/bus-stop3.png',
  iconSize: [12, 10] // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
})

function plotStopsOnMap() {
  // read in latitudes and longitudes from /locations routes to plot stop markers
  locationUrl = '/locations'
  // this changed from d3.json(locationurl).then(function (locations) {})
  d3.json(locationUrl, function(locations) {
    // console.log(locations)

    var elevated = []
    var subway = []
    var open_cut = []
    var viaduct = []
    var at_grade = []
    var embankment = []

    //Loop through the initial array and add to two different arrays based on the specified variable
    for (var i = 0; i < locations.length; i++) {
      lat = +locations[i][0]
      lon = +locations[i][1]
      var line = locations[i][4]
      var stopName = locations[i][3]
      var division = locations[i][2]
      var structure = locations[i][5]
      var stopID = locations[i][6]

      switch (locations[i][5]) {
        case 'Elevated':
          elevated.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line - ${line}</p><hr><p>Stop - ${stopName}</p><hr><p>Divsion - ${division}<hr><p>Structure - ${structure}</p>`
            )
          )
          break
        case 'Subway':
          subway.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line - ${line}</p><hr><p>Stop - ${stopName}</p><hr><p>Divsion - ${division}<hr><p>Structure - ${structure}</p>`
            )
          )
          break
        case 'Open Cut':
          open_cut.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line - ${line}</p><hr><p>Stop - ${stopName}</p><hr><p>Divsion - ${division}<hr><p>Structure - ${structure}</p>`
            )
          )
          break
        case 'Viaduct':
          viaduct.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line - ${line}</p><hr><p>Stop - ${stopName}</p><hr><p>Divsion - ${division}<hr><p>Structure - ${structure}</p>`
            )
          )
          break
        case 'At Grade':
          at_grade.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line - ${line}</p><hr><p>Stop - ${stopName}</p><hr><p>Divsion - ${division}`
            )
          )
          break
        case 'Embankment':
          embankment.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line - ${line}</p><hr><p>Stop - ${stopName}</p><hr><p>Divsion - ${division}`
            )
          )
          break
        default:
          break
      }
    }

    //add the groups of markers to layerGroups
    var groupA = L.layerGroup(elevated)
    var groupB = L.layerGroup(subway)
    var groupC = L.layerGroup(open_cut)
    var groupD = L.layerGroup(viaduct)
    var groupE = L.layerGroup(at_grade)
    var groupF = L.layerGroup(embankment)

    //background tile set
    var tileLayer = {
      Structures: L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
          attribution:
            'Map locations &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets',
          accessToken: API_KEY
        }
      )
    }

    var map = L.map('mapid', {
      center: new L.LatLng(40.7128, -74.006),
      zoom: 12,
      layers: [
        tileLayer['Structures'],
        groupA,
        groupB,
        groupC,
        groupD,
        groupE,
        groupF
      ] //change this to determine which ones start loaded on screen
    })

    ///////////Control on the Top Left that handles the switching between layers
    var overlayMaps = {
      Elevated: groupA,
      Subway: groupB,
      'Open Cut': groupC,
      Viaduct: groupD,
      'At Grade': groupE,
      Embankment: groupF
    }
    // L.control.layers(tileLayer, overlayMaps, { position: 'topleft' }).addTo(map);

    // grab unique stop id and push to array if array is greater then one remove last item. on line 141
    var markerIconValue = d3.selectAll('.leaflet-marker-icon')
    markerIconValue.on('click', function() {
      d3.event.preventDefault()
      work = d3.select(this).attr('alt')
      uniqueStopID.unshift(+work)
      if (uniqueStopID.length > 1) {
        uniqueStopID.pop()
      }
    })

    return (emanshu = d3.selectAll('.leaflet-marker-icon'))
  })
}
plotStopsOnMap()

// unique stop id created withing map on click function
uniqueStopID = []

// chart that displays diffrent fare information
function fareChart() {
  fareDataUrl1 = `/fareData`
  // console.log(fareDataUrl1)

  // read in data from route
  d3.json(fareDataUrl1, function(faredata) {
    // console.log(`Station ${faredata[0]}`)
    // console.log(`Fares ${faredata[1]}`)
    for (x = 0; x < faredata.length; x++) {
      // console.log(faredata[1][x])
      allFares = faredata[1][x]
      label = ['Fare Data']

      ctx = document.getElementById('fareChart').getContext('2d')
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            'FF',
            '30-D UNL',
            '7-D UNL',
            'SEN/DIS',
            '7-D AFAS UNL',
            '30-D AFAS/RMF UNL',
            'JOINT RR TKT',
            '14-D RFM UNL',
            '1-D UNL',
            '14-D UNL',
            '7D-XBUS PASS',
            'TCMC',
            'RF 2 TRIP',
            'RR UNL NO TRADE',
            'TCMC ANNUAL MC',
            'MR EZPAY EXP',
            'MR EZPAY UNL',
            'PATH 2-T',
            'AIRTRAIN FF',
            'AIRTRAIN 30-D',
            'AIRTRAIN 10-T',
            'AIRTRAIN MTHLY',
            'STUDENTS',
            'NICE 2-T',
            'CUNY-120',
            'CUNY-60'
          ],
          datasets: [
            {
              label: label,
              data: faredata[1][x],
              backgroundColor: [
                'rgb(255,255,217)',
                'rgb(199,233,180)',
                'rgb(127,205,187)',
                'rgb(65,182,196)',
                'rgb(29,145,192)',
                'rgb(34,94,168)',
                'rgb(37,52,148)',
                'rgb(8,29,88)',
                'rgb(255,255,217)',
                'rgb(199,233,180)',
                'rgb(127,205,187)',
                'rgb(65,182,196)',
                'rgb(29,145,192)',
                'rgb(34,94,168)',
                'rgb(37,52,148)',
                'rgb(8,29,88)',
                'rgb(255,255,217)',
                'rgb(199,233,180)',
                'rgb(127,205,187)',
                'rgb(65,182,196)',
                'rgb(29,145,192)',
                'rgb(34,94,168)',
                'rgb(37,52,148)',
                'rgb(8,29,88)'
              ],
              borderColor: [
                'rgb(255,255,217)',
                'rgb(199,233,180)',
                'rgb(127,205,187)',
                'rgb(65,182,196)',
                'rgb(29,145,192)',
                'rgb(34,94,168)',
                'rgb(37,52,148)',
                'rgb(8,29,88)',
                'rgb(255,255,217)',
                'rgb(199,233,180)',
                'rgb(127,205,187)',
                'rgb(65,182,196)',
                'rgb(29,145,192)',
                'rgb(34,94,168)',
                'rgb(37,52,148)',
                'rgb(8,29,88)',
                'rgb(255,255,217)',
                'rgb(199,233,180)',
                'rgb(127,205,187)',
                'rgb(65,182,196)',
                'rgb(29,145,192)',
                'rgb(34,94,168)',
                'rgb(37,52,148)',
                'rgb(8,29,88)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      })

      ///////////////////////////////

      // on click grab the station id and query the route based on that information.
      d3.selectAll('#mapid').on('click', function() {
        heatmapChart('Entries', `${uniqueStopID}`)
        d3.event.preventDefault()
        fareDataUrl = `/locations/stopID/${uniqueStopID}`

        // read in data from route
        // use to be d3.json(fareDataUrl).then(function(faredata) {})
        d3.json(fareDataUrl, function(faredata) {
          // console.log(`Station ${faredata[0]}`)
          var label = faredata[0]
          // console.log(`Fares ${faredata[1]}`)
          for (x = 0; x < faredata.length; x++) {
            var fares = faredata[x][0]
            // console.log(faredata[x])

            removeData(myChart)

            addData(myChart, fares, label)
          }

          // function to remove data from chart
          function removeData(chart) {
            chart.data.datasets.forEach(dataset => {
              dataset.label = []
            })

            chart.data.datasets.forEach(dataset => {
              dataset.data = []
            })
            chart.update()
          }

          function addData(chart, data, label) {
            chart.data.datasets.forEach(datasets => {
              datasets.label = label
            })
            chart.data.datasets.forEach(dataset => {
              dataset.data = fares
            })
            chart.update()
          }
        })
      })
    }
  })
}
fareChart()

//////////////////// heat map chart ////////////////////////

var margin = { top: 50, right: 0, bottom: 100, left: 30 },
  width = 460 - margin.left - margin.right,
  height = 430 - margin.top - margin.bottom,
  gridSize = Math.floor(height / 7),
  legendElementHeight = gridSize / (9 / 7),
  buckets = 9,
  colors = [
    '#ffffd9',
    '#edf8b1',
    '#c7e9b4',
    '#7fcdbb',
    '#41b6c4',
    '#1d91c0',
    '#225ea8',
    '#253494',
    '#081d58'
  ], // alternatively colorbrewer.YlGnBu[9]
  days = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'],
  times = ['3a', '7a', '11a', '3p', '7p', '11p']
datasets = ['Entries', 'Exits', 'Total_Activity']

var svg = d3
  .select('#heatChart')
  .append('svg')
  .attr('id', 'heatChartSvg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var dayLabels = svg
  .selectAll('.dayLabel')
  .data(days)
  .enter()
  .append('text')
  .text(function(d) {
    return d
  })
  .attr('x', 0)
  .attr('y', function(d, i) {
    return i * gridSize
  })
  .style('text-anchor', 'end')
  .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
  .attr('class', function(d, i) {
    return i >= 2 && i <= 6
      ? 'dayLabel mono axis axis-workweek'
      : 'dayLabel mono axis'
  })

var timeLabels = svg
  .selectAll('.timeLabel')
  .data(times)
  .enter()
  .append('text')
  .text(function(d) {
    return d
  })
  .attr('x', function(d, i) {
    return i * gridSize
  })
  .attr('y', 0)
  .style('text-anchor', 'middle')
  .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
  .attr('class', 'timeLabel mono axis axis-worktime')

// var title =  svg.append("text")
//        .attr("x", (width / 2))             
//        .attr("y", 0 - (margin.top / 2))
//        .attr("text-anchor", "middle")  
//        .style("font-size", "16px") 
//        .style("text-decoration", "underline")  
//        .text("Number of Riders: Date vs. Time");

// where the code changes
var heatmapChart = function(column, route) {
  var heatURL = ''

  // if (!!route || route === null) {
  //   heatURL = `/locations/turnstile/null`
  // } else {
  heatURL = `/locations/turnstile/${route}`
  // }

  // console.log(uniqueStopID)
  // heatURL = `/locations/turnstile`
  var parser = d3.timeParse('%m/%d/%Y')
  var formatter = d3.timeFormat('%w')
  // read in turnstile route data
  d3.json(heatURL, function(heatData) {
    console.log(heatData)
    // create an empty array
    var data = []
    // loop through turnstile data and push to data array
    for (x = 0; x < heatData.length; x++) {
      data.push({
        DATE: formatter(parser(heatData[x][0])),
        TIME: heatData[x][1].slice(0, heatData[x][1].indexOf(':')),
        Exits: heatData[x][2],
        Entries: heatData[x][3],
        Total_Activity: heatData[x][4]
      })
      // where the code change ends
    }

    formatComma = d3.format(',')

    var colorScale = d3.scale
      .quantile()
      .domain([
        d3.min(data, function(d) {
          return d[column]
        }),
        d3.max(data, function(d) {
          return d[column]
        })
      ])
      .range(colors)

    var cards = svg.selectAll('.hour').data(data, function(d) {
      return d.DATE + ':' + d.TIME
    })

    cards.append('title')

    cards
      .enter()
      .append('rect')
      .attr('x', function(d) {
        return Math.floor(d.TIME / 4) * gridSize
      })
      .attr('y', function(d) {
        if (d.DATE === '6') {
          return 0
        } else {
          return d.DATE * gridSize + gridSize
        }
      })
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('class', 'hour bordered')
      .attr('width', gridSize)
      .attr('height', gridSize)
      .style('fill', colors[0])

    cards
      .transition()
      .duration(1000)
      .style('fill', function(d) {
        return colorScale(d[column])
      })

    cards.select('title').text(function(d) {
      return d[column]
    })

    cards.exit().remove()

    var legend = svg
      .selectAll('.legend')
      .data([0].concat(colorScale.quantiles()), function(d) {
        return d
      })

    legend
      .enter()
      .append('g')
      .attr('class', 'legend')

    legend
      .append('rect')
      .attr('y', function(d, i) {
        return legendElementHeight * i
      })
      .attr('x', height)
      .attr('height', legendElementHeight)
      .attr('width', gridSize / 2)
      .style('fill', function(d, i) {
        return colors[i]
      })

    legend
      .append('text')
      .attr('class', 'mono')
      .text(function(d) {
        return '≥ ' + formatComma(Math.round(d))
      })
      .attr('y', function(d, i) {
        return legendElementHeight * i + 0.5 * gridSize
      })
      .attr('x', height + gridSize)

    legend.exit().remove()

    function timeString(time) {
      if (time == '3') {
        return '11p - 3a'
      } else if (time < 12) {
        return `${time - 4}a - ${time}a`
      } else if (time < 17) {
        return `${time - 4}a - ${time - 12}p`
      } else {
        return `${time - 16}p - ${time - 12}p`
      }
    }

    var toolTip = d3
      .tip()
      .attr('class', 'tooltip')
      .html(function(d) {
        return `${timeString(d.TIME)}<hr>${formatComma(d[column])}`
      })

    cards
      .on('mouseover', function(d) {
        toolTip.show(d, this)
      })
      .on('mouseout', function(d) {
        toolTip.hide(d)
      })

    cards.call(toolTip)
  })
}

heatmapChart('Entries', null)

var datasetpicker = d3
  .select('#dataset-picker')
  .selectAll('.dataset-button')
  .data(datasets)

datasetpicker
  .enter()
  .append('input')
  .attr('value', function(d) {
    return d
  })
  .attr('type', 'button')
  .attr('class', 'dataset-button')
  .on('click', function(d) {
    if (uniqueStopID == []) {
      heatmapChart(d, null)
    } else {
      heatmapChart(d, `${uniqueStopID}`)
    }
  })

//final
