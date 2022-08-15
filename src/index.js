window.addEventListener('DOMContentLoaded', () => {

const stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'
const svg = d3.select('#canvas')
const projection = d3.geoAlbers().scale(1250).translate([500,300])
let stateBoundaries;
let pctPopVax;

const getData = async () => {
    try{
        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct WHERE location NOT IN ('BP2','DD2','GU','AS','FM','IH2','MH','MP','PR','PW','VA2','VI','UM') ORDER BY date DESC, location LIMIT 52`);
        return response.json();
    }catch(err){
        console.error(err);
    }
}

getData().then(res => console.log(res[0]['series_complete_pop_pct']))

let y = getData().then(res => console.log(res.find(state => {
    return state['location'] === 'CA';
})['series_complete_pop_pct']));

    console.log(y)


let drawMap = () => {
    console.log(stateBoundaries)
    svg.selectAll("path")
    .data(stateBoundaries)
    .enter().append('path')
    .attr('d', d3.geoPath().projection(projection))
    .attr('class','state')
    .attr('fill', 'darkslateblue')
    .attr('fill', (stateObj) => {
        let name = stateObj['STUSPS']
        getData().then(res => res.find(state => {
            return state['location'] === name;
        }))
    })

}



d3.json(stateBoundaryURL).then(
    (data, error) => {
        if(error) {
            console.log(log);
        } else {
            stateBoundaries = data.features;
            drawMap();
        }
    }
)





})