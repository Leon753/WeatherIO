// src/components/WeatherChart.tsx
import React, { useRef } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import type { AnnotationOptions } from 'chartjs-plugin-annotation';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin
);

interface WeatherChartProps {
  labels: string[];
  temperatureData: number[];
  humidityData: number[];
  precipitationData: number[];
  windData: number[];
  onTimeRangeChange: (startIndex: number) => void;
  currentStartIndex: number;
  totalHours: number;
  selectedRange: { start: string; end: string } | null;
  onRangeChange: (range: { start: string; end: string } | null) => void;
}

const WeatherChart: React.FC<WeatherChartProps> = ({
  labels,
  temperatureData,
  humidityData,
  precipitationData,
  windData,
  onTimeRangeChange,
  currentStartIndex,
  totalHours,
  selectedRange,
  onRangeChange,
}) => {
  const chartRef = useRef<ChartJS<"line">>(null);

  const formatTime = (timeStr: string) => {
    const hour = parseInt(timeStr.split(':')[0]);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${period}`;
  };

  const formattedLabels = labels.map(formatTime);

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Temperature (°F)",
        data: temperatureData,
        borderColor: "#f97316",
        fill: false,
        yAxisID: 'y',
      },
      {
        label: "Humidity (%)",
        data: humidityData,
        borderColor: "#22c55e",
        fill: false,
        yAxisID: 'y',
      },
      {
        label: "Chance of Rain (%)",
        data: precipitationData,
        borderColor: "#3b82f6",
        fill: false,
        yAxisID: 'y',
      },
      {
        label: "Wind Speed (mph)",
        data: windData,
        borderColor: "#ff6347",
        fill: false,
        yAxisID: 'y',
      },
    ],
  };

  // Calculate overall min and max for all datasets
  const overallMin = Math.min(...temperatureData, ...humidityData, ...precipitationData, ...windData);
  const overallMax = Math.max(...temperatureData, ...humidityData, ...precipitationData, ...windData);
  
  // Add padding to the range (10% padding)
  const padding = (overallMax - overallMin) * 0.1;

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'black'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      annotation: {
        annotations: selectedRange ? {
          highlight: {
            type: 'box' as const,
            xMin: selectedRange.start,
            xMax: selectedRange.end,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
            drawTime: 'beforeDatasetsDraw' as const
          } as AnnotationOptions<'box'>
        } : {}
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x' as const,
          modifierKey: 'shift' as const,
          threshold: 10,
          overScaleMode: 'x' as const,
        },
        zoom: {
          drag: {
            enabled: true,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
          },
          mode: 'x' as const,
          scaleMode: 'x' as const,
          onZoom: ({ chart }: { chart: ChartJS }) => {
            const xAxis = chart.scales.x;
            if (xAxis) {
              // Ensure we don't go past midnight
              const startIndex = Math.max(0, Math.floor(xAxis.min));
              const endIndex = Math.min(24, Math.ceil(xAxis.max));
              if (startIndex >= 0 && endIndex <= 24 && startIndex < endIndex) {
                onRangeChange({
                  start: formattedLabels[startIndex],
                  end: formattedLabels[endIndex]
                });
              }
            }
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: Math.floor(overallMin - padding),
        max: Math.ceil(overallMax + padding),
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: 'black',
          stepSize: Math.ceil((overallMax - overallMin) / 10)
        }
      },
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: 'black',
          maxRotation: 0,
          autoSkip: false,
          maxTicksLimit: 8
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div style={{ height: '400px', width: '100%' }}>
        <Line 
          ref={chartRef}
          data={data} 
          options={options}
        />
      </div>
    </div>
  );
};

export default WeatherChart;
