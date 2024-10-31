import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import axios from "axios";

export default function HomePage() {
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
    const fetchRecentTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/transactions/recent"
        );

        if (response.data.success) {
          const aggregatedData = aggregateData(response.data.data);
          setData(aggregatedData);
        }
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }
    };

    fetchRecentTransactions();

    const eventSource = new EventSource(
      "http://localhost:3000/api/transactions/sse"
    );

    eventSource.onmessage = (event) => {
      const newTransaction = JSON.parse(event.data);
      newTransaction.timestamp = roundToMinute(newTransaction.timestamp);

      setData((prevData) => {
        const updatedData = [...prevData];
        const existingEntry = updatedData.find(
          (entry) => entry.timestamp === newTransaction.timestamp
        );

        if (existingEntry) {
          existingEntry.total += 1;
          existingEntry[newTransaction.status.toLowerCase()] += 1;
        } else {
          updatedData.push({
            timestamp: newTransaction.timestamp,
            total: 1,
            success: newTransaction.status === "success" ? 1 : 0,
            ongoing: newTransaction.status === "ongoing" ? 1 : 0,
            error: newTransaction.status === "error" ? 1 : 0,
          });
        }

        return filterData(updatedData, 2);
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const LineChartComponent = ({ title, dataKey, color, hours }) => {
    const filteredData = filterData(data, hours);
    return (
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="chartBackground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4D8FB" stopOpacity={1} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
              </linearGradient>
            </defs>
            <rect
              x={60}
              y={20}
              width="calc(100% - 90px)"
              height="calc(100% - 40px)"
              fill="url(#chartBackground)"
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tick) => format(new Date(tick), "hh:mm a")}
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
                `Time: ${format(new Date(label), "hh:mm a")}`
              }
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotoneX"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
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
            <LineChart
              data={filterData(data, 2)}
              margin={{ top: 20, right: 30, left: 5, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="totalChartBackground"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#C08DFD" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                </linearGradient>
              </defs>

              <rect
                x={65}
                y={20}
                width="calc(100% - 95px)"
                height="calc(100% - 40px)"
                fill="url(#totalChartBackground)"
              />

              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(tick) => format(new Date(tick), "hh:mm a")}
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
                  `Time: ${format(new Date(label), "hh:mm a")}`
                }
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line
                type="monotoneX"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
                name="Total Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LineChartComponent
          title="Success Transactions"
          dataKey="success"
          color="#82ca9d"
          hours={1}
        />
        <LineChartComponent
          title="Ongoing Transactions"
          dataKey="ongoing"
          color="#ffc658"
          hours={1}
        />
        <LineChartComponent
          title="Error Transactions"
          dataKey="error"
          color="#ff4d4f"
          hours={1}
        />
      </div>
    </div>
  );
}