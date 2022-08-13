Notes
---
---

- i want my project to have flat/minimalist design

- if i have long enough loading times - i might want to create a 3d j for my "logo" and have it rotate during a loading screen or something like that.

- i want to try and implement infinite/continuous scroll and maybe light/dark mode

- one idea i have is to pick robust databases that are continually updated and do a title suggesting "A Year of COVID" that chooses 5 clean graphics maybe with continuous scroll that provide an aesthetic, scoped vision of the last year of covid.

- before parsing/cleaning data - i think i should look for 3-4 datasets using data.cdc.gov to find 3-4 interesting questions i can answer with a graphic (ideally, different graphics). i'm realizing as i type this out that i might need to choose data based on different ways to visualize them

- different graphic ideas:
    1) some sort of geo heat map - either with infections or vaccination rate - would plausibly need to make the map with D3 as diego recommended
    2) pie chart/doughnut chart/multiseries pie/polar area/
    3) bar graph (duh) but look into ways to make this interactive
    4) vaccine shaped graphic
    5) line chart stacked or line chart with progressive line animation with easing
    6) streamgraph


- 1st graph
    - vaccine interactive map
    - hovering over state gives mini legend of state acronym, series_complete_pop_pct (no booster but both doses of 2-dose vaccine or one dose of single-dose), and additional_doses_vax_pct maybe make them half integer incremented values out of 5 stars (e.g. (4.5/5 would be 90%))
    - clicking on state brings up a modal that has several mini graph, a state map with lines a the county level, and can hover over counties to get county-specific vaccination/demographic data. things we're going to put on the modal per state:
        - state title (not too prominent, maybe rng fonts)
        - maybe animate modal popping up or graphics popping up using anime.js?
        - state county map with hover over county info
        - vaccine hesitancy number
        - vaccination by demographic
        - some indicator of morbidity/mortality per capita
        - vaccine policy timeline per state

