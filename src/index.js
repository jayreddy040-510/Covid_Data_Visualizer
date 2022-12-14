document.addEventListener('DOMContentLoaded', async () => {
const body = d3.select('body')
const meat = d3.select('.meat')
const menuDivs = d3.selectAll('#menu div')
let menuHidden = true;
const menu = d3.select('#menu')
const allSubMenus = d3.selectAll('.menu-click')
const menuButton = d3.select('#hamburger')
const menuBack = d3.selectAll('#menu-back')
const creditsMenu = d3.select('#menu-credits-click')
const creditsDiv = d3.select('#menu-credits')
const apiDiv = d3.select('#menu-api')
const apiMenu = d3.select('#menu-api-click')
const updatedDiv = d3.select('#menu-updated')
const updatedMenu = d3.select('#menu-updated-click')
const updatedDateDiv = d3.select('#append-date')
const patchDiv = d3.select('#patch-notes')
const patchMenu = d3.select('#patch-notes-click')
const patchBeta = d3.select('#patch-beta')
const patchNotesBeta = d3.select('#patch-notes-beta')
const backToPatch = d3.select('#menu-back-patch-subnotes')
const modalContainer = d3.select('.modal-container')
const clickState = d3.select('.click-state')

menu.style('pointer-events', 'none')
menuButton.on('click', () => {
    if (menuHidden) {
        menu.style('opacity', 1);
        menuButton.style('color', 'rgb(70, 123, 123)')
        menu.style('pointer-events', 'all')
    } else {
        menu.style('pointer-events', 'none')
        menu.style('opacity', 0);
        allSubMenus.style('pointer-events', 'none')
        allSubMenus.style('opacity', 0);
        menuButton.style('color', 'darkslategrey')
        menuButton.on('mouseover', () => {
            menuButton.style('color', 'rgb(70, 123, 123)')
        })
        menuButton.on('mouseout', () => {
            if (menuHidden) {
                menuButton.style('color', 'darkslategrey')
            }
        })
    }
    
    menuHidden = !menuHidden
    
    }


)

creditsDiv.on('click', () => {
    creditsMenu.style('opacity', 1).style('pointer-events', 'all')
})
apiDiv.on('click', () => {
    apiMenu.style('opacity', 1).style('pointer-events', 'all')
})
updatedDiv.on('click', () => {
    updatedMenu.style('opacity', 1).style('pointer-events', 'all')
})
patchDiv.on('click', () => {
    patchMenu.style('opacity', 1).style('pointer-events', 'all')
})
patchBeta.on('click', () => {
    patchMenu.style('opacity', 0).style('pointer-events', 'none')
    menu.style('opacity', 0).style('pointer-events', 'none')
    patchNotesBeta.style('opacity', 1).style('pointer-events', 'all')
})


menuBack.on('click', () => {
    allSubMenus.style('pointer-events', 'none')
    allSubMenus.style('opacity', 0);
    menu.style('opacity', 1);
    menuButton.style('color', 'rgb(70, 123, 123)')
    menu.style('pointer-events', 'all')
})

backToPatch.on('click', () => {
    patchNotesBeta.style('opacity', 0).style('pointer-events', 'none')
    patchMenu.style('opacity', 1).style('pointer-events', 'all')
})



body.style('cursor','pointer')
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

const getDate = async () => {
    try{
        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT  date WHERE location NOT IN ('BP2','US','DD2','GU','AS','FM','IH2','MH','MP','PW','VA2','VI','UM') LIMIT 1`);
        let z = response.json();
        return z;
    }catch(err){
        console.error(err);
    }
}

let date = await getDate();

let lastUpdated = Object.values(date[0])[0]

lastUpdated = lastUpdated.split('T').join(' ')

updatedDateDiv.append('span').text(`${lastUpdated}`).style('color', 'darkslategrey')

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
let vaxHes = d3.select('#vax-hes')
let vaxHesP = d3.select('#vaxhes-p')
function mouseOver(d) {
    toolTip.html(`${d.dataset.name}`)
    mainPct.style('opacity', 0.4)
    addPct.style('opacity', 0.4)
    mainPct.html(`${Math.round(d.dataset.pct)}% Pop. Vaccinated`)
    addPct.html(`${Math.round(d.dataset.addpct)}% Pop. Boosted`)
    d3.select('#vax-hes').text(`${d.dataset.vaxhes}`)
        d3.select('#vaxhes-p').text(`of adults from ${d.dataset.name} say they will "definitely not" receive a COVID vaccine, based on a 2021 national survey`)
    vaxHes.style('opacity', 0.6)
    vaxHesP.style('opacity', 0.6)
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

        let donut = [];
        donut.push(+(e.target.dataset.onePlus), +(e.target.dataset.twoPlus), +(e.target.dataset.threePlus))
        counter++
        d3.select('.tools').style('opacity', 1)
        toolTip.style('opacity', 1)
        mainPct.style('opacity', 1)
        addPct.style('opacity', 1)
        d3.select('#vax-hes').style('opacity', 1.0)
        d3.select('#vaxhes-p').style('opacity', 1.0)
        let xyz = e.target.dataset.name

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
                    text: `Percent of ${xyz} Population Vaccinated by >= Age`,
                    font: {family: "'Roboto', sans-serif", size: 18, weight: 400}
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