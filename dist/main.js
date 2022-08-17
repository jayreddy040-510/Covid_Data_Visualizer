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

eval("document.addEventListener('DOMContentLoaded', async () => {\nconst body = d3.select('body')\nbody.style('cursor','pointer')\nconst modalContainer = d3.select('.modal-container')\nmodalContainer.on('click', function () {\n    body.style('cursor', 'auto')\n    modalContainer.style('opacity', '0')\n    modalContainer.style('pointer-events', 'none')\n})\nconst stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'\n\nconst svg = d3.select('#canvas')\nconst projection = d3.geoAlbers().scale(1250).translate([500,300])\nlet stateBoundaries;\nlet counter = 0;\n// let counter2 = 0;\n\n\nconst strongHesitant = async () => {\n    try{\n        let res = await fetch(`https://data.cdc.gov/resource/q9mh-h2tw.json?$query=SELECT state_code, avg(estimated_strongly_hesitant) GROUP BY state_code`);\n        return res.json();\n    } catch(err) {\n        console.error(err);\n    }\n}\n\nconst vaxHesitationData = await strongHesitant();\nvaxHesitationData.push({state_code: 'PR', avg_estimated_strongly_hestitant: 0})\n\n\nconst getVaxData = async () => {\n    try{\n        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct, additional_doses_vax_pct,  series_complete_5pluspop_pct, series_complete_18pluspop, series_complete_65pluspop WHERE location NOT IN ('BP2','US','DD2','GU','AS','FM','IH2','MH','MP','PW','VA2','VI','UM') ORDER BY date DESC, series_complete_pop_pct DESC LIMIT 52`);\n        let z = response.json();\n        return z;\n    }catch(err){\n        console.error(err);\n    }\n}\n\n\nlet data =  await getVaxData();\n\nconst min = +data[51].series_complete_pop_pct;\nconst max = +data[0].series_complete_pop_pct;\nconst range = max - min;\nconst quintile = range/5;\nconst firstQuint = min + quintile;\nconst secondQuint = firstQuint + quintile;\nconst thirdQuint = secondQuint + quintile;\nconst fourthQuint = thirdQuint + quintile;\n\nlet toolTip = d3.select('#banana')\n    .append('div')\n    .attr(\"class\", \"tooltip\")\n    .style(\"opacity\", 0)\n    .style(\"background-color\", \"floralwhite\")\n    .style(\"border\", \"solid\")\n    .style(\"border-width\", \"2px\")\n    .style(\"border-radius\", \"5px\")\n    .style(\"padding\", \"5px\")\n    .style(\"width\", \"200px\")\n    .style(\"height\",\"90px\")\n    .style('position','absolute')\n\nfunction mouseOver(d) {\n    toolTip.html(`State: ${d.dataset.name}<br><br>1st: ${d.dataset.pct}<br>2nd: ${d.dataset.addpct}`)\n    toolTip.style(\"opacity\", 1)\n    d.append(toolTip)\n}\n\nfunction mouseMove(d) {\n}\n\nfunction mouseLeave(d) {\n    toolTip.style('opacity', 0)\n}\n\n// console.log(data.find(x => x['location'] === 'WY').series_complete_pop_pct)\nconsole.log(data);\nlet drawMap = () => {\n    console.log(stateBoundaries)\n    svg.selectAll(\"path\")\n    .data(stateBoundaries)\n    .enter().append('path')\n    .attr('d', d3.geoPath().projection(projection))\n    .attr('stroke-width', '1.5')\n    .attr('stroke','black')\n    .attr('position', 'relative')\n    .attr('data-name', d => d['properties'].NAME)\n    .attr(\"data-pct\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let pct = (state['series_complete_pop_pct'])\n        return pct;\n    })\n    .attr(\"data-addpct\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let pct = (state['additional_doses_vax_pct'])\n        return pct;\n    })\n    .attr(\"data-vaxhes\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = vaxHesitationData.find(state => state['state_code'] === name)\n        let vaxHesNumber = state['avg_estimated_strongly_hesitant']\n        return Math.round(+vaxHesNumber * 100) + '%';\n     } )\n     .attr(\"data-onePlus\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let plus = (state['series_complete_5pluspop_pct'])\n        return plus;\n    })\n    .attr(\"data-twoPlus\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let plus = (state['series_complete_18pluspop'])\n        return plus;\n    })\n    .attr(\"data-threePlus\", (d) => {\n        let name = d['properties'].STUSPS\n        let state = data.find(state => state['location'] === name)\n        let plus = (state['series_complete_65pluspop'])\n        return plus;\n    })\n    .attr('class','state')\n    .on('mouseover', function(d) {\n        d = this;\n        mouseOver(d);\n        d3.select('#state-name').text(this.dataset.name)\n        d3.select('#state-pct').text(`${Math.round(this.dataset.pct)}%`)\n        d3.select('#state-addpct').text(`${Math.round(this.dataset.addpct)}%`)\n    })\n    .on('click', function(e) {\n        let donut = [];\n        donut.push(+(e.target.dataset.onePlus), +(e.target.dataset.twoPlus), +(e.target.dataset.threePlus))\n        counter++\n        const data22 = {\n            labels: [\n              '% of pop. older than 5 vaccinated',\n              '% of pop. older than 18 vaccinated',\n              '% of pop. older than 65 vaccinated'\n            ],\n            datasets: [{\n              label: 'Vaccination by Age Demographic',\n              data: donut,\n              backgroundColor: [\n                'tomato',\n                'rgb(54, 162, 235)',\n                'rgb(255, 205, 86)'\n              ],\n              hoverOffset: 4\n            }]\n          };\n    \n          const config = {\n            type: 'bar',\n            data: data22,\n          };\n          const deleted = document.getElementById(`${counter - 1}`)\n          if (deleted) {\n          deleted.remove();\n          }\n          const canvasDiv = d3.select('.donuttt')\n          canvasDiv.append('canvas').attr('id', `${counter}`)\n          const mainCanvas = document.getElementById(`${counter}`)\n          const ctx = mainCanvas.getContext('2d')\n        new Chart(ctx, config)\n       \n        d3.select('#vax-hes').text(this.dataset.vaxhes)\n        console.log(donut, 'taylor swift')\n    })\n    .on('mouseleave', () => {\n        mouseLeave();\n        d3.select('#state-name').text('select a state')\n    })\n    .attr('fill', (stateObj) => {\n        \n        let name = stateObj['properties']['STUSPS']\n\n        let state = data.find(state => state['location'] === name)\n        let pct;\n        pct = (state['series_complete_pop_pct'])\n        \n        if (pct <= firstQuint) return 'firebrick'\n        else if (pct <= secondQuint && pct > firstQuint) return 'orange'\n        else if (pct <= thirdQuint && pct > secondQuint) return '#ffdb58'\n        else if (pct <= fourthQuint && pct > thirdQuint) return '#8bbe1b'\n        else if (pct > fourthQuint) return \"green\"\n        })\n\n\n\n\n\n            \n        }\n\n\n\n        \n        \n        \n        d3.json(stateBoundaryURL).then(\n            (data, error) => {\n                if(error) {\n                    console.log(error);\n                } else {\n                    stateBoundaries = data.features;\n                    drawMap();\n                }\n            }\n            )\n            \n            \n\n\n\n})\n\n//# sourceURL=webpack://covid_data_visualizer/./src/index.js?");

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