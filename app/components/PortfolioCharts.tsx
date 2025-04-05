import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Stock } from '@/app/types/calculatorTypes';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface PortfolioChartsProps {
    stocks: Stock[];
}

export default function PortfolioCharts({ stocks }: PortfolioChartsProps) {
    // Prepare data for line chart (portfolio value over time)
    const lineChartData = {
        labels: stocks.map(stock => stock.ticker),
        datasets: [
            {
                label: 'Cost Basis',
                data: stocks.map(stock => stock.purchasePrice * stock.shares),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Current Value',
                data: stocks.map(stock => stock.currentPrice * stock.shares),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    // Prepare data for pie chart (stock distribution)
    const pieChartData = {
        labels: stocks.map(stock => stock.ticker),
        datasets: [
            {
                label: 'Portfolio Distribution',
                data: stocks.map(stock => stock.currentPrice * stock.shares),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Portfolio Value Comparison
                </h3>
                <div className="h-64">
                    <Line
                        data={lineChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: '#6B7280',
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    grid: {
                                        color: 'rgba(209, 213, 219, 0.3)',
                                    },
                                    ticks: {
                                        color: '#6B7280',
                                    },
                                },
                                y: {
                                    grid: {
                                        color: 'rgba(209, 213, 219, 0.3)',
                                    },
                                    ticks: {
                                        color: '#6B7280',
                                        callback: (value) => `$${value}`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Portfolio Distribution
                </h3>
                <div className="h-64">
                    <Pie
                        data={pieChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        color: '#6B7280',
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const label = context.label || '';
                                            const value = context.raw as number;
                                            const total = context.dataset.data.reduce(
                                                (a: number, b: number) => a + b,
                                                0
                                            );
                                            const percentage = ((value / total) * 100).toFixed(2);
                                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}