import React, { useState } from 'react';
import './ExpenseItem.css';

const ExpenseItem = ({
  expense,
  isEditing,
  onEditStart,
  onEditCancel,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);
  const [notes, setNotes] = useState(expense.notes || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount || !date) {
      setError('Title, Amount, and Date are required.');
      return;
    }

    if (Number(amount) < 0) {
      setError('Amount cannot be negative.');
      return;
    }

    setError('');

    onSave(expense.id, {
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      notes: notes.trim(),
    });
  };

  return (
    <div className="expense-item">
      {isEditing ? (
        <div className="edit-mode">
          <div className="edit-row">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              min="0"
            />
          </div>

          <div className="edit-row">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="edit-notes"
          />

          {error && <div className="edit-error">{error}</div>}

          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              💾 Save
            </button>

            <button onClick={onEditCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="expense-info">
            <div className="expense-header">
              <span className="expense-title">{expense.title}</span>
              <span className="expense-category">{expense.category}</span>
            </div>

            <div className="expense-details">
              <span className="expense-amount">
                PKR {Number(expense.amount || 0).toFixed(2)}
              </span>

              <span className="expense-date">{expense.date}</span>
            </div>

            {expense.notes && (
              <div className="expense-notes">
                📝 {expense.notes}
              </div>
            )}
          </div>

          <div className="expense-actions">
            <button onClick={onEditStart} className="edit-btn">
              ✏️ Edit
            </button>

            <button
              onClick={() => onDelete(expense.id)}
              className="delete-btn"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseItem;