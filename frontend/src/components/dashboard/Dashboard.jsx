// dashboard/Dashboard.jsx
import React from "react";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useDashboardData } from "./hooks/useDashboardData";
import { filterData } from "./utils/dataUtils";
import AreaChartComponent from "./sub-components/AreaChartComponent";

export default function Dashboard() {
  const data = useDashboardData();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-20">Dashboard</h2>
      {/* Total Transactions Chart */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-4">Total Transactions</h3>
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={filterData(data, 2)} margin={{ top: 20, right: 30, left: 5, bottom: 20 }}>
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
                labelFormatter={(label) => `Time: ${format(new Date(label), "HH:mm")}`}
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

      {/* Individual Transaction Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AreaChartComponent data={data} title="Success Transactions" dataKey="success" color="#82ca9d" hours={1} />
        <AreaChartComponent data={data} title="Ongoing Transactions" dataKey="ongoing" color="#ffc658" hours={1} />
        <AreaChartComponent data={data} title="Error Transactions" dataKey="error" color="#ff4d4f" hours={1} />
      </div>
    </div>
  );
}
