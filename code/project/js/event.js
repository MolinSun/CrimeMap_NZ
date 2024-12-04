import {allRegionCrimeLayer, regionCrimeLayer, area_unitCrimeLayer, regionLayer, area_unitLayer} from "./crime_layer.js";
import { locationData } from "./data.js";
import { areaUnitCrimeTrend, areaUnitCrimeTypePieChart, regionCrimeTrend, regionCrimeTypePieChart, nationwideCrimeTrend,nationwideCrimeTypePieChart } from "./crimeGraphs.js";

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
const full_mapView_button = document.getElementById("map_full_screen");
const icon = full_mapView_button.querySelector("i");
const menu_button = document.getElementById("menu-button");
const filter = document.getElementById("filter_container");
const modal = document.getElementById('overview-modal');
const info_button = document.getElementById('info-button');


window.addEventListener('load', () => {
    modal.style.display = 'flex';
});

document.addEventListener('DOMContentLoaded', () => {
    const infoButton = document.getElementById('info-button');
    const modal = document.getElementById('overview-modal');
    const closeModal = document.getElementById('close-modal');

    // Show modal when clicking the info button
    infoButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) { // Ensure the target is the modal background
            modal.style.display = 'none';
        }
    });
});

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

menu_button.addEventListener('click', () => {

    const currentDisplay = window.getComputedStyle(filter).display;

    if(currentDisplay === 'flex'){
        filter.style.display = 'none';
    }else{
        filter.style.display = 'flex';
    }
})

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
    const full_mapView_toggle = document.getElementById("map-fullscreen--toggle");

    const isValidRegion = regions.some(region =>
        region.toLowerCase() === regionName.trim().toLowerCase()
    );

    const isValidSuburb = locationData[regionName].some(suburb => 
        suburb.toLowerCase() === area_unit.trim().toLowerCase()
    );
    
    if(isValidRegion && isValidSuburb){
        if(regionName === "All NZ"){
            allRegionCrimeLayer(selectedYear, offence_type);
            mapView.style.flex = '2';
            graphView.style.display = 'flex';
            graphView.offsetHeight;
            graphView.style.flex = '1';

            if(full_mapView_toggle.style.display === "none"){
                full_mapView_toggle.style.display = "flex";
            }

            const computedDisplay = window.getComputedStyle(full_mapView_toggle).display;

            console.log("Inline Display Value:", full_mapView_toggle.style.display);

            nationwideCrimeTrend(offence_type, selectedYear);
            nationwideCrimeTypePieChart(offence_type, selectedYear);
            
        }else if(area_unit === "All suburbs"){
            console.log(selectedYear);
            regionCrimeLayer(selectedYear, regionName, offence_type);
            mapView.style.flex = '2';
            graphView.style.display = 'flex';
            graphView.offsetHeight;
            graphView.style.flex = '1';
    
            if(full_mapView_toggle.style.display === "none"){
                full_mapView_toggle.style.display = "flex";
            }

            regionCrimeTrend(regionName, offence_type, selectedYear);
            regionCrimeTypePieChart(regionName,offence_type, selectedYear);
        }else{
            area_unitCrimeLayer(selectedYear, regionName, area_unit, offence_type);
            mapView.style.flex = '2';
            graphView.style.display = 'flex';
            graphView.offsetHeight;
            graphView.style.flex = '1';

            if(full_mapView_toggle.style.display === "none"){
                full_mapView_toggle.style.display = "flex";
            }

            areaUnitCrimeTrend(area_unit, offence_type, selectedYear);
            areaUnitCrimeTypePieChart(area_unit, offence_type, selectedYear);
        
        }
    } 

});

full_mapView_button.addEventListener('click', () => {
    const graphView = document.getElementById("graph_view");
    if(graphView.style.display === 'none'){
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
        graphView.style.display = 'flex';
        
    }else{
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
        graphView.style.display = 'none';
    }
});

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

// Close modal if clicking outside the content
window.addEventListener('click', (event) => {
    if(event.target === modal) {
        modal.style.display = 'none';
    }
})