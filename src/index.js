window.addEventListener('DOMContentLoaded', async () => {

const stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'

const svg = d3.select('#canvas')
const svg2 = d3.select('#canvas2')
const projection = d3.geoAlbers().scale(1250).translate([500,300])
let stateBoundaries;
let countyBoundaries;

const strongHesitant = async () => {
    try{
        let res = await fetch(`https://data.cdc.gov/resource/q9mh-h2tw.json?$query=SELECT state_code, avg(estimated_strongly_hesitant) GROUP BY state_code`);
        return res.json();
    } catch(err) {
        console.error(err);
    }
}

const vaxHesitationData = await strongHesitant();
console.log(vaxHesitationData);

const getVaxData = async () => {
    try{
        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct, additional_doses_vax_pct WHERE location NOT IN ('BP2','US','DD2','GU','AS','FM','IH2','MH','MP','PW','VA2','VI','UM') ORDER BY date DESC, series_complete_pop_pct DESC LIMIT 52`);
        let z = response.json();
        return z;
    }catch(err){
        console.error(err);
    }
}


let data =  await getVaxData();
const min = +data[51].series_complete_pop_pct;
const max = +data[0].series_complete_pop_pct;
const range = max - min;
const quintile = range/5;
const firstQuint = min + quintile;
const secondQuint = firstQuint + quintile;
const thirdQuint = secondQuint + quintile;
const fourthQuint = thirdQuint + quintile;
console.log(min, firstQuint, secondQuint, thirdQuint, fourthQuint, max);

// console.log(data.find(x => x['location'] === 'WY').series_complete_pop_pct)
console.log(data);
let drawMap = () => {
    console.log(stateBoundaries)
    svg.selectAll("path")
    .data(stateBoundaries)
    .enter().append('path')
    .attr('d', d3.geoPath().projection(projection))
    .attr('stroke-width', '1.5')
    .attr('stroke','black')
    .attr('data-name', d => d['properties'].NAME)
    .attr("data-pct", (d) => {
        let name = d['properties'].STUSPS
        let state = data.find(state => state['location'] === name)
        let pct = (state['series_complete_pop_pct'])
        return pct;
    })
    .attr("data-addpct", (d) => {
        let name = d['properties'].STUSPS
        let state = data.find(state => state['location'] === name)
        let pct = (state['additional_doses_vax_pct'])
        return pct;
    })
    .attr('class','state')
    .on('mouseover', function(x) {
        // that = this
        d3.select('#state-name').text(this.dataset.name)
        d3.select('#state-pct').text(`${this.dataset.pct}%`)
        d3.select('#state-addpct').text(`${this.dataset.addpct}%`)
    })
    .on('mouseout', () => {
        d3.select('#state-name').text('select a state')
    })
    .attr('fill', (stateObj) => {
        
        let name = stateObj['properties']['STUSPS']

        let state = data.find(state => state['location'] === name)
        let pct;
        pct = (state['series_complete_pop_pct'])
        
        if (pct <= firstQuint) return 'firebrick'
        else if (pct <= secondQuint && pct > firstQuint) return '#fc4e2a'
        else if (pct <= thirdQuint && pct > secondQuint) return '#feb24c'
        else if (pct <= fourthQuint && pct > thirdQuint) return '#fed976'
        else if (pct > fourthQuint) return "#ffffb2"
        })


            
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
    

})