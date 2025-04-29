import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./ActivityPieChart.module.css";
import apiClient from "../config/apiClient";
 // Replace with your actual apiClient import

const ActivityPieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const pieChartData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const regId = userData?.secretary_details[0]?.reg_id;
      const response = await apiClient.get(`/event_analytics?reg_id=${regId}`);
      
      const responseData = response?.data;
      console.log(responseData, "Pie Chart API Response");

      if (responseData) {
        const formattedData = [
          { name: "Flagship", value: responseData.Flagship || 0, color: "#f4984e" },
          { name: "Monthly", value: responseData.Monthly || 0, color: "#4a6da7" },
          { name: "Regular", value: responseData.Regular || 0, color: "#6a9de3" },
        ];
        setData(formattedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pieChartData();
  }, []);

  const COLORS = data.map((item) => item.color);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>
            {`${payload[0].value} activities (${(payload[0].payload.percent * 100).toFixed(0)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.pieContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>📊</span> Activity By Theme
        </h2>
      </div>

      <div className={styles.chartContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={styles.legend}>
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: entry.color }}></div>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPieChart;
