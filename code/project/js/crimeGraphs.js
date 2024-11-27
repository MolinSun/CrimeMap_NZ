import {yearsLabel, nationwideData, nationwideTypeData, regionTotals, regionCrimeType} from "./data.js";

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
    
    crimeChart = new Chart('lineChart', {
        type: 'line',
        data:{
            labels:yearsLabel,
            datasets: [
                {
                    label: 'Total crime victimisations',
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
                text: "Last 4 year crime trend in New Zealand"
            }
        },
    },
    })
}

function nationwideCrimeTypePieChart(year){


    if(crimePieChart){
        crimePieChart.destroy(); 
        crimePieChart = null;
    }
    
    const yearIndex = yearsLabel.indexOf(Number(year));

    console.log("current year", year);

    if (yearIndex === -1) {
        console.error("Invalid yearIndex. The selected year is not found in yearsLabel.");
        return; // 停止执行代码
    }

    const nationwideTypeCrimeData = {};
    crimeTypeArray.forEach((type) => {
        nationwideTypeCrimeData[type] = nationwideTypeData[type][yearIndex]; 
    })

    console.log(year);
    console.log(yearIndex);
    console.log(nationwideTypeCrimeData)

    crimePieChart = new Chart('pieChart', {
        type: 'pie',
        data:{
            labels: crimeTypeArray,
            datasets:[{
                data: Object.values(nationwideTypeCrimeData),
                backgroundColor: colors,
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
                    text: "Offence types in New Zealand"
                }
            }
        }
    });
}


function crimeTrend(regionName, offenceType, year){

    if(crimeChart){
        crimeChart.destroy(); 
        crimeChart = null;
    }

    const yearIndex = yearsLabel.indexOf(year);
    
    crimeChart = new Chart('lineChart', {
        type: 'line',
        data:{
            labels:yearsLabel,
            datasets: [
                {
                    label: 'Total Crimes Nationwide',
                    data: nationwideData,
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                    pointBackgroundColor: yearsLabel.map((_, i) =>
                        i === yearIndex ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 0.5)'
                    ), // Highlight specific year's point
                    pointRadius: yearsLabel.map((_, i) => (i === yearIndex ? 8 : 3)), // Make the point bigger for the selected year
                    pointHoverRadius: yearsLabel.map((_, i) => (i === yearIndex ? 10 : 5)), // Hover size
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Total Crimes in ' + regionName,
                    data: regionTotals[regionName],
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
                text: "Recent 4 year crime trend"
            }
        },
    },
    })
}

function crimeTypePieChart(regionName, year){

    if(crimePieChart){
        crimePieChart.destroy(); 
        crimePieChart = null;
    }
    const crimeData = regionCrimeType[regionName][year];
    const crimeValues = Object.values(crimeData);

    crimePieChart = new Chart('pieChart', {
        type: 'pie',
        data:{
            labels: crimeTypeArray,
            datasets:[{
                data: crimeValues,
                backgroundColor: colors,
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
                    text: "Offence types in " + regionName
                }
            }
        }
    });
}

export {nationwideCrimeTrend, nationwideCrimeTypePieChart, crimeTrend, crimeTypePieChart};

