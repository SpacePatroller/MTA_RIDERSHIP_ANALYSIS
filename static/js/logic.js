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
  d3.json(locationUrl).then(function(locations) {
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
              `<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`
            )
          )
          break
        case 'Subway':
          subway.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`
            )
          )
          break
        case 'Open Cut':
          open_cut.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`
            )
          )
          break
        case 'Viaduct':
          viaduct.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`
            )
          )
          break
        case 'At Grade':
          at_grade.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`
            )
          )
          break
        case 'Embankment':
          embankment.push(
            L.marker([lat, lon], { alt: stopID, icon: greenIcon }).bindTooltip(
              `<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`
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

    // grab unique stop id and push to array if array is greater then one remove last item.
    var markerIconValue = d3.selectAll('.leaflet-marker-icon')
    markerIconValue.on('click', function() {
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

uniqueStopID = []

function baseChart() {
  fareDataUrl1 = `/fareData`
  // console.log(fareDataUrl1)

  // read in data from route
  d3.json(fareDataUrl1).then(function(faredata) {
    // console.log(`Station ${faredata[0]}`)
    // console.log(`Fares ${faredata[1]}`)
    for (x = 0; x < faredata.length; x++) {
      // console.log(faredata[1][x])
      allFares = faredata[1][x]
      label = ['Fare Data']

      ctx = document.getElementById('myChart').getContext('2d')
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
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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
        fareDataUrl = `/locations/stopID/${uniqueStopID}`

        // read in data from route
        d3.json(fareDataUrl).then(function(faredata) {
          // console.log(`Station ${faredata[0]}`)
          // console.log(`Fares ${faredata[1]}`)
          for (x = 0; x < faredata.length; x++) {
            var fares = faredata[x][0]
            console.log(fares)

            removeData(myChart)

            addData(myChart, fares)
          }

          // function to remove data from chart
          function removeData(chart) {
            // chart.data.labels.pop();
            chart.data.datasets.forEach(dataset => {
              dataset.data = []
            })
            chart.update()
          }

          function addData(chart, data) {
            // chart.data.labels.push(label);
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

baseChart()

//dafd
