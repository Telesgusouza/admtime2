import dynamic from "next/dynamic";
import styles from "./styles.module.css";


const ApexChat = dynamic(() => import("react-apexcharts"));
const options: any = {
  chart: {
    type: "pie" as "pie",
  },

  title: {
    text: "",
    align: "left",
  },

  labels: ["Trabalho", "Jogos", "Estudos", "Exercicios", "Social", "Sáude "],
  colors: [
    "hsl(15, 100%, 70%)",
    "hwb(195 34% 10%)",
    "hsl(348, 100%, 68%)",
    "hsl(145, 58%, 55%)",
    "hsl(264, 64%, 52%)",
    "hsl(43, 84%, 65%)",
  ],
  
  legend: {
    show: false,
  },
};

export default function Chart({ series }: { series: number[] }) {
  return (
    <>
      <ApexChat
        className={styles.chart}
        options={options}
        series={series}
        type="pie"
      />
    </>
  );
}
