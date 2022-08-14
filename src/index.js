window.addEventListener('DOMContentLoaded', () => {

const stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'


let svg = d3.select('#canvas')

let stateBoundaries;

// async function getData() {
//     try{
//       let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct WHERE location NOT IN ('BP2','DD2','GU','AS','FM','IH2','MH','MP','PR','PW','VA2','VI','UM') ORDER BY date DESC, location LIMIT 52`);
//       return response.json();
//     }catch(err){
//       console.error(err);
//       // Handle errors here
//     }
//   }
// let projection = d3.geoEquirectangular();
  let drawMap = () => {

    svg.selectAll("path")
    .data(stateBoundaries)
    .enter().append('path')
    .attr('d', d3.geoPath())

  }

//   let percentVaccinated = getData().then(res => res);


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