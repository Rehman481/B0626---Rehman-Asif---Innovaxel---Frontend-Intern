// Components/Reports/MonthlyReport.jsx

import React, { useState, useEffect } from 'react';
import './MonthlyReport.css';

const MonthlyReport = ({ expenses }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    generateMonthlyReport();
  }, [expenses, selectedMonth]);

  const generateMonthlyReport = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const monthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getFullYear() === year && expDate.getMonth() === month;
    });

    const categoryTotals = {};
    const dailySpending = {};

    monthExpenses.forEach(exp => {
      const category = exp.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(exp.amount);
      const dateKey = new Date(exp.date).toDateString();
      dailySpending[dateKey] = (dailySpending[dateKey] || 0) + Number(exp.amount);
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a);

    const totalSpent = monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const averageDaily = Object.keys(dailySpending).length > 0 
      ? totalSpent / Object.keys(dailySpending).length 
      : 0;

    setMonthlyData({
      expenses: monthExpenses,
      categoryTotals: sortedCategories,
      totalSpent,
      averageDaily,
      count: monthExpenses.length
    });
  };

  const changeMonth = (offset) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedMonth(newDate);
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  const monthName = selectedMonth.toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  if (!monthlyData) return <div className="report-loading">Loading report...</div>;

  return (
    <div className="monthly-report">
      <div className="report-header">
        <h2>📊 Monthly Report</h2>
        <div className="month-navigation">
          <button onClick={() => changeMonth(-1)}>◀</button>
          <span className="month-name">{monthName}</span>
          <button onClick={() => changeMonth(1)}>▶</button>
        </div>
      </div>

      <div className="report-summary">

        <div className="summary-card">

          <div className="summary-label">Total Spending</div>

          <div className="summary-value">{formatCurrency(monthlyData.totalSpent)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Transactions</div>

          <div className="summary-value">{monthlyData.count}</div>
        </div>
        <div className="summary-card">

          <div className="summary-label">Daily Average</div>

          <div className="summary-value">{formatCurrency(monthlyData.averageDaily)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Top Category</div>
          <div className="summary-value">

            {monthlyData.categoryTotals.length > 0 

              ? monthlyData.categoryTotals[0][0] 
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="report-categories">
        <h3>Category Breakdown</h3>
        {monthlyData.categoryTotals.length === 0 ? (
          <p className="no-data">No expenses for this month</p>
        ) : (
          <div className="category-list">

            {monthlyData.categoryTotals.map(([category, amount]) => (
              <div key={category} className="category-row">

                <span className="category-name">{category}</span>

                <div className="category-bar">
                  <div 
                    className="category-fill" 
                    style={{ 
                      width: `${(amount / monthlyData.totalSpent) * 100}%`,

                      background: `hsl(${Math.random() * 360}, 70%, 60%)`
                    }}
                  />
                </div>
                <span className="category-amount">{formatCurrency(amount)}</span>
                <span className="category-percent">
                  {((amount / monthlyData.totalSpent) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="report-top-expenses">

        <h3>Top 5 Expenses</h3>
        {monthlyData.expenses.length === 0 ? (
          <p className="no-data">No expenses this month</p>
        ) : (
          <div className="top-list">
            {monthlyData.expenses
              .sort((a, b) => Number(b.amount) - Number(a.amount))
              .slice(0, 5)
              .map((exp, index) => (
                <div key={exp.id} className="top-item">

                  <span className="top-rank">#{index + 1}</span>

                  <span className="top-description">{exp.description}</span>

                  <span className="top-amount">{formatCurrency(exp.amount)}</span>
                  <span className="top-date">
                    
                    {new Date(exp.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReport;