
export interface ApexOptions {
  chart: {
    type:
      | "donut"
      | "pie"
      | "line"
      | "area"
      | "bar"
      | "radialBar"
      | "scatter"
      | "bubble"
      | "heatmap"
      | "candlestick"
      | "boxPlot"
      | "radar"
      | "polarArea"
      | "rangeBar"
      | "rangeArea"
      | "treemap"
      | undefined;
  };

  title: {
    text: string;
    align: string;
  };

  labels: string[];
  colors: string[];
  responsive: [
    {
      breakpoint: number;
      options: {
        chart: {
          width: number;
        };
        legend: {
          position: string;
        };
      };
    }
  ];
  legend: {
    show: boolean;
  };
}
