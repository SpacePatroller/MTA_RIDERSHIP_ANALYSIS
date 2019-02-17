var margin = { top: 50, right: 0, bottom: 100, left: 30 },
  width = 960 - margin.left - margin.right,
  height = 430 - margin.top - margin.bottom,
  gridSize = Math.floor(height / 7),
  legendElementHeight = gridSize / (9 / 7),
  buckets = 9,
  colors = [
    '#ffffd9',
    '#edf8b1',
    '#c7e9b4',
    '#7fcdbb',
    '#41b6c4',
    '#1d91c0',
    '#225ea8',
    '#253494',
    '#081d58'
  ], // alternatively colorbrewer.YlGnBu[9]
  days = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'],
  times = ['3a', '7a', '11a', '3p', '7p', '11p']
datasets = ['Entries', 'Exits', 'Total Activity']

var svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var dayLabels = svg
  .selectAll('.dayLabel')
  .data(days)
  .enter()
  .append('text')
  .text(function(d) {
    return d
  })
  .attr('x', 0)
  .attr('y', function(d, i) {
    return i * gridSize
  })
  .style('text-anchor', 'end')
  .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
  .attr('class', function(d, i) {
    return i >= 2 && i <= 6
      ? 'dayLabel mono axis axis-workweek'
      : 'dayLabel mono axis'
  })

var timeLabels = svg
  .selectAll('.timeLabel')
  .data(times)
  .enter()
  .append('text')
  .text(function(d) {
    return d
  })
  .attr('x', function(d, i) {
    return i * gridSize
  })
  .attr('y', 0)
  .style('text-anchor', 'middle')
  .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
  .attr('class', 'timeLabel mono axis axis-worktime')

var parser = d3.timeParse('%m/%d/%Y')
var formatter = d3.time.format('%w')

var heatmapChart = function(column) {
  d3.csv(
    'turnstiles_test.csv',
    function(d) {
      return {
        DATE: formatter(parser(d.DATE)),
        TIME: d.TIME.slice(0, d.TIME.indexOf(':')),
        ExitsDiff: +d.ExitsDiff,
        EntriesDiff: +d.EntriesDiff,
        Total: +d.Total
      }
    },

    function(error, data) {
      if (column == 'Entries') {
        column = 'EntriesDiff'
      } else if (column == 'Exits') {
        column = 'ExitsDiff'
      } else {
        column = 'Total'
      }

      console.log(data)

      formatComma = d3.format(',')

      var colorScale = d3.scale
        .quantile()
        .domain([
          d3.min(data, function(d) {
            return d[column]
          }),
          d3.max(data, function(d) {
            return d[column]
          })
        ])
        .range(colors)

      var cards = svg.selectAll('.hour').data(data, function(d) {
        return d.DATE + ':' + d.TIME
      })

      cards.append('title')

      cards
        .enter()
        .append('rect')
        .attr('x', function(d) {
          return Math.floor(d.TIME / 4) * gridSize
        })
        .attr('y', function(d) {
          if (d.DATE === '6') {
            return 0
          } else {
            return d.DATE * gridSize + gridSize
          }
        })
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('class', 'hour bordered')
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', colors[0])

      cards
        .transition()
        .duration(1000)
        .style('fill', function(d) {
          return colorScale(d[column])
        })

      cards.select('title').text(function(d) {
        return d[column]
      })

      cards.exit().remove()

      var legend = svg
        .selectAll('.legend')
        .data([0].concat(colorScale.quantiles()), function(d) {
          return d
        })

      legend
        .enter()
        .append('g')
        .attr('class', 'legend')

      legend
        .append('rect')
        .attr('y', function(d, i) {
          return legendElementHeight * i
        })
        .attr('x', height)
        .attr('height', legendElementHeight)
        .attr('width', gridSize / 2)
        .style('fill', function(d, i) {
          return colors[i]
        })

      legend
        .append('text')
        .attr('class', 'mono')
        .text(function(d) {
          return '≥ ' + formatComma(Math.round(d))
        })
        .attr('y', function(d, i) {
          return legendElementHeight * i + 0.5 * gridSize
        })
        .attr('x', height + gridSize)

      legend.exit().remove()

      function timeString(time) {
        if (time == '3') {
          return '11p - 3a'
        } else if (time < 12) {
          return `${time - 4}a - ${time}a`
        } else if (time < 17) {
          return `${time - 4}a - ${time - 12}p`
        } else {
          return `${time - 16}p - ${time - 12}p`
        }
      }

      var toolTip = d3
        .tip()
        .attr('class', 'tooltip')
        .html(function(d) {
          return `${timeString(d.TIME)}<hr>${formatComma(d[column])}`
        })

      cards
        .on('mouseover', function(d) {
          toolTip.show(d, this)
        })
        .on('mouseout', function(d) {
          toolTip.hide(d)
        })

      cards.call(toolTip)
    }
  )
}

heatmapChart('Entries')

var datasetpicker = d3
  .select('#dataset-picker')
  .selectAll('.dataset-button')
  .data(datasets)

datasetpicker
  .enter()
  .append('input')
  .attr('value', function(d) {
    return d
  })
  .attr('type', 'button')
  .attr('class', 'dataset-button')
  .on('click', function(d) {
    heatmapChart(d)
  })
