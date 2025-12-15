import * as d3 from "d3";
import { ChartRenderer, DataPoint, DataSet } from "./ChartRenderer";

export class LineChartRenderer extends ChartRenderer {
  private addDataset(
    data: DataPoint[],
    lineGenerator: d3.Line<DataPoint>,
    dasharray = false,
    showDots = false,
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>
  ) {
    if (dasharray) {
      this.svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.4)")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", lineGenerator);
    } else {
      this.svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);
    }

    if (showDots) {
      this.svg
        .append("g")
        .attr("fill", "white")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 3);
    }
  }

  public draw(data: DataSet[]) {
    this.clear();

    const allPoints = data.flatMap((d) => d.dataPoints);

    const xExtent = d3.extent(allPoints, (d) => d.date) as [Date, Date];
    const yMax = d3.max(allPoints, (d) => d.value) || 0;
    const yMargin = 0.1;

    const stepSizeX = 5;
    const stepSizeY = 5;
    const showAxes = true;

    const xScale = d3
      .scaleTime()
      .domain(xExtent)
      .range([this.padding, this.width - this.padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax * (1.0 + yMargin)])
      .range([this.height - this.padding, this.padding]);

    this.svg
      .append("g")
      .attr("class", "grid-horizontal")
      .attr("fill", "none")
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

    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));

    // data.forEach(dataSet => {
    //   this.addDataset(dataSet.dataPoints, lineGenerator, false, false, xScale, yScale);
    // });
    this.addDataset(
      data[0].dataPoints,
      lineGenerator,
      false,
      false,
      xScale,
      yScale
    );
    this.addDataset(
      data[1].dataPoints,
      lineGenerator,
      true,
      false,
      xScale,
      yScale
    );

    if (showAxes) {
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.height - this.padding})`)
        .call(
          d3.axisBottom(xScale).ticks(stepSizeX)
          // .tickFormat(d3.timeFormat("%d %b"))
        )
        .attr("class", "text-white text-xs")
        .style("font-family", "sans-serif")
        .call((g) => g.select(".domain").remove());

      this.svg
        .append("g")
        .attr("transform", `translate(${this.padding},0)`)
        .call(d3.axisLeft(yScale).ticks(stepSizeY))
        .attr("class", "text-white text-xs")
        .style("font-family", "sans-serif")
        .call((g) => g.select(".domain").remove());
    }
  }
}
