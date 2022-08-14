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

eval("window.addEventListener('DOMContentLoaded', () => console.log(\"\"));\n\nconst stateBoundaryGeoJSON = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'\n\nconst countryMap = d3.select('#us-map');\nlet stateBoundaries;\n\nasync function getData() {\n    try{\n      let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct WHERE location NOT IN ('BP2','DD2','GU','AS','FM','IH2','MH','MP','PR','PW','VA2','VI','UM') ORDER BY date DESC, location LIMIT 52`);\n      return response.json();\n    }catch(err){\n      console.error(err);\n      // Handle errors here\n    }\n  }\n\n  let drawMap = () => {\n    countryMap.selectAll('path')\n        .data(stateBoundaries)\n        .enter()\n        .append('path')\n            .attr('d', d3.geoPath())\n            .attr('class', 'state')\n  }\n  let percentVaccinated = getData().then(res => res);\n\n\n  d3.json(stateBoundaryGeoJSON).then(\n    (data, error) => {\n        if(error) {\n            console.log(log);\n        } else {\n            stateBoundaries = data.features;\n            console.log(stateBoundaries);\n            drawMap();\n        }\n    }\n  )\n\n\n  \n\n\n \n\n//# sourceURL=webpack://covid_data_visualizer/./src/index.js?");

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