import React, { useState, useEffect } from 'react';
import { getAllFunctionMetrics } from '../api/metrics';
import FunctionButton from '../components//metrics/FunctionButton';
import MetricGraph from '../components/metrics/MetricGraph';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Cloud funtcions names
const cloudFunctionNames = ['kafka-producer', 'kafka-consumer', 'mongo-kafka-delete', 'confluent-manager'];

const CloudFunctionMetrics = () => {
    const [selectedFunction, setSelectedFunction] = useState(cloudFunctionNames[0]);
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getAllFunctionMetrics([selectedFunction]);
                setMetrics(data.data);
            } catch (error) {
                setError('Error fetching metrics');
                console.error(error);
            }
        };

        fetchMetrics();
    }, [selectedFunction]);

    if (error) return <p>{error}</p>;
    if (!metrics) return <p>Loading metrics...</p>;

    const chartData = (metricPoints, label) => {
        const labels = metricPoints.map(point => new Date(point.timestamp * 1000).toLocaleTimeString());
        const values = metricPoints.map(point => point.value);

        return {
            labels,
            datasets: [
                {
                    label: label,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        };
    };

    return (
        <div className="p-4">
            <h1 className="font-bold text-3xl p-8">Metrics</h1>

            {/* GCF buttons */}
            <FunctionButton
                cloudFunctionNames={cloudFunctionNames}
                selectedFunction={selectedFunction}
                setSelectedFunction={setSelectedFunction}
            />

            {/* 2x2 grid */}
            <div className="grid grid-cols-2 gap-6">
                <MetricGraph
                    title="Invocation Count"
                    metricData={metrics[0].invocations_per_second}
                    chartData={chartData}
                />
                <MetricGraph
                    title="Execution Time"
                    metricData={metrics[0].execution_time}
                    chartData={chartData}
                />
                <MetricGraph
                    title="Memory Utilization"
                    metricData={metrics[0].memory_utilization}
                    chartData={chartData}
                />
                <MetricGraph
                    title="Instance Count"
                    metricData={metrics[0].instance_count}
                    chartData={chartData}
                />
            </div>
        </div>
    );
};

export default CloudFunctionMetrics;
