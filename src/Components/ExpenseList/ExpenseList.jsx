// Components/ExpenseList/ExpenseList.js

import React, { useState } from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const getCategoryIcon = (category) => {
    const icons = {
      Food: '🍔',
      Utilities: '💡',
      Transport: '🚗',
      Shopping: '🛍️',
      Health: '💊',
      Entertainment: '🎬',
      Other: '📦'
    };
    return icons[category] || '💰';
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditFormData(expense);
  };

  const handleSave = (id) => {
    onEdit(id, editFormData);
    setEditingId(null);
    setEditFormData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="empty-message">
        <div className="empty-icon">📊</div>
        <div className="empty-title">No expenses yet</div>
        <div className="empty-subtitle">
          Start tracking your spending by adding your first expense!
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="list-header">
        <div className="header-left">
          <span className="list-icon">📋</span>
          <span className="list-title">All Expenses</span>
          <span className="expense-count">{expenses.length}</span>
        </div>
      </div>

      {expenses.map((expense) => (
        <div
          key={expense.id}
          className={`expense-item category-${expense.category?.toLowerCase() || 'other'}`}
        >
          {editingId === expense.id ? (
            <div className="edit-mode">
              <input
                type="text"
                name="title"
                value={editFormData.title || ''}
                onChange={handleChange}
                placeholder="Title"
              />

              <div className="edit-row">
                <input
                  type="number"
                  name="amount"
                  value={editFormData.amount || ''}
                  onChange={handleChange}
                  placeholder="Amount"
                  step="0.01"
                />

                <select
                  name="category"
                  value={editFormData.category || ''}
                  onChange={handleChange}
                >
                  <option value="Food">Food</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <input
                type="date"
                name="date"
                value={editFormData.date || ''}
                onChange={handleChange}
              />

              <div className="edit-actions">
                <button
                  className="save-btn"
                  onClick={() => handleSave(expense.id)}
                >
                  ✓ Save
                </button>

                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="expense-left">
                <div className="expense-checkbox">
                  <input type="checkbox" />
                </div>

                <div className="expense-icon">
                  {getCategoryIcon(expense.category)}
                </div>

                <div className="expense-details">
                  <div className="expense-description">
                    <strong>{expense.title || 'Untitled Expense'}</strong>
                  </div>

                  <div className="expense-meta">
                    <span
                      className={`expense-category category-${expense.category?.toLowerCase() || 'other'}`}
                    >
                      <span className="category-dot"></span>
                      {expense.category || 'Other'}
                    </span>

                    <span className="expense-date">
                      <span className="date-icon">📅</span>
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="expense-right">
                <div
                  className={`expense-amount ${
                    Number(expense.amount) >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  PKR {Number(expense.amount).toFixed(2)}
                  <span className="currency">PKR</span>
                </div>

                <div className="expense-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(expense)}
                    aria-label="Edit expense"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(expense.id)}
                    aria-label="Delete expense"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;