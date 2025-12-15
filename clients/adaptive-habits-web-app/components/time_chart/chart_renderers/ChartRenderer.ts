import * as d3 from "d3";

export interface ChartOptions {
  colors: {
    grid: string;
    axis: string;
    labels: string;
  };
  axis: {
    showX: boolean;
    showY: boolean;
    dateLabelFormat?: string;
  };
  grid: {
    show: boolean;
  };
}

export interface ChartConfig {
  w: number;
  h: number;
  p: number;
  options: ChartOptions;
}

export interface DatasetOptions {
  colors: {
    line: string;
    dots: string;
  };
  line: {
    isDashed: boolean;
    showDots: boolean;
  };
}

export interface DataSet {
  dataPoints: DataPoint[];
  options: DatasetOptions;
}

export interface DataPoint {
  date: Date;
  value: number;
}

export abstract class ChartRenderer {
  protected svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  protected width: number;
  protected height: number;
  protected padding: number;
  protected options: ChartOptions;

  constructor(element: SVGSVGElement, config: ChartConfig) {
    this.svg = d3.select(element);
    this.width = config.w;
    this.height = config.h;
    this.padding = config.p;
    this.options = config.options;
  }

  public clear() {
    this.svg.selectAll("*").remove();
  }

  public abstract draw(data: DataSet[]): void;
}
