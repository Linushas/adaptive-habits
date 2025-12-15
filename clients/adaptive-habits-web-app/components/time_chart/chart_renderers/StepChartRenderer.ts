import * as d3 from "d3";
import { ChartRenderer, DataPoint, DataSet } from "./ChartRenderer";

export class StepChartRenderer extends ChartRenderer {
  private addDataset(
    data: DataPoint[],
    lineGenerator: d3.Line<DataPoint>,
    color: string,
    isDashed = false
  ) {
    this.svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", isDashed ? "5,5" : "none")
      .attr("d", lineGenerator);

    if (data.length > 1) {
      const realLastPoint = data[data.length - 1];
      this.svg
        .append("circle")
        .attr("cx", this.xScale(realLastPoint.date))
        .attr("cy", this.yScale(realLastPoint.value))
        .attr("r", 3)
        .attr("fill", color);
    }
  }

  private xScale: d3.ScaleTime<number, number, never> = d3.scaleTime();
  private yScale: d3.ScaleLinear<number, number, never> = d3.scaleLinear();

  public draw(data: DataSet[]) {
    this.clear();

    const allPoints = data.flatMap((d) => d.dataPoints);
    if (allPoints.length === 0) return;

    const globalXExtent = d3.extent(allPoints, (d) => d.date) as [Date, Date];
    const yMax = d3.max(allPoints, (d) => d.value) || 0;

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const stepDuration = ONE_DAY;

    this.xScale = d3
      .scaleTime()
      .domain([
        globalXExtent[0],
        new Date(globalXExtent[1].getTime() + stepDuration),
      ])
      .range([this.padding, this.width - this.padding]);

    this.yScale = d3
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
          .axisLeft(this.yScale)
          .tickSize(-this.width + this.padding * 2)
          .tickFormat(() => "")
      )
      .attr("transform", `translate(${this.padding},0)`)
      .select(".domain")
      .remove();

    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => this.xScale(d.date))
      .y((d) => this.yScale(d.value))
      .curve(d3.curveStepAfter);

    data.forEach((dataSet, index) => {
      const color = index === 0 ? "white" : "rgba(255,255,255,0.4)";
      const isDashed = index > 0;

      const extendedPoints = [...dataSet.dataPoints];

      if (extendedPoints.length > 0) {
        const localLastPoint = extendedPoints[extendedPoints.length - 1];
        extendedPoints.push({
          date: new Date(localLastPoint.date.getTime() + stepDuration),
          value: localLastPoint.value,
        });
      }

      this.addDataset(extendedPoints, lineGenerator, color, isDashed);
    });

    this.svg
      .append("g")
      .attr("transform", `translate(0,${this.height - this.padding})`)
      .call(
        d3.axisBottom(this.xScale).ticks(5)
        // .tickFormat(d3.timeFormat("%d %b") as any)
      )
      .attr("class", "text-white text-xs")
      .style("font-family", "sans-serif")
      .call((g) => g.select(".domain").remove());

    this.svg
      .append("g")
      .attr("transform", `translate(${this.padding},0)`)
      .call(d3.axisLeft(this.yScale).ticks(5))
      .attr("class", "text-white text-xs")
      .style("font-family", "sans-serif")
      .call((g) => g.select(".domain").remove());
  }
}
