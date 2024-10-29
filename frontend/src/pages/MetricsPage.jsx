import React, { useState, useEffect } from 'react';
import { getAllFunctionMetrics } from '../api/metrics';
import { useNavigate } from 'react-router-dom';
import FunctionButton from '../components/metrics/FunctionButton';
import MetricGraph from '../components/metrics/MetricGraph';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Cloud function names
const cloudFunctionNames = ['kafka-producer', 'kafka-consumer', 'mongo-kafka-delete', 'confluent-manager'];

const CloudFunctionMetrics = () => {
    const navigate = useNavigate();
    const [selectedFunction, setSelectedFunction] = useState(cloudFunctionNames[0]);
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for token
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

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

    const handleNext = () => {
        const currentIndex = cloudFunctionNames.indexOf(selectedFunction);
        const nextIndex = (currentIndex + 1) % cloudFunctionNames.length;
        setSelectedFunction(cloudFunctionNames[nextIndex]);
    };

    const handlePrevious = () => {
        const currentIndex = cloudFunctionNames.indexOf(selectedFunction);
        const prevIndex = (currentIndex - 1 + cloudFunctionNames.length) % cloudFunctionNames.length;
        setSelectedFunction(cloudFunctionNames[prevIndex]);
    };

    if (error) return <p>{error}</p>;
    if (!metrics) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
            }}>
                <p>Loading metrics...</p>
            </div>
        );
    }

    // Define chartData as a function that returns the chart configuration
    const chartData = (metricPoints, label, unit) => {
        const labels = metricPoints.map(point => new Date(point.timestamp * 1000).toLocaleTimeString());
        const values = metricPoints.map(point => point.value);

        return {
            labels,
            datasets: [
                {
                    label: label,
                    data: values,
                    borderColor: '#679cf6',
                    backgroundColor: 'rgba(103, 156, 246, 0.2)',
                },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute',
                            stepSize: 10,
                            tooltipFormat: 'HH:mm:ss',
                        },
                        title: {
                            display: true,
                            text: 'Time',
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: `${label} (${unit})`,
                        },
                        ticks: {
                            callback: function (value) {
                                return `${value} ${unit}`;
                            },
                        },
                    },
                },
            },
        };
    };


    return (
        <div className="flex flex-col p-4 h-full">
            <h1 className="text-3xl p-4">Metrics</h1>

            {/* GCF buttons */}
            <div className="mb-8 flex justify-center">
                <FunctionButton
                    cloudFunctionNames={cloudFunctionNames}
                    selectedFunction={selectedFunction}
                    setSelectedFunction={setSelectedFunction}
                />
            </div>

            <div className="flex-1 flex">
                <div className="flex items-center">
                    <button
                        className="bg-blue-500 text-white text-2xl px-2 py-2 rounded-full hover:bg-blue-600 mr-8 ml-4"
                        onClick={handlePrevious}
                        style={{ height: 'fit-content' }}
                    >
                        <MdNavigateBefore />
                    </button>
                </div>

                {/* 2x2 grid for graphs */}
                <div className="flex-1 grid grid-cols-2 gap-10 pb-8">
                    <MetricGraph
                        title="Invocations/Second"
                        metricData={metrics[0].invocations_per_second}
                        chartData={chartData}
                        unit="/s"
                    />
                    <MetricGraph
                        title="Execution Time"
                        metricData={metrics[0].execution_time}
                        chartData={chartData}
                        unit="s"
                    />
                    <MetricGraph
                        title="Memory Utilization"
                        metricData={metrics[0].memory_utilization}
                        chartData={chartData}
                        unit="MiB"
                    />
                    <MetricGraph
                        title="Instance Count"
                        metricData={metrics[0].instance_count}
                        chartData={chartData}
                        unit="counts"
                    />
                </div>

                <div className="flex items-center">
                    <button
                        className="bg-blue-500 text-white text-2xl px-2 py-2 rounded-full hover:bg-blue-600 mr-4 ml-8"
                        onClick={handleNext}
                        style={{ height: 'fit-content' }}
                    >
                        <MdNavigateNext />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloudFunctionMetrics;
