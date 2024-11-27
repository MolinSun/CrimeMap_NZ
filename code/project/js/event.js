import {allRegionCrimeLayer, regionCrimeLayer, area_unitCrimeLayer, regionLayer, area_unitLayer} from "./crime_layer.js";
import { locationData } from "./data.js";
import { nationwideCrimeTrend,nationwideCrimeTypePieChart } from "./crimeGraphs.js";
import { mapView, graphView } from "./crime_layer.js";

const regions = ['All NZ','Auckland Region', 'Bay of Plenty Region', 'Canterbury Region',
    'Gisborne Region', 'Hawke Bay Region', 'Manawatū-Whanganui Region', 'Marlborough Region',
    'Nelson Region', 'Northland Region', 'Otago Region', 'Southland Region', 'Taranaki Region',
    'Tasman Region', 'Waikato Region', 'Wellington Region', 'West Coast Region'
];

const submitButton = document.getElementById("submission");
const region_input = document.getElementById("region_input");
const suburb_input = document.getElementById("suburb_input");
const region_dropdown = document.getElementById("region_button");
const suburb_dropdown = document.getElementById("suburb_button");
const regionSuggestions = document.getElementById("region_suggestions");
const suburbSuggeations = document.getElementById("suburb_suggestions");


function calcuRegionSuggestions(filterRegions){
    regionSuggestions.innerHTML = "";

    if(filterRegions.length > 0){

        regionSuggestions.style.display = 'block';
        filterRegions.forEach((filterRegion) => {
            const suggestion = document.createElement('div');
            suggestion.textContent = filterRegion;
            suggestion.addEventListener('click', () => {
                region_input.value = filterRegion;
                regionSuggestions.style.display = 'none';

                const selectedRegion = region_input.value.trim().toLowerCase();

                const isValidRegion = regions.some(region => 
                    region.toLowerCase() === selectedRegion
                );

                if(isValidRegion && selectedRegion !== 'all nz') {
                    suburb_input.disabled = false;
                    suburb_dropdown.disabled = false;
                }else{
                    suburb_input.disabled = true;
                    suburb_dropdown.disabled = true;
                    suburb_input.value = "All suburbs";
                }
            })

            regionSuggestions.appendChild(suggestion);
        })
    }else{
        regionSuggestions.display = 'none';
    }
}

function calcuSuburbSuggestions(filterSuburbs){
    suburbSuggeations.innerHTML = "";

    if(filterSuburbs.length > 0){

        suburbSuggeations.style.display = 'block';
        filterSuburbs.forEach(filterSuburb => {
            const suggestion = document.createElement('div');
            suggestion.textContent = filterSuburb;
            suggestion.onclick = () => {
                suburb_input.value = filterSuburb;
                suburbSuggeations.style.display = 'none';
            }

            suburbSuggeations.appendChild(suggestion);
        });
    }else{
        suburbSuggeations.display = 'none';
    }
}

region_input.addEventListener('input', () => {

    const query = region_input.value.toLowerCase();

    const filterRegions = regions.filter(region => 
        region.toLocaleLowerCase().startsWith(query)
    );

    calcuRegionSuggestions(filterRegions);

    console.log(region_input.value);
})

suburb_input.addEventListener('input', () => {
    const query = suburb_input.value.toLowerCase();

    const areaUnits = locationData[region_input.value];

    const filterSuburbs = areaUnits.filter(areaUnit => 
        areaUnit.toLowerCase().startsWith(query)
    );

    calcuSuburbSuggestions(filterSuburbs);
})

region_dropdown.addEventListener('click', () => {

    if(region_input.value.trim() === "All NZ"){
        if(regionSuggestions.style.display === 'none' || !regionSuggestions.innerHTML){
            calcuRegionSuggestions(regions);
        }else{
            regionSuggestions.style.display = 'none';
        }
    }else{
        if(regionSuggestions.style.display === 'block'){
            regionSuggestions.style.display = 'none';
        }else if(regionSuggestions.style.display === 'none'){
            regionSuggestions.style.display = 'block';
        }
    }
})

suburb_dropdown.addEventListener('click', () => {
    if(suburb_input.value === "All suburbs"){
        if(suburbSuggeations.style.display === "none" || !suburbSuggeations.innerHTML){
            calcuSuburbSuggestions(locationData[region_input.value]);
        }else{
            suburbSuggeations.style.display = "none";
        }

    }else{
        if(suburbSuggeations.style.display === 'block'){
            suburbSuggeations.style.display = 'none';
        }else if(suburbSuggeations.style.display === 'none'){
            suburbSuggeations.style.display = 'block';
        }
    }
});

submitButton.addEventListener('click', (event) => {

    if(regionLayer && area_unitLayer){
        map.removeLayer(regionLayer);
        map.removeLayer(area_unitLayer);
    }

    const regionName = document.getElementById("region_input").value;
    const area_unit = document.getElementById("suburb_input").value;
    console.log(regionName);
    console.log(area_unit);
    const selectedYear = document.getElementById("year").value;
    const offence_type = document.getElementById("offence_types").value;
    const mapView = document.getElementById('nz_region');
    const graphView = document.getElementById("graph_view");

    const isValidRegion = regions.some(region =>
        region.toLowerCase() === regionName.trim().toLowerCase()
    );

    const isValidSuburb = locationData[regionName].some(suburb => 
        suburb.toLowerCase() === area_unit.trim().toLowerCase()
    );
    
    if(isValidRegion && isValidSuburb){
        if(regionName === "All NZ"){
            allRegionCrimeLayer(selectedYear, offence_type);
        }else if(area_unit === "All suburbs"){
            regionCrimeLayer(selectedYear, regionName, offence_type);
        }else{
            area_unitCrimeLayer(selectedYear, regionName, area_unit, offence_type);
        }
    } 
    
    mapView.style.flex = '2';
    graphView.style.display = 'flex';
    graphView.offsetHeight;
    graphView.style.flex = '1';
    
    nationwideCrimeTrend(offence_type, selectedYear);
    nationwideCrimeTypePieChart(selectedYear);
})

document.addEventListener('click', (event) => {
    if(!event.target.closest('.conditions')){
        regionSuggestions.style.display = 'none';
    }
});

regionSuggestions.addEventListener('wheel', (event) => {
    event.stopPropagation();
});

suburbSuggeations.addEventListener('wheel', (event) => {
    event.stopPropagation();
});