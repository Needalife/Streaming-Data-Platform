import axios from 'axios';

export const getAllFunctionMetrics = async (functionNames) => {
  // Replace the URL and parameters with your actual API endpoint
  // const response = await axios.get(`/api/metrics?functions=${functionNames.join(',')}`);
  // return response.data;

  // Simulated API response:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            invocations_per_second: [
              { timestamp: 1672531200, value: 5 },
              { timestamp: 1672531260, value: 6 },
              { timestamp: 1672531320, value: 7 },
            ],
            execution_time: [
              { timestamp: 1672531200, value: 0.5 },
              { timestamp: 1672531260, value: 0.6 },
              { timestamp: 1672531320, value: 0.7 },
            ],
            memory_utilization: [
              { timestamp: 1672531200, value: 120 },
              { timestamp: 1672531260, value: 125 },
              { timestamp: 1672531320, value: 130 },
            ],
            instance_count: [
              { timestamp: 1672531200, value: 2 },
              { timestamp: 1672531260, value: 2 },
              { timestamp: 1672531320, value: 3 },
            ],
          },
        ],
      });
    }, 1000);
  });
};
