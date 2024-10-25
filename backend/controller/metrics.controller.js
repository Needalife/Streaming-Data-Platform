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

        const now = Date.now() / 1000;
        const interval = now - (15 * 60);

        for (const functionName of functionNames) {
            const metrics = { functionName };

            for (const [metricName, metricType] of Object.entries(metricTypes)) {
                const request = {
                    name: `projects/${projectId}`,
                    filter: `metric.type="${metricType}" AND resource.labels.function_name="${functionName}"`,
                    interval: {
                        startTime: {
                            seconds: interval,
                        },
                        endTime: {
                            seconds: now,
                        },
                    },
                };

                if (metricName === 'memory_utilization') {
                    request.aggregation = {
                        alignmentPeriod: {
                            seconds: 60,
                        },
                        perSeriesAligner: 'ALIGN_DELTA',
                        crossSeriesReducer: 'REDUCE_PERCENTILE_99',
                        groupByFields: [],
                    };
                }

                if (metricName === 'execution_time') {
                    request.aggregation = {
                        alignmentPeriod: {
                            seconds: 60,
                        },
                        perSeriesAligner: 'ALIGN_DELTA',
                        crossSeriesReducer: 'REDUCE_PERCENTILE_99',
                        groupByFields: [],
                    };
                }

                const [timeSeries] = await client.listTimeSeries(request);

                if (timeSeries.length > 0) {
                    const points = timeSeries.flatMap((series) =>
                        series.points.map((point) => {
                            let value = point.value.doubleValue || point.value.int64Value;

                            switch (metricName) {
                                case 'invocations_per_second':
                                    const startTime = point.interval.startTime.seconds;
                                    const endTime = point.interval.endTime.seconds;
                                    const timeInterval = endTime - startTime;
                                    value = timeInterval > 0 ? value / timeInterval : value;
                                    break;
                                case 'memory_utilization':
                                    value = value / (1024 * 1024);
                                    break;
                                case 'execution_time':
                                    value = value / 1000000000;
                                    break;
                                default:
                                    break;
                            }

                            return {
                                value,
                                timestamp: point.interval.endTime.seconds,
                            };
                        })
                    );

                    points.sort((a, b) => a.timestamp - b.timestamp);
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
