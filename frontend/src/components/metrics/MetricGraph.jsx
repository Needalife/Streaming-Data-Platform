import React from 'react';
import { Line } from 'react-chartjs-2';

const MetricGraph = ({ title, metricData, chartData }) => {
    return (
        <div className={`p-8 bg-gray-100 rounded-2xl shadow flex flex-col`}>
            <h4 className="font-semibold mb-2">{title}</h4>
            {metricData ? (
                <div className="flex-1">
                    <Line data={chartData(metricData, title)} options={{ maintainAspectRatio: false }} />
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default MetricGraph;
