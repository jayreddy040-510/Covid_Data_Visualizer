# 052 - Covid Vaccination Data Visualizer

![GitHub language count](https://img.shields.io/github/languages/count/jayreddy040-510/Covid_Data_Visualizer?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/jayreddy040-510/Covid_Data_Visualizer)

A tool built to increase visbility to and readability of the latest COVID Vaccination data.

Live Link: https://jayreddy040-510.github.io/Covid_Data_Visualizer/


Table of Contents
---
---

1) Background

2) Functionality and MVP's

3) Screenshots and Video Demonstrations

4) Technologies, Libraries, and API's


# Background


The name of this project and tool is 052. 052 was built to create a visually-appealing interface that provides users with the most recent data on vaccine progression (via state) through the US. I especially would like to track vaccine rates and booster rates when compared across the country. The goal for the project is to choose an API (or several API's with data that can be amalgamated) that is regularly updated and robust enough to depict a good snapshot of contemporary COVID vaccination efforts. The tool will be designed to be responsive, user-friendly, visually appealing, and completely dynamic - connecting to strong, thorough, and present-day data.

![Getting Started](https://media0.giphy.com/media/CSnhh1Sd9FUUHV5cbJ/giphy.gif?cid=790b76116ae5f6f9ca92567730c7a177c6512233bd4d6507&rid=giphy.gif&ct=g)

As the data is initially sourced and parsed by the CDC, an arm of the US government, all data here lies within the public domain.


# Functionality and MVP's


In COVID_Data_Visualizer, users will be able to:

1) Access continuously updated data on vaccine rates, booster rates, and other relevant topics via several API's available via Data.CDC.gov
2) Interact with graphs, charts other data visuals with a variety of :hover and :active events.
3) See a variety of stylized representations of data.
4) Interact with a flat, minimalist design page - learning about several comparable parameters that measure a state's COVID vaccination effort and it's peoples' responses to said effort.
5) Connect directly to the databases and sources through links available on a 'hamburger' menu.

In addition, this project will include:

1) An introductory modal briefly describing the project, simple instructions for use of the visualizer, and links by which users can professionally connect with me.
2) A production README.


# Screenshots and Video Demonstrations


## 1) 052 has several features and data that a user can interpret through interacting with the tool. 

![Getting Started](diagram.jpg)

## 2) Upon initialization queries the largest database for COVID Vaccination Data for the most recent week of national data

``` javascript
const getVaxData = async () => {
    try{
        let response = await fetch(`https://data.cdc.gov/resource/unsk-b7fc.json?$query=SELECT location, series_complete_pop_pct, additional_doses_vax_pct,  series_complete_5pluspop_pct, series_complete_18pluspop, series_complete_65pluspop WHERE location NOT IN ('BP2','US','DD2','GU','AS','FM','IH2','MH','MP','PW','VA2','VI','UM') ORDER BY date DESC, series_complete_pop_pct DESC LIMIT 52`);
        let z = response.json();
        return z;
    }catch(err){
        console.error(err);
    }
}
```

## 3) Clickable states that give the user more information on click.

![](https://media2.giphy.com/media/t2AvKdLKS1CwdChuFz/giphy.gif?cid=790b7611f978997b340cfba7db880c7f85bfd4b1e5e6828d&rid=giphy.gif&ct=g)

``` javascript
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
```

## 4) Hovering over states allows users to "preview" state name

![](https://media0.giphy.com/media/1wO4t4lZpmRt21B5rV/giphy.gif?cid=790b76117fad1888493fe0291b6f78eb9aa95f6913bdc5af&rid=giphy.gif&ct=g)

``` javascript
    .on('mouseover', function(d) {
        d = this;
        mouseOver(d);
        d3.select('#state-name').text(this.dataset.name)
        d3.select('#state-pct').text(`${Math.round(this.dataset.pct)}%`)
        d3.select('#state-addpct').text(`${Math.round(this.dataset.addpct)}%`)
    })
```

# Technologies, Libraries, and API's


1) D3.js
2) Charts.js
3) Data.CDC.gov
4) Google Fonts API


