import { useState, useEffect } from "react";
import { fetchDashboardData } from "../api/dashboardApi";

export const useDashboardData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchDashboardData();
      setData(result);
    };

    getData();
  }, []);

  return data;
};
