
import {yearsLabel, nationwideData, nationwideTypeData, regionTotals, regionCrimeType, areaUnitTotals, areaUnitCrimeType} from "./data.js";

let crimeChart, crimePieChart;

const crimeTypeArray = ['Abduction, Harassment and Related Offences', 'Acts Intended to Cause Injury', 'Robbery, Extortion and Related Offences', 'Sexual Assault and Related Offences', 'Theft and Related Offences', 'Unlawful Entry With Intent'];

const colors = [
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(201, 203, 207, 0.8)'
];


function nationwideCrimeTrend(offenceType, year){

    if(crimeChart){
        crimeChart.destroy(); 
        crimeChart = null;
    }

    const yearIndex = yearsLabel.indexOf(Number(year));
    if (yearIndex === -1) {
        console.error("Invalid yearIndex. The selected year is not found in yearsLabel.");
        return; // 停止执行代码
    }
    
    crimeChart = new Chart('lineChart', {
        type: 'line',
        data:{
            labels:yearsLabel,
            datasets: [
                {
                    label: offenceType === 'All Offence Types' ? 'Total crime victimisations' : offenceType,
                    data: offenceType === 'All Offence Types' ? nationwideData : nationwideTypeData[offenceType],
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                    pointBackgroundColor: yearsLabel.map((_, i) =>
                        i === yearIndex ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 0.5)'
                    ), // Highlight specific year's point
                    pointRadius: yearsLabel.map((_, i) => (i === yearIndex ? 8 : 3)), // Make the point bigger for the selected year
                    pointHoverRadius: yearsLabel.map((_, i) => (i === yearIndex ? 10 : 5)), // Hover size
                    fill: false,
                    tension: 0.4
                }
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                display: false,
            },
            scales:{    //配置x轴和y轴
                x:{
                    display: true,  //是否显示轴
                    title:{         //轴标题
                        display: true,
                        text: 'year'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'total crime victimisations'
                    }
                }
            },
            title: {
                display: true,
                text: offenceType === 'All Offence Types' ? "Last 4 year crime trend in New Zealand" : offenceType + " crime trend"
            }
        },
    },
    })
}

function nationwideCrimeTypePieChart(offenceType, year){


    if(crimePieChart){
        crimePieChart.destroy(); 
        crimePieChart = null;
    }
    
    const yearIndex = yearsLabel.indexOf(Number(year));

    if (yearIndex === -1) {
        console.error("Invalid yearIndex. The selected year is not found in yearsLabel.");
        return; 
    }

    
    const data = crimeTypeArray.map(type => nationwideTypeData[type][yearIndex]); 
    let backgroundColors;

    if (offenceType === "All Offence Types") {
        backgroundColors = colors;
    } else {
        const offenceIndex = crimeTypeArray.indexOf(offenceType);
        backgroundColors = crimeTypeArray.map(type =>
            type === offenceType ? colors[offenceIndex] : "rgba(200, 200, 200, 0.5)" 
        );
    }

    crimePieChart = new Chart('pieChart', {
        type: 'doughnut',
        data:{
            labels: crimeTypeArray,
            datasets:[{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1, // Border width for each slice
                borderColor: 'rgba(255, 255, 255, 1)' // Border color
            }] 
        },
        options:{
            responsive: false, 
            maintainAspectRatio: false, 
            plugins: {
                legend: {
                    display: false 
                },
                tooltip: {
                        enabled: true // Show tooltips when hovering
                },
                title: {
                    display: true,
                    text: "Offence Types in " + year
                }
            },
            cutout: '50%' 
        }
    });
}


function regionCrimeTrend(regionName, offenceType, year){

    if(crimeChart){
        crimeChart.destroy(); 
        crimeChart = null;
    }
    let data = {}
    if(offenceType !== "All NZ"){
        yearsLabel.forEach((yearLabel) => {
            data[yearLabel] = regionCrimeType[regionName][yearLabel][offenceType];
        })
    }
    console.log("data: ", data);
    const yearIndex = yearsLabel.indexOf(Number(year)); 

    if (yearIndex === -1) {
        console.error("Invalid yearIndex. The selected year is not found in yearsLabel.");
        return; 
    }
    
    crimeChart = new Chart('lineChart', {
        type: 'line',
        data:{
            labels:yearsLabel,
            datasets: [
                {
                    label: offenceType === 'All Offence Types' ? 'Total Crimes in ' + regionName : offenceType + " in " + regionName,
                    data: offenceType === 'All Offence Types' ? regionTotals[regionName] : Object.values(data),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: yearsLabel.map((_, i) =>
                        i === yearIndex ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 0.5)'
                    ), // Highlight specific year's point
                    pointRadius: yearsLabel.map((_, i) => (i === yearIndex ? 8 : 3)), // Make the point bigger for the selected year
                    pointHoverRadius: yearsLabel.map((_, i) => (i === yearIndex ? 10 : 5)), // Hover size
                    fill: false,
                    tension: 0.4
                },
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                scales:{    //配置x轴和y轴
                    x:{
                        display: true,  //是否显示轴
                        title:{         //轴标题
                            display: true,
                            text: 'year'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'total crime victimisations'
                        }
                    }
                },
                title: {
                    display: true,
                    text: offenceType === 'All Offence Types' ? "Last 4 year crime trend in " + regionName : offenceType + " crime trend in " + regionName
                }
            },
        },
    })
}

