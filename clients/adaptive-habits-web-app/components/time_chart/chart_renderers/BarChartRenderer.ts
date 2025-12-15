import * as d3 from "d3";
import { ChartRenderer, DataSet } from "./ChartRenderer";

export class BarChartRenderer extends ChartRenderer {
  public draw(data: DataSet[]) {
    this.clear();

    const allPoints = data.flatMap((d) => d.dataPoints);
    const uniqueDates = Array.from(
      new Set(allPoints.map((d) => d.date.toDateString()))
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const yMax = d3.max(allPoints, (d) => d.value) || 0;

    const xScale = d3
      .scaleBand()
      .domain(uniqueDates)
      .range([this.padding, this.width - this.padding])
      .padding(0.2);

    const xSubScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, xScale.bandwidth()])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax * 1.1])
      .range([this.height - this.padding, this.padding]);

    this.svg
      .append("g")
      .attr("class", "grid-horizontal")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-dasharray", "4,4")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-this.width + this.padding * 2)
          .tickFormat(() => "")
      )
      .attr("transform", `translate(${this.padding},0)`)
      .select(".domain")
      .remove();

    data.forEach((dataSet, index) => {
      this.svg
        .append("g")
        .selectAll("rect")
        .data(dataSet.dataPoints)
        .join("rect")
        .attr(
          "x",
          (d) =>
            (xScale(d.date.toDateString()) || 0) +
            (xSubScale(index.toString()) || 0)
        )
        .attr("y", (d) => yScale(d.value))
        .attr("width", xSubScale.bandwidth())
        .attr("height", (d) => this.height - this.padding - yScale(d.value))
        .attr("fill", index === 0 ? "white" : "rgba(255,255,255,0.3)")
        .attr("rx", 2);
    });

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
      const date = new Date(d);
      return d3.timeFormat("%d %b")(date);
    });

    const maxTicks = Math.floor(this.width / 70);
    const modulo = Math.ceil(uniqueDates.length / maxTicks);

    xAxis.tickValues(uniqueDates.filter((_, i) => i % modulo === 0));

    this.svg
      .append("g")
      .attr("transform", `translate(0,${this.height - this.padding})`)
      .call(xAxis)
      .attr("class", "text-white text-xs")
      .style("font-family", "sans-serif")
      .call((g) => g.select(".domain").remove());

    this.svg
      .append("g")
      .attr("transform", `translate(${this.padding},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .attr("class", "text-white text-xs")
      .style("font-family", "sans-serif")
      .call((g) => g.select(".domain").remove());
  }
}
