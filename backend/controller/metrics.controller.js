import { MetricServiceClient } from '@google-cloud/monitoring';

const client = new MetricServiceClient({
    keyFilename: './config/service-account.json',
});

const projectId = 'project-finance-400806';

export const getAllFunctionMetrics = async (req, res) => {
    try {
        const functionNames = req.query.functions.split(',');

        let allMetrics = [];

        const metricTypes = {
            invocations_per_second: 'cloudfunctions.googleapis.com/function/execution_count',
            execution_time: 'cloudfunctions.googleapis.com/function/execution_times',
            memory_utilization: 'cloudfunctions.googleapis.com/function/user_memory_bytes',
            instance_count: 'cloudfunctions.googleapis.com/function/instance_count',
        };

        for (const functionName of functionNames) {
            const metrics = { functionName };

            for (const [metricName, metricType] of Object.entries(metricTypes)) {
                const request = {
                    name: `projects/${projectId}`,
                    filter: `metric.type="${metricType}" AND resource.labels.function_name="${functionName}"`,
                    interval: {
                        startTime: {
                            seconds: Date.now() / 1000 - 60 * 5,  // Fetch data for the last 5 minutes
                        },
                        endTime: {
                            seconds: Date.now() / 1000,  // Now
                        },
                    },
                };

                const [timeSeries] = await client.listTimeSeries(request);

                if (timeSeries.length > 0) {
                    const points = timeSeries.map((series) => ({
                        value: series.points[0].value.doubleValue || series.points[0].value.int64Value,
                        timestamp: series.points[0].interval.endTime.seconds,
                    }));
                    metrics[metricName] = points;
                } else {
                    metrics[metricName] = null;
                }
            }

            allMetrics.push(metrics);
        }


        res.status(200).json({ success: true, data: allMetrics });
    } catch (error) {
        console.error(`Error fetching metrics: ${error.message}`);
        res.status(500).json({ success: false, message: "Error fetching metrics" });
    }
};
