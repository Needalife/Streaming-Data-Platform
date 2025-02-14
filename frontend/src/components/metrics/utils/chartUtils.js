// metrics/utils/chartUtils.js
export const createChartConfig = (metricPoints, label, unit) => {
    const labels = metricPoints.map((point) =>
      new Date(point.timestamp * 1000).toLocaleTimeString()
    );
    const values = metricPoints.map((point) => point.value);
  
    const data = {
      labels,
      datasets: [
        {
          label: label,
          data: values,
          borderColor: '#679cf6',
          backgroundColor: 'rgba(103, 156, 246, 0.2)',
        },
      ],
    };
  
    const options = {
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
    };
  
    return { data, options };
  };
  