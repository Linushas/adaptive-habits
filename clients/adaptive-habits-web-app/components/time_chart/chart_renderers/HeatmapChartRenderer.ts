import * as d3 from "d3";
import { ChartRenderer, DataSet } from "./ChartRenderer";

export class HeatmapChartRenderer extends ChartRenderer {
  public draw(data: DataSet[]) {
    this.clear();

    const rawPoints = data[0]?.dataPoints || [];
    if (rawPoints.length === 0) return;

    const cellSize = 14;
    const cellPadding = 2;
    const yearHeight = cellSize * 7 + cellPadding * 7;
    const formatDay = d3.timeFormat("%Y-%m-%d");
    const timeWeek = d3.timeMonday;

    const endDate = d3.max(rawPoints, (d) => d.date) || new Date();
    let startDate =
      d3.min(rawPoints, (d) => d.date) || d3.timeYear.offset(endDate, -1);
    startDate = timeWeek.floor(startDate);

    const dataMap = new Map(rawPoints.map((d) => [formatDay(d.date), d.value]));
    const daysRange = d3.timeDays(startDate, d3.timeDay.offset(endDate, 1));

    const gridData = daysRange.map((date) => ({
      date: date,
      value: dataMap.get(formatDay(date)) || 0,
    }));

    const maxVal = d3.max(rawPoints, (d) => d.value) || 1;

    const colorScale = d3
      .scaleSequential(d3.interpolateGreens)
      .domain([0, maxVal]);

    const containerGroup = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.padding + 20}, ${this.padding + 20})`
      );

    containerGroup
      .append("g")
      .selectAll("rect")
      .data(gridData)
      .join("rect")
      .attr("width", cellSize - cellPadding)
      .attr("height", cellSize - cellPadding)
      .attr("x", (d) => {
        return timeWeek.count(startDate, d.date) * cellSize;
      })
      .attr("y", (d) => {
        return ((d.date.getDay() + 6) % 7) * cellSize;
      })
      .attr("fill", (d) =>
        d.value === 0 ? "rgba(255,255,255,0.05)" : colorScale(d.value)
      )
      .attr("rx", 2)
      .append("title")
      .text((d) => `${formatDay(d.date)}: ${d.value}`);

    const dayLabels = ["Mon", "Wed", "Fri"];
    const dayLabelPositions = [0, 2, 4];

    containerGroup
      .append("g")
      .attr("class", "day-labels")
      .attr("transform", `translate(-5, ${cellSize / 1.5})`)
      .selectAll("text")
      .data(dayLabels)
      .join("text")
      .attr("y", (d, i) => dayLabelPositions[i] * cellSize)
      .text((d) => d)
      .attr("text-anchor", "end")
      .attr("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "10px")
      .style("font-family", "sans-serif");

    const months = d3.timeMonths(startDate, endDate);

    containerGroup
      .append("g")
      .attr("class", "month-labels")
      .attr("transform", `translate(0, -5)`)
      .selectAll("text")
      .data(months)
      .join("text")
      .attr("x", (d) => timeWeek.count(startDate, d) * cellSize)
      .text(d3.timeFormat("%b"))
      .attr("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "10px")
      .style("font-family", "sans-serif");
  }
}
