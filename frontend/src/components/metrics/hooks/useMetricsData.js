import { useState, useEffect } from 'react';
import { getAllFunctionMetrics } from '../api/metricsApi';

export const useMetricsData = (selectedFunction) => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await getAllFunctionMetrics([selectedFunction]);
        setMetrics(data.data);
      } catch (err) {
        setError('Error fetching metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedFunction]);

  return { metrics, error, loading };
};
