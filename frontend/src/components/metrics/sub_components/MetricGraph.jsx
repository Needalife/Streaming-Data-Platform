import React from 'react';
import { Line } from 'react-chartjs-2';

const MetricGraph = ({ title, metricData, chartData }) => {
    return (
        <div className="pt-6 pr-8 pl-8 bg-gray-100 rounded-2xl shadow flex-col">
            <h4 className="font-semibold text-xl">{title}</h4>
            {metricData ? (
                <div className="flex-1 h-5/6">
                    <Line data={chartData(metricData, title)} options={{ maintainAspectRatio: false }} />
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default MetricGraph;
