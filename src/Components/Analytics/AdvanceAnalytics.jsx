// Components/Analytics/AdvancedAnalytics.jsx

import React, { useState, useEffect } from 'react';
import './AdvanceAnalytics.css';

const AdvancedAnalytics = ({ expenses }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    generateAnalytics();
  }, [expenses]);

  const generateAnalytics = () => {
    if (expenses.length === 0) {
      setAnalytics(null);
      return;
    }

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const average = total / expenses.length;
    const max = Math.max(...expenses.map(exp => Number(exp.amount)));
    const min = Math.min(...expenses.map(exp => Number(exp.amount)));

    const categoryData = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categoryData[cat] = (categoryData[cat] || 0) + Number(exp.amount);
    });

    const sortedCategories = Object.entries(categoryData)
      .sort(([, a], [, b]) => b - a);

    const dailyData = {};
    expenses.forEach(exp => {
      const date = new Date(exp.date).toDateString();
      dailyData[date] = (dailyData[date] || 0) + Number(exp.amount);
    });

    const topExpenses = [...expenses]
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5);

    setAnalytics({
      total,
      average,
      max,
      min,
      categories: sortedCategories,
      dailyData,
      topExpenses,
      count: expenses.length
    });
  };

  const formatCurrency = (amount) => `PKR ${Number(amount).toFixed(2)}`;

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="no-data">No expenses to analyze</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Advanced Analytics</h2>
      </div>

      <div className="analytics-summary">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Spending</span>
            <span className="stat-value">{formatCurrency(analytics.total)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-label">Average Expense</span>
            <span className="stat-value">{formatCurrency(analytics.average)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⬆️</div>
          <div className="stat-info">
            <span className="stat-label">Highest Expense</span>
            <span className="stat-value">{formatCurrency(analytics.max)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⬇️</div>
          <div className="stat-info">
            <span className="stat-label">Lowest Expense</span>
            <span className="stat-value">{formatCurrency(analytics.min)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{analytics.count}</span>
          </div>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Category Analysis</h3>
        <div className="category-analysis">
          {analytics.categories.map(([category, amount]) => (
            <div key={category} className="category-analysis-item">
              <div className="category-analysis-header">
                <span className="category-name">{category}</span>
                <span className="category-total">{formatCurrency(amount)}</span>
              </div>
              <div className="category-bar">
                <div 
                  className="category-bar-fill"
                  style={{ 
                    width: `${(amount / analytics.total) * 100}%`,
                    background: `hsl(${Math.random() * 360}, 70%, 55%)`
                  }}
                />
              </div>
              <span className="category-percent">
                {((amount / analytics.total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h3>Top 5 Expenses</h3>
        <div className="top-expenses">
          {analytics.topExpenses.map((exp, index) => (
            <div key={exp.id} className="top-expense-item">
              <span className="top-rank">#{index + 1}</span>
              <span className="top-description">{exp.description}</span>
              <span className="top-amount">{formatCurrency(exp.amount)}</span>
              <span className="top-date">
                {new Date(exp.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section insights">
        <h3>💡 Spending Insights</h3>
        <div className="insights-grid">
          {analytics.categories.length > 0 && (
            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Top Category</h4>
                <p>
                  You spend the most on <strong>{analytics.categories[0][0]}</strong> 
                  ({((analytics.categories[0][1] / analytics.total) * 100).toFixed(1)}% of total)
                </p>
              </div>
            </div>
          )}

          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>Daily Average</h4>
              <p>
                Your average daily spending is <strong>
                  {formatCurrency(analytics.total / Object.keys(analytics.dailyData).length)}
                </strong>
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">💎</div>
            <div className="insight-content">
              <h4>Biggest Expense</h4>
              <p>
                Your largest single expense was <strong>
                  {formatCurrency(analytics.max)}
                </strong>
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Transaction Count</h4>
              <p>
                You have made <strong>{analytics.count}</strong> transactions 
                averaging {formatCurrency(analytics.average)} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;