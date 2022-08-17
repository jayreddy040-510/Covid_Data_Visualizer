window.addEventListener('DOMContentLoaded', async () => {
    


const stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'

const svg = d3.select('#canvas')
const projection = d3.geoAlbers().scale(1250).translate([500,300])
let stateBoundaries;
let counter = 0;


const strongHesitant = async () => {
    try{
        let res = await fetch(`https://data.cdc.gov/resource/q9mh-h2tw.json?$query=SELECT state_code, avg(estimated_strongly_hesitant) GROUP BY state_code`);
        return res.json();
    } catch(err) {
        console.error(err);
    }
}

const vaxHesitationData = await strongHesitant();
vaxHesitationData.push({state_code: 'PR', avg_estimated_strongly_hestitant: 0})


const getVaxData = async () => {
    try{
        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct, additional_doses_vax_pct,  series_complete_5pluspop_pct, series_complete_18pluspop, series_complete_65pluspop WHERE location NOT IN ('BP2','US','DD2','GU','AS','FM','IH2','MH','MP','PW','VA2','VI','UM') ORDER BY date DESC, series_complete_pop_pct DESC LIMIT 52`);
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
    .attr("data-vaxhes", (d) => {
        let name = d['properties'].STUSPS
        let state = vaxHesitationData.find(state => state['state_code'] === name)
        let vaxHesNumber = state['avg_estimated_strongly_hesitant']
        return Math.floor(+vaxHesNumber * 100) + '%';
     } )
     .attr("data-onePlus", (d) => {
        let name = d['properties'].STUSPS
        let state = data.find(state => state['location'] === name)
        let plus = (state['series_complete_5pluspop_pct'])
        return plus;
    })
    .attr("data-twoPlus", (d) => {
        let name = d['properties'].STUSPS
        let state = data.find(state => state['location'] === name)
        let plus = (state['series_complete_18pluspop'])
        return plus;
    })
    .attr("data-threePlus", (d) => {
        let name = d['properties'].STUSPS
        let state = data.find(state => state['location'] === name)
        let plus = (state['series_complete_65pluspop'])
        return plus;
    })
    .attr('class','state')
    .on('mouseover', function(x) {
        // that = this
        d3.select('#state-name').text(this.dataset.name)
        d3.select('#state-pct').text(`${Math.round(this.dataset.pct)}%`)
        d3.select('#state-addpct').text(`${Math.round(this.dataset.addpct)}%`)
    })
    .on('click', function(e) {
        let donut = [];
        donut.push(+(e.target.dataset.onePlus), +(e.target.dataset.twoPlus), +(e.target.dataset.threePlus))
        counter++
        const data22 = {
            labels: [
              '% of pop. older than 5 vaccinated',
              '% of pop. older than 18 vaccinated',
              '% of pop. older than 65 vaccinated'
            ],
            datasets: [{
              label: 'Vaccination by Age Demographic',
              data: donut,
              backgroundColor: [
                'tomato',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          };
    
          const config = {
            type: 'bar',
            data: data22,
          };
          const deleted = document.getElementById(`${counter - 1}`)
          if (deleted) {
          deleted.remove();
          }
          const canvasDiv = d3.select('.donuttt')
          canvasDiv.append('canvas').attr('id', `${counter}`)
          const mainCanvas = document.getElementById(`${counter}`)
          const ctx = mainCanvas.getContext('2d')
        new Chart(ctx, config)
       
        d3.select('#vax-hes').text(this.dataset.vaxhes)
        console.log(donut, 'taylor swift')
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
        else if (pct <= secondQuint && pct > firstQuint) return 'orange'
        else if (pct <= thirdQuint && pct > secondQuint) return '#ffdb58'
        else if (pct <= fourthQuint && pct > thirdQuint) return '#76ff7a'
        else if (pct > fourthQuint) return "green"
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