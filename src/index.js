window.addEventListener('DOMContentLoaded', async () => {

const stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'
const svg = d3.select('#canvas')
const projection = d3.geoAlbers().scale(1250).translate([500,300])
let stateBoundaries;
let pctPopVax;

const getVaxData = async () => {
    try{
        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct WHERE location NOT IN ('BP2','DD2','GU','AS','FM','IH2','MH','MP','PR','PW','VA2','VI','UM') ORDER BY date DESC, series_complete_pop_pct DESC LIMIT 52`);
        let z = response.json();
        return z;
    }catch(err){
        console.error(err);
    }
}

let data =  await getVaxData();

const range = data[0].series_complete_pop_pct - data[51].series_complete_pop_pct
const quintile = range/5;


let drawMap = () => {
    // console.log(stateBoundaries)
    svg.selectAll("path")
    .data(stateBoundaries)
    .enter().append('path')
    .attr('d', d3.geoPath().projection(projection))
    .attr('stroke-width', '4.0')
    .attr('class','state')
    .attr('fill', (stateObj) => {
        
        let name = stateObj['properties'].STUSPS
        // if (name <= 'M') {
        //     return 'tomato'
        // } else {
        //     return 'darkslateblue'
        // }
        
        let state = data.find(state => state['location'] === name)
        let pct = state['series_complete_pop_pct']
        if (pct < 80) return 'firebrick'
            // pct = state.series_complete_pop_pct
            // if (pct < 70) {
            //     return('red')
            // }
        })
    //     const res = await getVaxData();
    //     let state = res.find(state => state['location'] === 'LA')
    //     pct = state.series_complete_pop_pct
    //     if (pct < 70) { let abc = () => {
    //         console.log('red')
    //     }
    //     return abc();
    // }
    
    .attr("data-tooltip", (d) => d['properties'].STUSPS)
}





d3.json(stateBoundaryURL).then(
    (data, error) => {
        if(error) {
            console.log(error);
        } else {
            stateBoundaries = data.features;
            drawMap();
        }
    }
    )
    
    
    // let orange = () => {
    // let bananana = () => {
    // console.log('inside')
    // }
    // return bananana();
    // }
    // orange();
    
    
})