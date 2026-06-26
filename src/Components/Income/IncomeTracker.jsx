import React, { useState } from 'react';
import './IncomeTracker.css';

const IncomeTracker = ({ income, onAddIncome, onDeleteIncome, expenses }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!formData.source || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    await onAddIncome(formData);
    
    setFormData({
      source: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setShowForm(false);
  };

  const handleDeleteIncome = async (id) => 
    {
    if (window.confirm('Delete this income entry?'))
         {
      await onDeleteIncome(id);
    }
  };

  const totalIncome = income.reduce((sum, inc) => sum + Number(inc.amount), 0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const netSavings = totalIncome - totalExpenses;

  return (
    <div className="income-tracker">

      <div className="income-header">

        <div className="income-title">

          <h2>💵 Income Tracker</h2>
          <button className="add-income-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ Add Income'}
          </button>
        </div>

        <div className="income-summary">

          <div className="income-stat">

            <span className="stat-label">Total Income</span>

            <span className="stat-value positive">PKR {totalIncome.toFixed(2)}</span>
          </div>
          <div className="income-stat">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value negative">PKR {totalExpenses.toFixed(2)}</span>
          </div>
          <div className="income-stat">
            <span className="stat-label">Net Savings</span>
            <span className={`stat-value ${netSavings >= 0 ? 'positive' : 'negative'}`}>
              PKR {netSavings.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {showForm && (
        <form className="income-form" onSubmit={handleAddIncome}>

          <div className="form-row">

            <div className="form-group">
              <label>Source *</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                placeholder="e.g., Salary, Freelance"
                required
              />
            </div>
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          <div className="form-row">

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}

                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="form-group">

              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Optional note"
              />
            </div>
          </div>
          <button type="submit" className="submit-income-btn">
            💾 Add Income
          </button>
        </form>
      )}

      <div className="income-list">
        {income.length === 0 ? (
          <p className="no-income">No income entries yet</p>
        ) : (
          income.map(inc => (
            <div key={inc.id} className="income-item">
              <div className="income-info">
                <span className="income-source">💵 {inc.source}</span>
                {inc.description && (
                  <span className="income-description">{inc.description}</span>
                )}
                <span className="income-date">
                  📅 {new Date(inc.date).toLocaleDateString()}
                </span>
              </div>
              <div className="income-right">
                <span className="income-amount">
                  +PKR {Number(inc.amount).toFixed(2)}
                </span>
                <button 
                  className="delete-income-btn"
                  onClick={() => handleDeleteIncome(inc.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncomeTracker;