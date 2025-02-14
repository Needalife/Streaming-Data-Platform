import React from 'react';
import { Line } from 'react-chartjs-2';
import { createChartConfig } from '../utils/chartUtils';

const MetricGraph = ({ title, metricData, unit }) => {
  const config = createChartConfig(metricData, title, unit);

  return (
    <div className="pt-6 pr-8 pl-8 bg-gray-100 rounded-2xl shadow flex-col">
      <h4 className="font-semibold text-xl">{title}</h4>
      {metricData ? (
        <div className="flex-1 h-5/6">
          <Line data={config.data} options={config.options} />
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default MetricGraph;