function regionCrimeTypePieChart(regionName, offenceType, year){

    if(crimePieChart){
        crimePieChart.destroy(); 
        crimePieChart = null;
    }

    console.log("year", year)
    const crimeData = regionCrimeType[regionName][year];
    console.log("crimeData", crimeData);
    const crimeValues = Object.values(crimeData);

    let backgroundColors;

    if (offenceType === "All Offence Types") {
        backgroundColors = colors;
    } else {
        const offenceIndex = crimeTypeArray.indexOf(offenceType);
        backgroundColors = crimeTypeArray.map(type =>
            type === offenceType ? colors[offenceIndex] : "rgba(200, 200, 200, 0.5)" 
        );
    }

    crimePieChart = new Chart('pieChart', {
        type: 'pie',
        data:{
            labels: crimeTypeArray,
            datasets:[{
                data: crimeValues,
                backgroundColor: backgroundColors,
                borderWidth: 1, // Border width for each slice
                borderColor: 'rgba(255, 255, 255, 1)' // Border color
            }] 
        },
        options:{
            responsive: false, // 关闭响应式
            maintainAspectRatio: false, // 关闭默认的宽高比
            plugins: {
                legend: {
                    display: false // Position of the legend (top, left, bottom, right)
                },
                tooltip: {
                        enabled: true // Show tooltips when hovering
                },
                title: {
                    display: true,
                    text: "Offence Types in " + regionName + " in " + year
                }
            },
            cutout: '50%'
        }
    });
}

function areaUnitCrimeTrend(areaUnit, offenceType, year){

    if(crimeChart){
        crimeChart.destroy();
        crimeChart = null;
    }

    let data = {};

    if(offenceType != "All NZ"){
        yearsLabel.forEach((yearLabel) => {
            data[yearLabel] = areaUnitCrimeType[areaUnit][yearLabel][offenceType];
        })
    }

    const yearIndex = yearsLabel.indexOf(Number(year));

    if(yearIndex === -1){
        console.log("Invalid yearIndex, The selected year is not found in yearsLabel.");
        return;
    }

    crimeChart = new Chart('lineChart', {
        type: 'line',
        data:{
            labels:yearsLabel,
            datasets: [ 
            {
                label: offenceType === "All Offence Types" ? 'Total crime victimisations in ' + areaUnit : offenceType + " in " + areaUnit,
                data: offenceType === "All Offence Types" ? areaUnitTotals[areaUnit] : Object.values(data),
                borderColor: 'rgba(255, 99, 132, 1)',
                pointBackgroundColor: yearsLabel.map((_, i) =>
                    i === yearIndex ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 0.5)'
                ),
                pointRadius:yearsLabel.map((_, i) => (i === yearIndex ? 8 : 3)),
                pointHoverRadius: yearsLabel.map((_, i) => (i === yearIndex ? 10 : 5)),
                fill: false,
                tension: 0.4
            },
            ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins:{
                legend: {
                    display: false,
                },
                scales:{
                    x:{
                        display: true,
                        title:{
                            display:true,
                            text: 'year'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'total crime victimisations'
                        }
                    }
                },
                title:{
                    display: true,
                    text: offenceType === 'All Offence Types' ? "Last 4 year crime trend in " + areaUnit : offenceType + " crime trend in " + areaUnit
                }
            },
        },

        
    })

}

function areaUnitCrimeTypePieChart(areaUnit, offenceType, year){
    if (crimePieChart){
        crimePieChart.destroy();
        crimePieChart = null;
    }
    const crimeData = areaUnitCrimeType[areaUnit][year];
    const crimeValues = Object.values(crimeData);

    let backgroundColors;

    if(offenceType === "All Offence Types"){
        backgroundColors = colors;
    }else{
        const offenceIndex = crimeTypeArray.indexOf(offenceType);
        backgroundColors = crimeTypeArray.map(type => 
            type === offenceType ? colors[offenceIndex] : "rgba(200, 200, 200, 0.5)"
        );
    }

    crimePieChart = new Chart('pieChart', {
        type: 'pie',
        data:{
            labels: crimeTypeArray,
            datasets:[{
                data: crimeValues,
                backgroundColor: backgroundColors,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 1)'
            }]
        },
        options:{
            responsive: false,
            maintainAspectRatio: false,
            plugins:{
                legend:{
                    display:false
                },
                tooltip:{
                    enabled: true
                },
                title: {
                    display:true,
                    text: "Offence Types in " + areaUnit + " in " + year
                }
            },
            cutout: '50%'
        }
    });

}

export {nationwideCrimeTrend, nationwideCrimeTypePieChart, regionCrimeTrend, regionCrimeTypePieChart, areaUnitCrimeTrend, areaUnitCrimeTypePieChart};

