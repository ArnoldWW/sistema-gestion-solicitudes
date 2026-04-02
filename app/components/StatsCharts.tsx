"use client";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type StatsChartsProps = {
  userStatsJson: string;
  requestStatsJson: string;
};

export default function StatsCharts({
  userStatsJson,
  requestStatsJson
}: StatsChartsProps) {
  const userStats = JSON.parse(userStatsJson);
  const requestStats = JSON.parse(requestStatsJson);

  const userData = {
    labels: userStats.map((stat: any) => stat.role),
    datasets: [
      {
        label: "Usuarios",
        data: userStats.map((stat: any) => stat.count),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"]
      }
    ]
  };

  const requestData = {
    labels: requestStats.map((stat: any) => stat.status),
    datasets: [
      {
        label: "Solicitudes",
        data: requestStats.map((stat: any) => stat.count),
        backgroundColor: ["#10B981", "#F59E0B", "#3B82F6"]
      }
    ]
  };

  return (
    <>
      <h2 className="mt-10">Gráficos</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
        <div>
          <h3 className="mb-3">Usuarios por Rol</h3>
          {userStats.length === 0 ? (
            <p>No se encontraron usuarios para mostrar el gráfico.</p>
          ) : (
            <Bar data={userData} />
          )}
        </div>
        <div>
          <h3 className="mb-3">Solicitudes por Estado</h3>
          {requestStats.length === 0 ? (
            <p>No se encontraron solicitudes para mostrar el gráfico.</p>
          ) : (
            <Pie data={requestData} />
          )}
        </div>
      </div>
    </>
  );
}
