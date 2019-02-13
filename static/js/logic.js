var greenIcon = L.icon({
    iconUrl: '/static/images/bus-stop3.png',
    iconSize:     [12, 10], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// read in latitudes and longitudes from /locations routes to plot stop markers
locationUrl = '/locations'
d3.json(locationUrl).then(function (locations) {
    console.log(locations)

    var elevated = [];
    var subway = [];
    var open_cut = [];
    var viaduct = [];
    var at_grade = [];
    var embankment = [];

    //Loop through the initial array and add to two different arrays based on the specified variable
    for (var i = 0; i < locations.length; i++) {

        lat = +locations[i][0]
        lon = +locations[i][1]
        var line = locations[i][4];
        var stopName = locations[i][3];
        var division = locations[i][2];
        var structure = locations[i][5];

        switch (locations[i][5]) {
            case 'Elevated':
                elevated.push(L.marker([lat, lon], { alt: structure, icon: greenIcon }).bindTooltip(`<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`));
                break;
            case 'Subway':
                subway.push(L.marker([lat, lon],{ alt: structure,icon: greenIcon }).bindTooltip(`<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`));
                break;
            case 'Open Cut':
                open_cut.push(L.marker([lat, lon],{ alt: structure,icon: greenIcon }).bindTooltip(`<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`));
                break;
            case 'Viaduct':
                viaduct.push(L.marker([lat, lon],{ alt: structure ,icon: greenIcon}).bindTooltip(`<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`));
                break;
            case 'At Grade':
                at_grade.push(L.marker([lat, lon],{ alt: structure,icon: greenIcon }).bindTooltip(`<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`));
                break;
            case 'Embankment':
                embankment.push(L.marker([lat, lon],{ alt: structure,icon: greenIcon }).bindTooltip(`<p>Line-${line}</p><hr><p>Stop-${stopName}</p><hr><p>Divsion-${division}`));
                break;
            default:
                break;
        }

    }

    //add the groups of markers to layerGroups
    var groupA = L.layerGroup(elevated);
    var groupB = L.layerGroup(subway);
    var groupC = L.layerGroup(open_cut);
    var groupD = L.layerGroup(viaduct);
    var groupE = L.layerGroup(at_grade);
    var groupF = L.layerGroup(embankment);

    //background tile set
    var tileLayer = {
        'Structures': L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: "Map locations &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            id: "mapbox.streets",
            accessToken: API_KEY
        })
    };

    var map = L.map('mapid', {
        center: new L.LatLng(40.7128, -74.0060),
        zoom: 12,
        layers: [tileLayer['Structures'], groupA] //change this to determine which ones start loaded on screen
    });

    
    ///////////Control on the Top Left that handles the switching between layers
    var overlayMaps = {
        "Elevated": groupA,
        "Subway": groupB,
        "Open Cut": groupC,
        "Viaduct": groupD,
        "At Grade": groupE,
        "Embankment": groupF
    };
    L.control.layers(tileLayer, overlayMaps, { position: 'topleft' }).addTo(map);

});

////////////// route to distinct location locations

locationUrl = '/locations'
d3.json(locationUrl).then(function (locations) {

    // console.log(locations)

})

