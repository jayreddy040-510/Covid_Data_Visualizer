/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function() {

eval("document.addEventListener('DOMContentLoaded', async () => {\nconst body = d3.select('body')\nbody.style('cursor','pointer')\nconst modalContainer = d3.select('.modal-container')\nmodalContainer.on('click', function () {\n    body.style('cursor', 'auto')\n    modalContainer.style('opacity', '0')\n    modalContainer.style('pointer-events', 'none')\n})\nconst stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'\n\nconst svg = d3.select('#canvas')\nconst projection = d3.geoAlbers().scale(1150).translate([470,310])\nlet stateBoundaries;\nlet counter = 0;\n// let counter2 = 0;\n\n\nconst strongHesitant = async () => {\n    try{\n        let res = await fetch(`https://data.cdc.gov/resource/q9mh-h2tw.json?$query=SELECT state_code, avg(estimated_strongly_hesitant) GROUP BY state_code`);\n        return res.json();\n    } catch(err) {\n        console.error(err);\n    }\n}\n\nconst vaxHesitationData = await strongHesitant();\nvaxHesitationData.push({state_code: 'PR', avg_estimated_strongly_hestitant: 0})\n\n\nconst getVaxData = async () => {\n    try{\n        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct, additional_doses_vax_pct,  series_complete_5pluspop_pct, series_complete_18pluspop, series_complete_65pluspop WHERE location NOT IN ('BP2','US','DD2','GU','AS','FM','IH2','MH','MP','PW','VA2','VI','UM') ORDER BY date DESC, series_complete_pop_pct DESC LIMIT 52`);\n        let z = response.json();\n        return z;\n    }catch(err){\n        console.error(err);\n    }\n}\n\n\nlet data =  await getVaxData();\n\nconst min = +data[51].series_complete_pop_pct;\nconst max = +data[0].series_complete_pop_pct;\nconst range = max - min;\nconst quintile = range/5;\nconst firstQuint = min + quintile;\nconst secondQuint = firstQuint + quintile;\nconst thirdQuint = secondQuint + quintile;\nconst fourthQuint = thirdQuint + quintile;\nconst leg1 = d3.select('.leg1')\n\nd3.select('#legend-main-parent').append('p').attr('id', 'pleg-1').style('opacity', 0)\nd3.select('.leg1').on('mouseover', function() {\n    d3.select('#pleg-1').style('opacity', 1).text(`x < ${Math.round(firstQuint)}`)\n})\nd3.select('.leg1').on('mouseout', function() {\n    d3.select('#pleg-1').style('opacity', 0)\n})\nd3.select('.leg2').on('mouseover', () => {\n\n    d3.select('#pleg-1').text(`${Math.round(firstQuint)} < x < ${Math.round(secondQuint)}`)\n    .style('opacity', 1)\n\n})\nd3.select('.leg2').on('mouseout', function() {\n    d3.select('#pleg-1').style('opacity', 0)\n})\nd3.select('.leg3').on('mouseover', () => {\n\n    d3.select('#pleg-1').text(`${Math.round(secondQuint)} < x < ${Math.round(thirdQuint)}`)\n    .style('opacity', 1)\n\n})\nd3.select('.leg3').on('mouseout', function() {\n    d3.select('#pleg-1').style('opacity', 0)\n})\nd3.select('.leg4').on('mouseover', () => {\n\n    d3.select('#pleg-1').text(`${Math.round(thirdQuint)} < x < ${Math.round(fourthQuint)}`)\n    .style('opacity', 1)\n\n})\nd3.select('.leg4').on('mouseout', function() {\n    d3.select('#pleg-1').style('opacity', 0)\n})\nd3.select('.leg5').on('mouseover', () => {\n\n    d3.select('#pleg-1').text(`x > ${Math.round(fourthQuint)}`)\n    .style('opacity', 1)\n\n})\nd3.select('.leg5').on('mouseout', function() {\n    d3.select('#pleg-1').style('opacity', 0)\n})\n\nlet toolTip = d3.select('#banana')\n    // .append('div')\n    // .attr(\"class\", \"tooltip\")\n    // .style(\"opacity\", 0)\n    // .style(\"background-color\", \"#faebd7\")\n    // .style(\"border\", \"solid\")\n    // .style(\"border-width\", \"1.5px\")\n    // .style(\"border-radius\", \"5px\")\n    // .style(\"padding\", \"5px\")\n    // .style(\"width\", \"260px\")\n    // .style(\"height\",\"90%\")\n    // .style('margin-top','10px')\n    // .style('position','absolute')\nlet mainPct = d3.select('#main-pct')\nlet addPct = d3.select('#boost-pct')\nfunction mouseOver(d) {\n    toolTip.html(`${d.dataset.name}`)\n    mainPct.style('opacity', 0.4)\n    addPct.style('opacity', 0.4)\n    mainPct.html(`${Math.round(d.dataset.pct)}% Pop. Vaccinated`)\n    addPct.html(`${Math.round(d.dataset.addpct)}% Pop. Boosted`)\n    // <br><br>Percent Vaccinated: ${d.dataset.pct}<br>Percent Vaccinated w/ Booster: ${d.dataset.addpct}`)\n    toolTip.style(\"opacity\", 0.6).style(\"font-family\", \"Adamina\").style(\"font-size\", \"40px\").style('color', 'rgb(40,40,40)')\n    .style('width', '10%')\n    d.append(toolTip)\n    d.append(mainPct)\n    d.append(addPct)\n}\n\nfunction mouseMove(d) {\n}\n\nfunction mouseLeave(d) {\n    toolTip.style('opacity', 0)\n}\n\n// console.log(data.find(x => x['location'] === 'WY').series_complete_pop_pct)\n\nlet drawMap = () => {\n\n    svg.selectAll(\"path\")\n    .data(stateBoundaries)\n    .enter().append('path')\n    .attr('d', d3.geoPath().projection(projection))\n    .attr('stroke-width', '1.5')\n    .attr('stroke','black')\n    .attr('position', 'relative')\n    .attr('data-name', d => d['properties'].NAME)\n    .attr(\"data-pct\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let pct = (state['series_complete_pop_pct'])\n        return pct;\n    })\n    .attr(\"data-addpct\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let pct = (state['additional_doses_vax_pct'])\n        return pct;\n    })\n    .attr(\"data-vaxhes\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = vaxHesitationData.find(state => state['state_code'] === name)\n        let vaxHesNumber = state['avg_estimated_strongly_hesitant']\n        return Math.round(+vaxHesNumber * 100) + '%';\n     } )\n     .attr(\"data-onePlus\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let plus = (state['series_complete_5pluspop_pct'])\n        return plus;\n    })\n    .attr(\"data-twoPlus\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let plus = (state['series_complete_18pluspop'])\n        return plus;\n    })\n    .attr(\"data-threePlus\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let plus = (state['series_complete_65pluspop'])\n        return plus;\n    })\n    .attr('class','state')\n    .on('mouseover', function(d) {\n        d = this;\n        mouseOver(d);\n        d3.select('#state-name').text(this.dataset.name)\n        d3.select('#state-pct').text(`${Math.round(this.dataset.pct)}%`)\n        d3.select('#state-addpct').text(`${Math.round(this.dataset.addpct)}%`)\n    })\n    .on('click', function(e) {\n        console.log(e.target.dataset.pct)\n        let donut = [];\n        donut.push(+(e.target.dataset.onePlus), +(e.target.dataset.twoPlus), +(e.target.dataset.threePlus))\n        counter++\n        d3.select('.tools').style('opacity', 1)\n        toolTip.style('opacity', 1)\n        mainPct.style('opacity', 1)\n        addPct.style('opacity', 1)\n        const data22 = {\n            labels: [\n              '5',\n              '18',\n              '65'\n            ],\n            datasets: [{\n            //   label: 'Percent of population vaccinated at the following age or older',\n              data: donut,\n              backgroundColor: () => {\n                let pct = e.target.dataset.pct;\n\n                if (pct <= firstQuint) return 'firebrick'\n              else if (pct <= secondQuint && pct > firstQuint) return 'orange'\n              else if (pct <= thirdQuint && pct > secondQuint) return '#ffe75e'\n              else if (pct <= fourthQuint && pct > thirdQuint) return '#8bbe1b'\n              else if (pct > fourthQuint) return \"#195905\"\n              },\n              barPercentage: 0.4,\n              borderColor: 'grey',\n              hoverBackgroundColor: () => {\n                let pct = e.target.dataset.pct;\n\n                if (pct <= firstQuint) return 'rgb(232, 98, 98)';\n              else if (pct <= secondQuint && pct > firstQuint) return 'rgb(255, 209, 123)';\n              else if (pct <= thirdQuint && pct > secondQuint) return '#fef2ae'\n              else if (pct <= fourthQuint && pct > thirdQuint) return '#cae296'\n              else if (pct > fourthQuint) return \"#638958\"\n              },\n              hoverOffset: 4\n            }]\n          };\n    \n          const config = {\n            type: 'bar',\n            data: data22,\n            options: {\n                plugins: {\n                legend: {\n                    display: false\n                },\n                title: {\n                    position: 'top',\n                    padding: 30,\n                    color: 'rgb(40,40,40)',\n                    display: true,\n                    text: \"Percent of State Population Vaccinated by >= Age\",\n                    font: {family: \"'Roboto'\", size: 18, weight: 375}\n                },\n                tooltip: {\n                    // position: 'nearest',\n                    backgroundColor: 'floralwhite',\n                    titleColor: 'floralwhite',\n                    footerColor: 'floralwhite',\n                    titleFont: {size: 0},\n                    borderColor: 'rgb(40,40,40)',\n                    borderWidth: 1,\n                    displayColors: false,\n                    font: {\n                        family: \"'Roboto'\", size: 14, weight: 150\n                    },\n                    bodyColor: 'rgb(40,40,40)',\n                    padding: 10\n                }\n             }\n            }\n          };\n          const deleted = document.getElementById(`${counter - 1}`)\n          if (deleted) {\n          deleted.remove();\n          }\n          const canvasDiv = d3.select('.donuttt')\n          canvasDiv.append('canvas').attr('id', `${counter}`).attr('max-width', '50px')\n          const mainCanvas = document.getElementById(`${counter}`)\n          const ctx = mainCanvas.getContext('2d')\n        new Chart(ctx, config)\n       \n        d3.select('#vax-hes').text(`${this.dataset.vaxhes}`)\n        d3.select('#vaxhes-p').text(`of adults from ${this.dataset.name} say they will \"definitely not\" receive a COVID vaccine, based on a 2021 national survey`)\n        // console.log(donut, 'taylor swift')\n    })\n    .on('mouseleave', () => {\n        // mouseLeave();\n    })\n    .attr('fill', (stateObj) => {\n        \n        let name = stateObj['properties']['STUSPS']\n\n        let state = data.find(state => state['location'] === name)\n        let pct;\n        pct = (state['series_complete_pop_pct'])\n        \n        if (pct <= firstQuint) return 'firebrick'\n        else if (pct <= secondQuint && pct > firstQuint) return 'orange'\n        else if (pct <= thirdQuint && pct > secondQuint) return '#ffe75e'\n        else if (pct <= fourthQuint && pct > thirdQuint) return '#8bbe1b'\n        else if (pct > fourthQuint) return \"#195905\"\n        })\n\n\n\n\n\n            \n        }\n\n\n\n        \n        \n        \n        d3.json(stateBoundaryURL).then(\n            (data, error) => {\n                if(error) {\n                    console.log(error);\n                } else {\n                    stateBoundaries = data.features;\n                    drawMap();\n                }\n            }\n            )\n            \n            \n\n\n\n})\n\n//# sourceURL=webpack://covid_data_visualizer/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;