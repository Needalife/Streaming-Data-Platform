import React from 'react';
import { Line } from 'react-chartjs-2';

const MetricGraph = ({ title, metricData, chartData }) => {
    return (
        <div className="ml-8 mr-8 mt-4 p-4 bg-gray-100 rounded-2xl shadow">
            <h4 className="font-semibold mb-2">{title}</h4>
            {metricData ? (
                <Line data={chartData(metricData, title)} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default MetricGraph;
