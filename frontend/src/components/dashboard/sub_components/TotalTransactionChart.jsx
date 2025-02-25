import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TotalTransactionsChart = ({ data, domain }) => {
  const ticks = domain[0] === domain[1] ? [domain[0]] : [domain[0], domain[1]];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Total Transactions</h2>
      <ResponsiveContainer width="100%" height={384}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={(unixTime) =>
              new Date(unixTime).toLocaleTimeString([], { hour12: false })
            }
          />
          <YAxis tick={false} tickLine={false} axisLine={{ strokeOpacity: 0 }} />
          <Tooltip
            labelFormatter={(value) =>
              new Date(value).toLocaleTimeString([], { hour12: false })
            }
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="totalTransactions"
            name="Total"
            stroke="#3b82f6"
            fill="url(#colorTotal)"
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalTransactionsChart;
