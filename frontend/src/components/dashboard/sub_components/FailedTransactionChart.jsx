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

const FailedTransactionsChart = ({ data, domain }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">Failed Transactions</h2>
    <ResponsiveContainer width="100%" height={384}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={domain}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
        />
        <YAxis tick={false} tickLine={false} axisLine={{ strokeOpacity: 0 }} />
        <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
        <Legend />
        <Area
          type="monotone"
          dataKey="failedTransactions"
          name="Failed"
          stroke="#f43f5e"
          fill="url(#colorFailed)"
          strokeWidth={3}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default FailedTransactionsChart;
