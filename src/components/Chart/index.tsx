"use client";
import styles from "./styles.module.css";

import { ApexOptions } from "../../pages/api/interface";
import ApexChat from "react-apexcharts";

export default function Chart({ series }: { series: number[] }) {
  const options: ApexOptions | any = {
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
    responsive: [
      {
        breakpoint: 500,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      show: false,
    },
  };

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

export const getServerSideProps = async () => {
  return {
    props: {
      // Seus dados de inicialização aqui
      series: [0, 0, 0, 0, 0, 0],
      ssr: false
    },
  };
};


/*

boa noite estou enfrentando um erro em um projeto next, o erro ocorre nesse componenete
"Server Error
ReferenceError: window is not defined

This error happened while generating the page. Any console logs will be displayed in the terminal window."

"use client";
import styles from "./styles.module.css";

import { ApexOptions } from "../../pages/api/interface";
import ApexChat from "react-apexcharts";

export default function Chart({ series }: { series: number[] }) {
  const options: ApexOptions | any = {
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
    responsive: [
      {
        breakpoint: 500,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      show: false,
    },
  };

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





*/



  /*
  
  em um projeto next estou lidando com o seguinte erro "   Server Error
ReferenceError: window is not defined

This error happened while generating the page. Any console logs will be displayed in the terminal window.   "

  porém percebi q o q está me dando esse erro é esse trecho de código
import ApexChat from "react-apexcharts";
  <ApexChat
        className={styles.chart}
        options={options}
        series={series}
        type="pie"
      /> 
  
  */
