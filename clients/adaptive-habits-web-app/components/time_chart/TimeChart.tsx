import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LineChartRenderer } from "./chart_renderers/LineChartRenderer";
import {
  ChartConfig,
  ChartRenderer,
  DataSet,
} from "./chart_renderers/ChartRenderer";
import { HeatmapChartRenderer } from "./chart_renderers/HeatmapChartRenderer";
import { StepChartRenderer } from "./chart_renderers/StepChartRenderer";

interface ChartProps {
  dataSets: DataSet[];
  width?: number;
  height?: number;
  padding?: number;
  type?: ChartType;
}

export enum ChartType {
  LINE,
  BAR,
  HEATMAP,
  STEP,
}

function newRenderer(
  type: ChartType,
  element: SVGSVGElement,
  config: ChartConfig
): ChartRenderer {
  switch (type) {
    case ChartType.LINE:
      return new LineChartRenderer(element, config);
    case ChartType.HEATMAP:
      return new HeatmapChartRenderer(element, config);
    case ChartType.STEP:
      return new StepChartRenderer(element, config);
    default:
      return new LineChartRenderer(element, config);
  }
}

const useDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((element: HTMLElement | null) => {
    setNode(element);
  }, []);

  useLayoutEffect(() => {
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [ref, dimensions] as const;
};

export const TimeChart = ({
  dataSets,
  padding = 40,
  type = ChartType.LINE,
}: ChartProps) => {
  const [containerRef, dimensions] = useDimensions();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const chartRenderer = useRef<ChartRenderer | null>(null);

  useEffect(() => {
    if (!dataSets) return;
    if (!svgRef.current) return;
    if (chartRenderer.current) {
      chartRenderer.current.clear();
    }

    const config: ChartConfig = {
      w: dimensions.width,
      h: dimensions.height,
      p: padding,
      options: {
        colors: {
          grid: "rgba(255,255,255,0.1)",
          axis: "rgba(255,255,255,0.7)",
          labels: "rgba(255,255,255,0.7)",
        },
        axis: {
          showX: true,
          showY: true,
        },
        grid: {
          show: true,
        },
      },
    };

    chartRenderer.current = newRenderer(type, svgRef.current, config);
    chartRenderer.current.draw(dataSets);
  }, [type, dimensions.width, dimensions.height, padding]);

  useEffect(() => {
    if (!chartRenderer.current) return;
    chartRenderer.current.draw(dataSets);
  }, [dataSets]);

  return (
    <div
      ref={containerRef}
      className="max-h-90 h-full bg-bg-light-2 rounded-lg max-w-full w-full overflow-hidden"
    >
      {dimensions.width > 0 && (
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      )}
    </div>
  );
};
