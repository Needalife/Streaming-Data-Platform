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

export default function HomePage() {
  const [data, setData] = useState([]);

  const roundToMinute = (timestamp) => {
    const date = new Date(timestamp);
    date.setSeconds(0, 0);
    return date.toISOString();
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const savedData = localStorage.getItem(today);
    if (savedData) {
      setData(JSON.parse(savedData));
    }

    const eventSource = new EventSource("http://localhost:3000/api/transactions/sse");

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

        localStorage.setItem(today, JSON.stringify(updatedData));

        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        return updatedData.filter((entry) => new Date(entry.timestamp) >= twoHoursAgo);
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const LineChartComponent = ({ title, dataKey, color }) => (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => format(new Date(tick), 'hh:mm a')}
            tick={{ fill: "#666" }}
            interval="preserveStartEnd"
            tickCount={6}
          />
          <YAxis domain={['auto', 'auto']} tick={{ fill: "#666" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", padding: "5px" }}
            labelFormatter={(label) => `Time: ${format(new Date(label), 'hh:mm a')}`}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          <Line
            type="monotoneX"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-20">Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-4">Total Transactions</h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(tick) => format(new Date(tick), 'hh:mm a')}
                tick={{ fill: "#666" }}
                interval="preserveStartEnd"
                tickCount={6}
              />
              <YAxis domain={['auto', 'auto']} tick={{ fill: "#666" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", padding: "5px" }}
                labelFormatter={(label) => `Time: ${format(new Date(label), 'hh:mm a')}`}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line
                type="monotoneX"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Total Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <LineChartComponent title="Success Transactions" dataKey="success" color="#82ca9d" />
        <LineChartComponent title="Ongoing Transactions" dataKey="ongoing" color="#ffc658" />
        <LineChartComponent title="Error Transactions" dataKey="error" color="#ff4d4f" />
      </div>
    </div>
  );
}