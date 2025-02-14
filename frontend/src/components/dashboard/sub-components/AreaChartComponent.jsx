import React from "react";
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
import { filterData } from "../utils/dataUtils";

const AreaChartComponent = ({ data, title, dataKey, color, hours }) => {
  const filteredData = filterData(data, hours);
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id={`${dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
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
            labelFormatter={(label) => `Time: ${format(new Date(label), "HH:mm")}`}
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

export default AreaChartComponent;
