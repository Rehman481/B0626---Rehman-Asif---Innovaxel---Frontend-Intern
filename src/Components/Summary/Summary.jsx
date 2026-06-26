import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Summary.css';

const Summary = ({ expenses = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

 
  const total = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const categoryMap = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Other';

    acc[category] =
      (acc[category] || 0) + Number(exp.amount || 0);

    return acc;
  }, {});

  const categories = Object.keys(categoryMap);
  const amounts = Object.values(categoryMap);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    if (categories.length === 0) return;

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [
          {
            data: amounts,
            backgroundColor: [
              '#f97316',
              '#8b5cf6',
              '#06b6d4',
              '#22c55e',
              '#eab308',
              '#ec4899',
              '#64748b',
            ],
            borderWidth: 1,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 10,
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [categories.length, amounts]);

  return (
    <div className="summary-card">
      <div className="summary-total">
        <span className="total-label">Total Spent</span>
        <span className="total-amount">
          PKR {Number(total).toFixed(2)}
        </span>
      </div>

      <div className="chart-wrapper">
        {categories.length === 0 ? (
          <p className="chart-empty">No data to display</p>
        ) : (
          <canvas ref={chartRef} className="chart-canvas"></canvas>
        )}
      </div>
    </div>
  );
};

export default Summary;