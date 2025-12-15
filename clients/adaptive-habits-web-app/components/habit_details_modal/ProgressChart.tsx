import { HabitEntryClean } from "@/types";
import { TimeChart, ChartType } from "../time_chart/TimeChart";
import {
  DataSet,
  DataPoint,
  DatasetOptions,
} from "../time_chart/chart_renderers/ChartRenderer";

interface ProgressChartProps {
  snapshots: HabitEntryClean[];
}

function getDatasetsFromSnapshots(snapshots: HabitEntryClean[]): DataSet[] {
  const dataSets: DataSet[] = [];

  const optionsPreset: DatasetOptions = {
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
    dataPoints: snapshots.map((v, i) => {
      const point: DataPoint = {
        date: new Date(v.log_date),
        value: v.value,
      };
      return point;
    }),
    options: optionsPreset,
  });

  dataSets.push({
    dataPoints: snapshots.map((v, i) => {
      const point: DataPoint = {
        date: new Date(v.log_date),
        value: v.target_snapshot,
      };
      return point;
    }),
    options: optionsPreset,
  });

  console.log(dataSets);
  return dataSets;
}

export function ProgressChart({ snapshots }: ProgressChartProps) {
  // const today = new Date();
  // const data: DataSet = {dataPoints:[
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), value: 50},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), value: 12},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), value: 34},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 11), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12), value: 50},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13), value: 34},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 16), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 17), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 18), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 19), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 21), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 22), value: 12},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 23), value: 34},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 24), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25), value: 98},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 26), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 27), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 28), value: 53},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30), value: 53},
  // ]}
  // data.dataPoints.sort( (a,b) => a.date.valueOf() - b.date.valueOf() );

  // const data2: DataSet = {dataPoints:[
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), value: 20},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), value: 70},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), value: 32},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), value: 34},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4), value: 33},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), value: 94},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), value: 43},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), value: 78},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8), value: 73},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9), value: 78},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10), value: 73},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 11), value: 78},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12), value: 70},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13), value: 74},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14), value: 73},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15), value: 78},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 16), value: 73},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 17), value: 78},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 18), value: 73},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 19), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20), value: 43},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 21), value: 58},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 22), value: 52},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 23), value: 54},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 24), value: 43},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25), value: 48},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 26), value: 43},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 27), value: 48},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 28), value: 43},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29), value: 48},
  //   {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30), value: 43},
  // ]}
  // data2.dataPoints.sort( (a,b) => a.date.valueOf() - b.date.valueOf() );

  // const dataSets: DataSet[] = [data, data2]

  return (
    <TimeChart
      dataSets={getDatasetsFromSnapshots(snapshots)}
      type={ChartType.LINE}
    />
  );
}
