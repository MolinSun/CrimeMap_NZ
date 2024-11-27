const locationData = {
    "All NZ": ["All suburbs"],
};

const regions = ['All NZ','Auckland Region', 'Bay of Plenty Region', 'Canterbury Region',
    'Gisborne Region', 'Hawke Bay Region', 'Manawatū-Whanganui Region', 'Marlborough Region',
    'Nelson Region', 'Northland Region', 'Otago Region', 'Southland Region', 'Taranaki Region',
    'Tasman Region', 'Waikato Region', 'Wellington Region', 'West Coast Region'
];

const yearsLabel = [2020, 2021, 2022, 2023];
let nationwideData = Array(yearsLabel.length).fill(0);
let nationwideTypeData = {};
let regionTotals = {};
let regionCrimeType = {};

const geoServerWFSRegionsUrl = 'http://localhost:8080/geoserver/nz_crime/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nz_crime:Final_region&outputFormat=application/json';
async function fetchCrimeData(){
    try {
        const response = await fetch(geoServerWFSRegionsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const features = data.features;

        // calculate annual crime data
        features.forEach((feature) => {
            const currentYear = feature.properties.Year;
            const victimisations = feature.properties.annual_region_victimisations;
            const regionName = feature.properties.Region;
            const crimeTypes = {
                'Abduction, Harassment and Related Offences': feature.properties.Abduction_Harassment_Related,
                'Acts Intended to Cause Injury': feature.properties.Acts_Intended_to_Cause_Injury,
                'Robbery, Extortion and Related Offences': feature.properties.Robbery_Extortion_Related,
                'Sexual Assault and Related Offences': feature.properties.Sexual_Assault_Related,
                'Theft and Related Offences': feature.properties.Theft_Related,
                'Unlawful Entry With Intent': feature.properties.Unlawful_Entry_With_Intent,
            };

            const yearIndex = yearsLabel.indexOf(currentYear);
            if (yearIndex !== -1) {
                nationwideData[yearIndex] += victimisations;
            }
            if (!regionTotals[regionName]){
                regionTotals[regionName] = [];
            }
            regionTotals[regionName][yearIndex] = victimisations;

            if(!regionCrimeType[regionName]){
                regionCrimeType[regionName] = {};
            }

            Object.keys(crimeTypes).forEach((type) => {
                if(!regionCrimeType[regionName][currentYear]){
                    regionCrimeType[regionName][currentYear] = {};
                }
                if (!nationwideTypeData[type]) {
                    nationwideTypeData[type] = new Array(yearsLabel.length).fill(0); // Proper initialization
                }
                if (yearIndex !== -1) {
                    nationwideTypeData[type][yearIndex] += crimeTypes[type];
                }


                regionCrimeType[regionName][currentYear][type] = crimeTypes[type];
            });
        });

        console.log('Updated nationwide crime data:', nationwideData);
        console.log('Updated crime data in regions:', regionTotals);
        console.log('Updated crime data by types:', regionCrimeType);
        console.log('Updated nationwide crime data by types', nationwideTypeData);

    } catch (error) {
        console.error('Failed to fetch crime data:', error);
    }
}


// GeoServer WFS URL
const geoServerWFSAreaUnitUrl = 'http://localhost:8080/geoserver/nz_crime/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nz_crime:Final_area_unit_geo_data&outputFormat=application/json';

function fetchAndAppendAreaUnits(){
    fetch(geoServerWFSAreaUnitUrl)
        .then(response => response.json())
        .then(data => {
            const features = data.features;
            features.forEach(feature => {

                const region = feature.properties.Region;
                const areaUnit = feature.properties.Area_Unit;

                if(!locationData[region]){
                    locationData[region] = ['All suburbs'];
                }

                if(!locationData[region].includes(areaUnit)){
                    locationData[region].push(areaUnit);
                }
    
            });
        })
        .catch(error => {
            console.error('Error fetching data from Geoserver:', error);
        });
}

async function updateLocationData() {
    fetchCrimeData();
    await fetchAndAppendAreaUnits();
    console.log('Update locationData:', locationData);
}

updateLocationData();

export {locationData, yearsLabel, nationwideData, nationwideTypeData, regionTotals, regionCrimeType};