import { select as d3Select, Selection } from 'd3-selection'
import { hsl as d3Hsl } from 'd3-color'

import utils from '../utils'
import evaluate from '../evaluate'

import { Chart } from '../index'
import { FunctionPlotDatum } from '../types'

export default function scatter(chart: Chart) {
  const xScale = chart.meta.xScale
  const yScale = chart.meta.yScale

  function scatter(selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each(function (d) {
      let i, j
      const index = d.index
      const color = utils.color(d, index)
      const evaluatedData = evaluate(chart, d)

      // scatter doesn't need groups, therefore each group is
      // flattened into a single array
      const joined = []
      for (i = 0; i < evaluatedData.length; i += 1) {
        for (j = 0; j < evaluatedData[i].length; j += 1) {
          joined.push(evaluatedData[i][j])
        }
      }

      const innerSelection = d3Select(this)
        .selectAll('circle')
        .data(joined)

      const innerSelectionEnter = innerSelection.enter()
        .append('circle')

      const selectionCircle = innerSelection.merge(innerSelectionEnter)
        .attr('fill', color)
        .attr('opacity', 0.8)
        .attr('r', 2)
        .attr('cx', function (d) { return xScale(d[0]) })
        .attr('cy', function (d) { return yScale(d[1]) });

      const innerSelectionText = d3Select(this)
        .selectAll(':scope > text')
        .data(joined)

      const innerSelectionEnterText = innerSelectionText.enter()
        .append('text')

      const selectionText = innerSelectionText.merge(innerSelectionEnterText)
        .attr('fill', color)
        .attr('opacity', 0.8)
        // .attr('r', 3)
        .attr('x', function (d) { return xScale(d[0])+5 })
        .attr('y', function (d) { return yScale(d[1])-5 })
        .text(function (d) { return `( ${d[0]} , ${d[1]} )` });

      const selection = selectionCircle.merge(selectionText);

      if (d.attr) {
        for (let k in d.attr) {
          if (d.attr.hasOwnProperty(k)) {
            selection.attr(k, d.attr[k])
          }
        }
      }

      innerSelection.exit().remove()
    })
  }

  return scatter
}
