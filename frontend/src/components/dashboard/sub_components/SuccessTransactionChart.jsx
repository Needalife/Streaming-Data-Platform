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

const SuccessTransactionsChart = ({ data, domain }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-6 mt-4 ml-6">Completed Transactions</h2>
    <ResponsiveContainer width="100%" height={384}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: -30, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={domain}
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
          dataKey="successTransactions"
          name="Completed"
          stroke="#8b5cf6"
          fill="url(#colorSuccess)"
          strokeWidth={3}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SuccessTransactionsChart;
