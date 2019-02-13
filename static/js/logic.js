
// var mymap = L.map('mapid', {
//     center: new L.LatLng(40.7128, -74.0060),
//     zoom: 9,
//     layers: [tileLayer['Gray'], groupA, groupB] //change this to determine which ones start loaded on screen
// });

// // custom icon variable
// var greenIcon = L.icon({
//     iconUrl: '/Users/emanshupatel/code/Group_A_Project_2/static/images/iconfinder_Location_05_1530089 (2).png',
//     iconSize: [38, 95], // size of the icon
//     shadowSize: [50, 64], // size of the shadow
//     iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//     shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

var markersA = [];
var markersB = [];


// read in latitudes and longitudes from /locations routes to plot stop markers
locationUrl = '/locations'
d3.json(locationUrl).then(function (locations) {
    // console.log(locations)


    //Loop through the initial array and add to two different arrays based on the specified variable
    for (var i = 0; i < locations.length; i++) {

        lat = +locations[i][0]
        lon = +locations[i][1]
        var line = locations[i][4];
        var stopName = locations[i][3];
        var division = locations[i][2];
        console.log(lat, lon)

        switch (locations[i][2]) {
            case 'BMT':
                markersA.push(L.marker([lat,lon]));
                break;
            case 'IRT':
                markersB.push(L.marker([lat,lon]));
                break;
            default:
                break;
        }

    }

    //add the groups of markers to layerGroups
    var groupA = L.layerGroup(markersA);
    var groupB = L.layerGroup(markersB);

    //background tile set
    var tileLayer = {
        'Divisions': L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: "Map locations &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            id: "mapbox.streets",
            accessToken: API_KEY
        })
    };

    var map = L.map('mapid', {
        center: new L.LatLng(40.7128, -74.0060),
        zoom: 12,
        layers: [tileLayer['Divisions'], groupA, groupB] //change this to determine which ones start loaded on screen
    });

    ///////////Control on the Top Left that handles the switching between A and B
    var overlayMaps = {
        "BMT": groupA,
        "IRT": groupB
    };
    L.control.layers(tileLayer, overlayMaps, { position: 'topleft' }).addTo(map);


});




////////////// route to distinct location locations

locationUrl = '/locations'
d3.json(locationUrl).then(function (locations) {

    // console.log(locations)

})

