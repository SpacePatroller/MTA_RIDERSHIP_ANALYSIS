var mymap = L.map('mapid').setView([40.7128, -74.0060], 13);

// tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    zoom: 11,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(mymap);



// read in latitudes and longitudes from /locations routes
locationUrl = '/locations'
d3.json(locationUrl).then(function (data) {

    console.log(data)

    for (m = 0; m < data.length; m++) {
        
        var marker = L.marker([data[m][0], data[m][1]])
            .addTo(mymap)

        var popup = marker.bindTooltip(data[m][4]).openTooltip()
        
    



    }




})