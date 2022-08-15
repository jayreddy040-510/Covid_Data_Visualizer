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

eval("window.addEventListener('DOMContentLoaded', async () => {\n\nconst stateBoundaryURL = 'https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/20m/2021/state.json'\nconst svg = d3.select('#canvas')\nconst projection = d3.geoAlbers().scale(1250).translate([500,300])\nlet stateBoundaries;\nlet pctPopVax;\n\nconst getVaxData = async () => {\n    try{\n        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct WHERE location NOT IN ('BP2','DD2','GU','AS','FM','IH2','MH','MP','PR','PW','VA2','VI','UM') ORDER BY date DESC, series_complete_pop_pct DESC LIMIT 52`);\n        let z = response.json();\n        return z;\n    }catch(err){\n        console.error(err);\n    }\n}\n\nlet data =  await getVaxData();\n\nconst range = data[0].series_complete_pop_pct - data[51].series_complete_pop_pct\nconst quintile = range/5;\n\n\nlet drawMap = () => {\n    // console.log(stateBoundaries)\n    svg.selectAll(\"path\")\n    .data(stateBoundaries)\n    .enter().append('path')\n    .attr('d', d3.geoPath().projection(projection))\n    .attr('stroke-width', '4.0')\n    .attr('class','state')\n    .attr('fill', (stateObj) => {\n        \n        let name = stateObj['properties'].STUSPS\n        // if (name <= 'M') {\n        //     return 'tomato'\n        // } else {\n        //     return 'darkslateblue'\n        // }\n        \n        let state = data.find(state => state['location'] === name)\n        let pct = state['series_complete_pop_pct']\n        if (pct < 80) return 'firebrick'\n            // pct = state.series_complete_pop_pct\n            // if (pct < 70) {\n            //     return('red')\n            // }\n        })\n    //     const res = await getVaxData();\n    //     let state = res.find(state => state['location'] === 'LA')\n    //     pct = state.series_complete_pop_pct\n    //     if (pct < 70) { let abc = () => {\n    //         console.log('red')\n    //     }\n    //     return abc();\n    // }\n    \n    .attr(\"data-tooltip\", (d) => d['properties'].STUSPS)\n}\n\n\n\n\n\nd3.json(stateBoundaryURL).then(\n    (data, error) => {\n        if(error) {\n            console.log(error);\n        } else {\n            stateBoundaries = data.features;\n            drawMap();\n        }\n    }\n    )\n    \n    \n    // let orange = () => {\n    // let bananana = () => {\n    // console.log('inside')\n    // }\n    // return bananana();\n    // }\n    // orange();\n    \n    \n})\n\n//# sourceURL=webpack://covid_data_visualizer/./src/index.js?");

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