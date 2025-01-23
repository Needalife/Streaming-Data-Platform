import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState([]);

  const roundToMinute = (timestamp) => {
    const date = new Date(timestamp);
    date.setSeconds(0, 0);
    return date.toISOString();
  };

  const filterData = (allData, hours) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    return allData.filter((entry) => new Date(entry.timestamp) >= cutoff);
  };

  const aggregateData = (transactions) => {
    const groupedData = transactions.reduce((acc, transaction) => {
      const roundedTimestamp = roundToMinute(transaction.timestamp);
      const existing = acc.find(
        (entry) => entry.timestamp === roundedTimestamp
      );

      if (existing) {
        existing.total += 1;
        existing[transaction.status.toLowerCase()] += 1;
      } else {
        acc.push({
          timestamp: roundedTimestamp,
          total: 1,
          success: transaction.status === "success" ? 1 : 0,
          ongoing: transaction.status === "ongoing" ? 1 : 0,
          error: transaction.status === "error" ? 1 : 0,
        });
      }
      return acc;
    }, []);

    return groupedData;
  };

  useEffect(() => {
    const fakeData = [
      {
        timestamp: "2024-11-02T13:00:00Z",
        total: 2,
        success: 1,
        ongoing: 1,
        error: 0,
      },
      {
        timestamp: "2024-11-02T13:10:00Z",
        total: 3,
        success: 2,
        ongoing: 1,
        error: 0,
      },
      {
        timestamp: "2024-11-02T13:20:00Z",
        total: 1,
        success: 1,
        ongoing: 0,
        error: 0,
      },
      {
        timestamp: "2024-11-02T13:30:00Z",
        total: 4,
        success: 3,
        ongoing: 1,
        error: 0,
      },
      {
        timestamp: "2024-11-02T13:40:00Z",
        total: 2,
        success: 1,
        ongoing: 0,
        error: 1,
      },
      {
        timestamp: "2024-11-02T13:50:00Z",
        total: 3,
        success: 2,
        ongoing: 0,
        error: 1,
      },
      {
        timestamp: "2024-11-02T14:00:00Z",
        total: 1,
        success: 1,
        ongoing: 0,
        error: 0,
      },
      {
        timestamp: "2024-11-02T14:10:00Z",
        total: 2,
        success: 1,
        ongoing: 1,
        error: 0,
      },
      {
        timestamp: "2024-11-02T14:20:00Z",
        total: 3,
        success: 1,
        ongoing: 2,
        error: 0,
      },
      {
        timestamp: "2024-11-02T14:30:00Z",
        total: 2,
        success: 2,
        ongoing: 0,
        error: 0,
      },
    ];

    setData(fakeData);
  }, []);


  const AreaChartComponent = ({ title, dataKey, color, hours }) => {
    const filteredData = filterData(data, hours);
    return (
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient
                id={`${dataKey}Gradient`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tick) => format(new Date(tick), "HH:mm")}
              tick={{ fill: "#666" }}
              interval="preserveStartEnd"
              tickCount={6}
            />
            <YAxis domain={["auto", "auto"]} tick={{ fill: "#666" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "5px",
              }}
              labelFormatter={(label) =>
                `Time: ${format(new Date(label), "HH:mm")}`
              }
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={`url(#${dataKey}Gradient)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-20">Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-4">Total Transactions</h3>
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart
              data={filterData(data, 2)}
              margin={{ top: 20, right: 30, left: 5, bottom: 20 }}
            >
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8884d8" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(tick) => format(new Date(tick), "HH:mm")}
                tick={{ fill: "#666" }}
                interval="preserveStartEnd"
                tickCount={6}
              />
              <YAxis domain={["auto", "auto"]} tick={{ fill: "#666" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "5px",
                }}
                labelFormatter={(label) =>
                  `Time: ${format(new Date(label), "HH:mm")}`
                }
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fill="url(#totalGradient)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
                name="Total Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AreaChartComponent
          title="Success Transactions"
          dataKey="success"
          color="#82ca9d"
          hours={1}
        />
        <AreaChartComponent
          title="Ongoing Transactions"
          dataKey="ongoing"
          color="#ffc658"
          hours={1}
        />
        <AreaChartComponent
          title="Error Transactions"
          dataKey="error"
          color="#ff4d4f"
          hours={1}
        />
      </div>
    </div>
  );
}