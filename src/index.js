document.addEventListener('DOMContentLoaded', async () => {
const body = d3.select('body')
body.style('cursor','pointer')
const modalContainer = d3.select('.modal-container')
modalContainer.on('click', function () {
    body.style('cursor', 'auto')
    modalContainer.style('opacity', '0')
    modalContainer.style('pointer-events', 'none')
})
const stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'

const svg = d3.select('#canvas')
const projection = d3.geoAlbers().scale(1150).translate([470,310])
let stateBoundaries;
let counter = 0;
// let counter2 = 0;


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
const leg1 = d3.select('.leg1')

d3.select('#legend-main-parent').append('p').attr('id', 'pleg-1').style('opacity', 0)
d3.select('.leg1').on('mouseover', function() {
    d3.select('#pleg-1').style('opacity', 1).text(`x < ${Math.round(firstQuint)}`)
})
d3.select('.leg1').on('mouseout', function() {
    d3.select('#pleg-1').style('opacity', 0)
})
d3.select('.leg2').on('mouseover', () => {

    d3.select('#pleg-1').text(`${Math.round(firstQuint)} < x < ${Math.round(secondQuint)}`)
    .style('opacity', 1)

})
d3.select('.leg2').on('mouseout', function() {
    d3.select('#pleg-1').style('opacity', 0)
})
d3.select('.leg3').on('mouseover', () => {

    d3.select('#pleg-1').text(`${Math.round(secondQuint)} < x < ${Math.round(thirdQuint)}`)
    .style('opacity', 1)

})
d3.select('.leg3').on('mouseout', function() {
    d3.select('#pleg-1').style('opacity', 0)
})
d3.select('.leg4').on('mouseover', () => {

    d3.select('#pleg-1').text(`${Math.round(thirdQuint)} < x < ${Math.round(fourthQuint)}`)
    .style('opacity', 1)

})
d3.select('.leg4').on('mouseout', function() {
    d3.select('#pleg-1').style('opacity', 0)
})
d3.select('.leg5').on('mouseover', () => {

    d3.select('#pleg-1').text(`x > ${Math.round(fourthQuint)}`)
    .style('opacity', 1)

})
d3.select('.leg5').on('mouseout', function() {
    d3.select('#pleg-1').style('opacity', 0)
})

let toolTip = d3.select('#banana')
    // .append('div')
    // .attr("class", "tooltip")
    // .style("opacity", 0)
    // .style("background-color", "#faebd7")
    // .style("border", "solid")
    // .style("border-width", "1.5px")
    // .style("border-radius", "5px")
    // .style("padding", "5px")
    // .style("width", "260px")
    // .style("height","90%")
    // .style('margin-top','10px')
    // .style('position','absolute')
let mainPct = d3.select('#main-pct')
let addPct = d3.select('#boost-pct')
function mouseOver(d) {
    toolTip.html(`${d.dataset.name}`)
    mainPct.style('opacity', 0.4)
    addPct.style('opacity', 0.4)
    mainPct.html(`${Math.round(d.dataset.pct)}% Pop. Vaccinated`)
    addPct.html(`${Math.round(d.dataset.addpct)}% Pop. Boosted`)
    // <br><br>Percent Vaccinated: ${d.dataset.pct}<br>Percent Vaccinated w/ Booster: ${d.dataset.addpct}`)
    toolTip.style("opacity", 0.6).style("font-family", "Adamina").style("font-size", "40px").style('color', 'rgb(40,40,40)')
    .style('width', '10%')
    d.append(toolTip)
    d.append(mainPct)
    d.append(addPct)
}

function mouseMove(d) {
}

function mouseLeave(d) {
    toolTip.style('opacity', 0)
}

// console.log(data.find(x => x['location'] === 'WY').series_complete_pop_pct)

let drawMap = () => {

    svg.selectAll("path")
    .data(stateBoundaries)
    .enter().append('path')
    .attr('d', d3.geoPath().projection(projection))
    .attr('stroke-width', '1.5')
    .attr('stroke','black')
    .attr('position', 'relative')
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
        return Math.round(+vaxHesNumber * 100) + '%';
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
    .on('mouseover', function(d) {
        d = this;
        mouseOver(d);
        d3.select('#state-name').text(this.dataset.name)
        d3.select('#state-pct').text(`${Math.round(this.dataset.pct)}%`)
        d3.select('#state-addpct').text(`${Math.round(this.dataset.addpct)}%`)
    })
    .on('click', function(e) {
        console.log(e.target.dataset.pct)
        let donut = [];
        donut.push(+(e.target.dataset.onePlus), +(e.target.dataset.twoPlus), +(e.target.dataset.threePlus))
        counter++
        d3.select('.tools').style('opacity', 1)
        toolTip.style('opacity', 1)
        mainPct.style('opacity', 1)
        addPct.style('opacity', 1)
        const data22 = {
            labels: [
              '5',
              '18',
              '65'
            ],
            datasets: [{
            //   label: 'Percent of population vaccinated at the following age or older',
              data: donut,
              backgroundColor: () => {
                let pct = e.target.dataset.pct;

                if (pct <= firstQuint) return 'firebrick'
              else if (pct <= secondQuint && pct > firstQuint) return 'orange'
              else if (pct <= thirdQuint && pct > secondQuint) return '#ffe75e'
              else if (pct <= fourthQuint && pct > thirdQuint) return '#8bbe1b'
              else if (pct > fourthQuint) return "#195905"
              },
              barPercentage: 0.4,
              borderColor: 'grey',
              hoverBackgroundColor: () => {
                let pct = e.target.dataset.pct;

                if (pct <= firstQuint) return 'rgb(232, 98, 98)';
              else if (pct <= secondQuint && pct > firstQuint) return 'rgb(255, 209, 123)';
              else if (pct <= thirdQuint && pct > secondQuint) return '#fef2ae'
              else if (pct <= fourthQuint && pct > thirdQuint) return '#cae296'
              else if (pct > fourthQuint) return "#638958"
              },
              hoverOffset: 4
            }]
          };
    
          const config = {
            type: 'bar',
            data: data22,
            options: {
                plugins: {
                legend: {
                    display: false
                },
                title: {
                    position: 'top',
                    padding: 30,
                    color: 'rgb(40,40,40)',
                    display: true,
                    text: "Percent of State Population Vaccinated by >= Age",
                    font: {family: "'Roboto'", size: 18, weight: 375}
                },
                tooltip: {
                    // position: 'nearest',
                    backgroundColor: 'floralwhite',
                    titleColor: 'floralwhite',
                    footerColor: 'floralwhite',
                    titleFont: {size: 0},
                    borderColor: 'rgb(40,40,40)',
                    borderWidth: 1,
                    displayColors: false,
                    font: {
                        family: "'Roboto'", size: 14, weight: 150
                    },
                    bodyColor: 'rgb(40,40,40)',
                    padding: 10
                }
             }
            }
          };
          const deleted = document.getElementById(`${counter - 1}`)
          if (deleted) {
          deleted.remove();
          }
          const canvasDiv = d3.select('.donuttt')
          canvasDiv.append('canvas').attr('id', `${counter}`).attr('max-width', '50px')
          const mainCanvas = document.getElementById(`${counter}`)
          const ctx = mainCanvas.getContext('2d')
        new Chart(ctx, config)
       
        d3.select('#vax-hes').text(`${this.dataset.vaxhes}`)
        d3.select('#vaxhes-p').text(`of adults from ${this.dataset.name} say they will "definitely not" receive a COVID vaccine, based on a 2021 national survey`)
        // console.log(donut, 'taylor swift')
    })
    .on('mouseleave', () => {
        // mouseLeave();
    })
    .attr('fill', (stateObj) => {
        
        let name = stateObj['properties']['STUSPS']

        let state = data.find(state => state['location'] === name)
        let pct;
        pct = (state['series_complete_pop_pct'])
        
        if (pct <= firstQuint) return 'firebrick'
        else if (pct <= secondQuint && pct > firstQuint) return 'orange'
        else if (pct <= thirdQuint && pct > secondQuint) return '#ffe75e'
        else if (pct <= fourthQuint && pct > thirdQuint) return '#8bbe1b'
        else if (pct > fourthQuint) return "#195905"
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