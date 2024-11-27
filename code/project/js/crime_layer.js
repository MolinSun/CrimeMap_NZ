import {regionOffenceTypeColor, area_unitOffenceTypeColor} from './choroplethMapstyle.js';
import {crimeTrend, crimeTypePieChart} from "./crimeGraphs.js";

let regionLayer, area_unitLayer;
export const mapView = document.getElementById('nz_region');
export const graphView = document.getElementById('graph_view');



function highlightFeature(e){
    const layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
    });

    if(!L.Browser.ie && !L.Browser.opera){
        layer.bringToFront();
    }
}

function resetRegionHighlight(e) {
    const layer = e.target;
    const feature = layer.feature;
    const offence_type = document.getElementById("offence_types").value;
    
    layer.setStyle(regionOffenceTypeColor(feature,offence_type));

}

function resetAreaHighlight(e){
    const layer = e.target;
    const feature = layer.feature;
    const offence_type = document.getElementById("offence_types").value;

    layer.setStyle(area_unitOffenceTypeColor(feature,offence_type));
}

function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
}

function area_unitOnEachFeature(feature, layer, offenceType){
    var popupContent = `<b>Area Unit:</b> ${feature.properties.Area_Unit} <br /> 
                        <b>Year:</b> ${feature.properties.Year} <br /> `;

    if (offenceType === "Abduction, Harassment and Related Offences"){
        popupContent += `<b>Abduction, Harassment and Related Offences:</b> ${feature.properties.Abduction_Harassment_Related} <br />`; 
    } else if (offenceType === "Acts Intended to Cause Injury"){
        popupContent += `<b>Acts Intended to Cause Injury:</b> ${feature.properties.Acts_Intended_to_Cause_Injury} <br />`;
    } else if (offenceType === "Robbery, Extortion and Related Offences") {
        popupContent += `<b>Robbery, Extortion and Related Offences:</b> ${feature.properties.Robbery_Extortion_Related} <br />`;
    } else if (offenceType === "Sexual Assault and Related Offences") {
        popupContent += `<b>Sexual Assault and Related Offences:</b> ${feature.properties.Sexual_Assault_Related} <br />`;
    } else if (offenceType === "Theft and Related Offences") {
        popupContent += `<b>Theft and Related Offences:</b> ${feature.properties.Theft_Related} <br />`;
    } else if (offenceType === "Unlawful Entry With Intent") {
        popupContent += `<b>Unlawful Entry With Intent:</b> ${feature.properties.Unlawful_Entry_With_Intent} <br />`;
    } else {
        // If "all", display all offense types
        popupContent += `<b>Total Crime:</b> ${feature.properties.annual_area_victimisations} <br />
                        <b>----------------</b> <br>
                        <b>Abduction, Harassment and Related Offences:</b> ${feature.properties.Abduction_Harassment_Related} <br />
                        <b>Acts Intended to Cause Injury:</b> ${feature.properties.Acts_Intended_to_Cause_Injury} <br />
                        <b>Robbery, Extortion and Related Offences:</b> ${feature.properties.Robbery_Extortion_Related} <br />
                        <b>Sexual Assault and Related Offences:</b> ${feature.properties.Sexual_Assault_Related} <br />
                        <b>Theft and Related Offences:</b> ${feature.properties.Theft_Related} <br />
                        <b>Unlawful Entry With Intent:</b> ${feature.properties.Unlawful_Entry_With_Intent} <br />`;
    }

    layer.bindPopup(popupContent);

    layer.on('mouseover', function (e){
        highlightFeature(e);
        this.openPopup();
    });

    layer.on('mouseout', function (e) {
        resetAreaHighlight(e);
        this.closePopup();
    });

    layer.on('click', function (e){
        zoomToFeature(e);
    });
}

