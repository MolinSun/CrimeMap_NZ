//map style
function getRegionColor(popCrime) {
    return popCrime > 100000 ? '#990000' :
        popCrime > 60000  ? '#B20000' : 
        popCrime > 40000  ? '#CC0000' :
        popCrime > 30000  ? '#E60000' :
        popCrime > 15000  ? '#FF0000' : 
        popCrime > 10000  ?'#FF1919':
        popCrime > 7000  ? '#FF3333' :
        popCrime > 6000  ?'#FF4C4C':
        popCrime > 5000  ?'#FF6666':
        popCrime > 4000  ?'#FF7F7F':
        popCrime > 3000  ?'#FF9999':
        popCrime > 2000  ?'#FFB2B2':
        popCrime > 1000  ?'#FFCCCC':'#FFE5E5';

}

function getRegionOffenceTypeColor(popCrime){
    return popCrime > 30000 ? '#990000' :
        popCrime > 20000 ? '#B20000' :
        popCrime > 10000 ? '#CC0000' :
        popCrime > 5000 ? '#E60000' :
        popCrime > 1000 ? '#FF1919' :
        popCrime > 500 ? '#FF4C4C' :
        popCrime > 100 ? '#FF7F7F':
        popCrime > 50 ? '#FFB2B2' :
        popCrime > 10 ? '#FFCCCC':'#FFE5E5';

}

function getAreaUnitColor(popCrime) {
    return popCrime > 4000 ? '#990000' :
        popCrime > 3000  ? '#B20000' : 
        popCrime > 2000  ? '#CC0000' :
        popCrime > 1000  ? '#E60000' :
        popCrime > 500  ? '#FF0000' :
        popCrime > 100 ?  '#FF3333' :
        popCrime > 50  ? '#FF7F7F':'#FFCCCC';

}

function getAreaUnitOffenceTypeColor(popCrime){
    return popCrime > 3000 ? '#990000' :
        popCrime > 2000 ? '#B20000' :
        popCrime > 1000 ? '#CC0000' :
        popCrime > 500 ? '#E60000' : 
        popCrime > 100 ? '#FF3333' :
        popCrime > 50 ? '#FF7F7F' :
        popCrime > 0 ? '#FFB2B2':'#FFE5E5';
}

function regionOffenceTypeColor(feature, offenceType = "All Offence Types"){

    let crimeCount;

    if(offenceType === "Abduction, Harassment and Related Offences"){
        crimeCount = feature.properties.Abduction_Harassment_Related;
    }else if(offenceType === "Acts Intended to Cause Injury"){
        crimeCount = feature.properties.Acts_Intended_to_Cause_Injury;
    }else if(offenceType === "Robbery, Extortion and Related Offences"){
        crimeCount = feature.properties.Robbery_Extortion_Related;
    }else if(offenceType === "Sexual Assault and Related Offences"){
        crimeCount = feature.properties.Sexual_Assault_Related;
    }else if(offenceType === "Theft and Related Offences"){
        crimeCount = feature.properties.Theft_Related;
    }else if(offenceType === "Unlawful Entry With Intent"){
        crimeCount = feature.properties.Unlawful_Entry_With_Intent;
    }else{
        crimeCount = feature.properties.annual_region_victimisations;
    }

    const baseStyle = {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }

    const fillColor = (offenceType === "All Offence Types")
        ?getRegionColor(crimeCount)
        :getRegionOffenceTypeColor(crimeCount);

    return{
        ...baseStyle,
        fillColor,
    };
}

function area_unitOffenceTypeColor(feature, offenceType = "All Offence Types"){

    let crimeCount;

    if(offenceType === "Abduction, Harassment and Related Offences"){
        crimeCount = feature.properties.Abduction_Harassment_Related;
    }else if(offenceType === "Acts Intended to Cause Injury"){
        crimeCount = feature.properties.Acts_Intended_to_Cause_Injury;
    }else if(offenceType === "Robbery, Extortion and Related Offences"){
        crimeCount = feature.properties.Robbery_Extortion_Related;
    }else if(offenceType === "Sexual Assault and Related Offences"){
        crimeCount = feature.properties.Sexual_Assault_Related;
    }else if(offenceType === "Theft and Related Offences"){
        crimeCount = feature.properties.Theft_Related;
    }else if(offenceType === "Unlawful Entry With Intent"){
        crimeCount = feature.properties.Unlawful_Entry_With_Intent;
    }else{
        crimeCount = feature.properties.annual_area_victimisations;
    }

    const baseStyle = {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }

    const fillColor = (offenceType === "All Offence Types")
        ?getAreaUnitColor(crimeCount)
        :getAreaUnitOffenceTypeColor(crimeCount);

    return{
        ...baseStyle,
        fillColor,
    };

}

export {
    regionOffenceTypeColor,
    area_unitOffenceTypeColor
};