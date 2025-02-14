import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import FunctionButton from './sub_components/FunctionButton';
import MetricGraph from './sub_components/MetricGraph';
import { useMetricsData } from './hooks/useMetricsData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const cloudFunctionNames = ['kafka-producer', 'kafka-consumer', 'mongo-kafka-delete', 'confluent-manager'];

const Metrics = () => {
  const [selectedFunction, setSelectedFunction] = useState(cloudFunctionNames[0]);

  const { metrics, error, loading } = useMetricsData(selectedFunction);

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
  if (loading || !metrics) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <p>Loading metrics...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 h-full">
      <h1 className="text-3xl p-4">Metrics</h1>

      {/* Cloud Function Buttons */}
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
            unit="/s"
          />
          <MetricGraph
            title="Execution Time"
            metricData={metrics[0].execution_time}
            unit="s"
          />
          <MetricGraph
            title="Memory Utilization"
            metricData={metrics[0].memory_utilization}
            unit="MiB"
          />
          <MetricGraph
            title="Instance Count"
            metricData={metrics[0].instance_count}
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

export default Metrics;
