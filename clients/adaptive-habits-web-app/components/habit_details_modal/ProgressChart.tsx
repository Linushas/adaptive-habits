import { HabitEntryClean } from "@/types";
import { TimeChart, ChartType } from "../time_chart/TimeChart";
import {
  DataSet,
  DataPoint,
  DatasetOptions,
} from "../time_chart/chart_renderers/ChartRenderer";
import { getToday } from "@/lib/utils";

interface ProgressChartProps {
  snapshots: HabitEntryClean[];
  type: ChartType;
}

function getDatasetsFromSnapshots(snapshots: HabitEntryClean[]): DataSet[] {
  const dataSets: DataSet[] = [];

  const targetOptions: DatasetOptions = {
    colors: {
      line: "rgba(255,255,255,0.4)",
      dots: "rgba(255,255,255,0.4)",
    },
    line: {
      isDashed: true,
      showDots: false,
    },
  };

  const valueOptions: DatasetOptions = {
    colors: {
      line: "#ffffff",
      dots: "#ffffff",
    },
    line: {
      isDashed: false,
      showDots: false,
    },
  };

  dataSets.push({
    dataPoints: snapshots.flatMap((v) => {
      const point: DataPoint = {
        date: new Date(v.log_date),
        value: v.value,
      };

      if (point.date <= getToday()) {
        return [point];
      } else {
        return [];
      }
    }),
    options: valueOptions,
  });
  dataSets[0].dataPoints.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  dataSets.push({
    dataPoints: snapshots.flatMap((v) => {
      const point: DataPoint = {
        date: new Date(v.log_date),
        value: v.target_snapshot,
      };
      return [point];
    }),
    options: targetOptions,
  });
  dataSets[1].dataPoints.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  console.log(dataSets);
  return dataSets;
}

export function ProgressChart({
  snapshots,
  type = ChartType.STEP,
}: ProgressChartProps) {
  return (
    <TimeChart dataSets={getDatasetsFromSnapshots(snapshots)} type={type} />
  );
}
