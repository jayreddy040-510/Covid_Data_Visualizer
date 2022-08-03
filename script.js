let dataset = [1, 2, 3, 4, 5]

d3.select('body')
    .selectAll('p')
    .data(dataset)
    .enter()
    .append('h1')
    .text(function(d) {return d});