window.addEventListener('DOMContentLoaded', () => console.log(""));

const stateBoundaryGeoJSON = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'

const countryMap = d3.select('#us-map');
let stateBoundaries;

async function getData() {
    try{
      let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct WHERE location NOT IN ('BP2','DD2','GU','AS','FM','IH2','MH','MP','PR','PW','VA2','VI','UM') ORDER BY date DESC, location LIMIT 52`);
      return response.json();
    }catch(err){
      console.error(err);
      // Handle errors here
    }
  }

  let drawMap = () => {
    countryMap.selectAll('path')
        .data(stateBoundaries)
        .enter()
        .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'state')
  }
  let percentVaccinated = getData().then(res => res);


  d3.json(stateBoundaryGeoJSON).then(
    (data, error) => {
        if(error) {
            console.log(log);
        } else {
            stateBoundaries = data.features;
            console.log(stateBoundaries);
            drawMap();
        }
    }
  )


  


 