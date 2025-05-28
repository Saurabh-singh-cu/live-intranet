import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./ActivityBarGraph.module.css";
import { useEffect, useState } from "react";
import apiClient from "../config/apiClient";

const ActivityBarGraph = () => {
  const [loading, setLoading] = useState(false);
  const [monthlyActivity, setMonthlyActivity] = useState([]);

  useEffect(() => {
    barGraphData();
  }, []);

  const barGraphData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const regId =
        userData.secretary_details[0].reg_id ||
        userData.faculty_advisory_details.reg_id;
      const response = await apiClient.get(
        `/monthly_activity_analytics/?reg_id=${regId}`
      );

      console.log(response?.data, "((((((((((((((((((((((((((");

      if (response?.data?.monthly_activity) {
        const transformedData = Object.entries(
          response.data.monthly_activity
        ).map(([month, value]) => ({
          name: month,
          activity: value,
        }));
        setMonthlyActivity(transformedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.graphContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>📊</span> Activity Monthly Overview
        </h2>
      </div>

      <div className={styles.chartContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyActivity}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${value}`, "Activities"]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={() => "Activities"}
              />
              <Bar dataKey="activity" fill="#4a6da7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ActivityBarGraph;