function regionOnEachFeature(feature, layer, offenceType){
    let popupContent = `<b>Region:</b> ${feature.properties.Region} <br /> 
                        <b>Year:</b> ${feature.properties.Year} <br />`; 
                        
    if (offenceType === "Abduction, Harassment and Related Offences"){
        popupContent += `<b>Abduction, Harassment and Related Offences:</b> ${feature.properties.Abduction_Harassment_Related} <br />`; 
    } else if (offenceType === "Acts Intended to Cause Injury"){
        popupContent += `<b>Acts Intended to Cause Injury:</b> ${feature.properties.Acts_Intended_to_Cause_Injury} <br />`;
    } else if (offenceType === "Robbery, Extortion and Related Offences") {
        popupContent += `<b>Robbery, Extortion and Related Offences:</b> ${feature.properties.Robbery_Extortion_Related} <br />`;
    } else if (offenceType === "Sexual Assault and Related Offences") {
        popupContent += `<b>Sexual Assault and Related Offences:</b> ${feature.properties.Sexual_Assault_Related} <br />`;
    } else if (offenceType === "Theft and Related Offences") {
        popupContent += `<b>Theft and Related Offences:</b> ${feature.properties.Theft_Related} <br />`;
    } else if (offenceType === "Unlawful Entry With Intent") {
        popupContent += `<b>Unlawful Entry With Intent:</b> ${feature.properties.Unlawful_Entry_With_Intent} <br />`;
    } else {
        // If "all", display all offense types
        popupContent += `<b>Total Crime:</b> ${feature.properties.annual_region_victimisations} <br />
                        <b>----------------</b> <br>
                        <b>Abduction, Harassment and Related Offences:</b> ${feature.properties.Abduction_Harassment_Related} <br />
                        <b>Acts Intended to Cause Injury:</b> ${feature.properties.Acts_Intended_to_Cause_Injury} <br />
                        <b>Robbery, Extortion and Related Offences:</b> ${feature.properties.Robbery_Extortion_Related} <br />
                        <b>Sexual Assault and Related Offences:</b> ${feature.properties.Sexual_Assault_Related} <br />
                        <b>Theft and Related Offences:</b> ${feature.properties.Theft_Related} <br />
                        <b>Unlawful Entry With Intent:</b> ${feature.properties.Unlawful_Entry_With_Intent} <br />`;
    }


    layer.bindPopup(popupContent)

    layer.on('mouseover', function (e){
        highlightFeature(e);
        this.openPopup();
    });

    layer.on('mouseout', function (e) {
        resetRegionHighlight(e);
        this.closePopup();
    });

    layer.on('click', function (e){
        zoomToFeature(e);

        // cancle onEachFeature
        layer.off({
            mouseover: highlightFeature, 
            mouseout: resetRegionHighlight,  
        });

        map.removeLayer(layer);

        const region_name = e.target.feature.properties.Region;
        const currentYear = e.target.feature.properties.Year;
        allArea_unitCrimeLayer(currentYear, region_name, offenceType);

        mapView.style.flex = '2';
        graphView.style.display = 'flex';
        graphView.offsetHeight;
        graphView.style.flex = '1';

        crimeTrend(region_name, currentYear);
        crimeTypePieChart(region_name, currentYear);
        
    });

}

function allArea_unitCrimeLayer(year, regionName, offenceType = "All Offence Types"){

    area_unitLayer = L.Geoserver.wfs("http://localhost:8080/geoserver/wfs", {
        layers: "nz_crime:Final_area_unit",
        CQL_FILTER: "Year = " + year + " AND Region = '" + regionName + "'",
        style: function(feature) {
            return area_unitOffenceTypeColor(feature, offenceType);
        },
        onEachFeature: function(feature, layer){
            area_unitOnEachFeature(feature, layer, offenceType);
        },
        success: function(data) {
            console.log("WFS data loaded successfully.");
        },
        error: function(err) {
            console.error("Error loading WFS data:", err);
        }
    }).addTo(map);
}

function area_unitCrimeLayer(year, regionName, areaUnit, offenceType = "All Offence Types"){

    area_unitLayer = L.Geoserver.wfs("http://localhost:8080/geoserver/wfs", {
        layers: "nz_crime:Final_area_unit",
        CQL_FILTER: "Year = " + year + " AND Region = '" + regionName + "' AND Area_Unit = '" + areaUnit + "'",
        style: function(feature) {
            return area_unitOffenceTypeColor(feature, offenceType);
        },
        onEachFeature: function(feature, layer){
            area_unitOnEachFeature(feature, layer, offenceType);
        },
        success: function(data) {
            console.log("WFS data loaded successfully.");
        },
        error: function(err) {
            console.error("Error loading WFS data:", err);
        }
    }).addTo(map);
}

function allRegionCrimeLayer(year, offenceType = "All Offence Types"){
    if (regionLayer){
        map.removeLayer(regionLayer);
    }

    regionLayer = L.Geoserver.wfs("http://localhost:8080/geoserver/wfs", {
        layers: "nz_crime:Final_region",
        CQL_FILTER: "Year = " + year,
        style: function(feature) {
            return regionOffenceTypeColor(feature, offenceType);
        },
        onEachFeature: function(feature, layer){
            regionOnEachFeature(feature, layer, offenceType);
        },
        success: function(data) {
            console.log("WFS data loaded successfully.");
        },
        error: function(err) {
            console.error("Error loading WFS data:", err);
        }
    }).addTo(map);
}

function regionCrimeLayer(year, regionName, offenceType = "All Offence Types"){
    if (regionLayer){
        map.removeLayer(regionLayer);
    }

    regionLayer = L.Geoserver.wfs("http://localhost:8080/geoserver/wfs", {
        layers: "nz_crime:Final_region",
        CQL_FILTER: "Year = " + year + " AND Region = '" + regionName + "'",
        style: function(feature) {
            return regionOffenceTypeColor(feature, offenceType);
        },
        onEachFeature: function(feature, layer){
            regionOnEachFeature(feature, layer, offenceType);
        },
        success: function(data) {
            console.log("WFS data loaded successfully.");
        },
        error: function(err) {
            console.error("Error loading WFS data:", err);
        }
    }).addTo(map);
}

export {allArea_unitCrimeLayer, area_unitCrimeLayer, allRegionCrimeLayer, regionCrimeLayer, regionLayer, area_unitLayer};

