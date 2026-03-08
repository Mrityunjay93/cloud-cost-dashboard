import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale
);

function CostChart({ data }) {
  if (!data?.length) {
    return <p className="info-text">No resource data for this project yet.</p>;
  }

  const chartData = {
    labels: data.map(r => r.name),
    datasets: [
      {
        label: "Cost",
        data: data.map(r => Number(r.total_cost || 0)),
        backgroundColor: "rgba(15, 118, 110, 0.75)",
        borderRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;

}

export default CostChart;
