// Components/ExpenseForm/ExpenseForm.jsx
import React, { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || !date) {
      setError('Title, Amount, and Date are required.');
      return;
    }
    if (parseFloat(amount) < 0) {
      setError('Amount cannot be negative.');
      return;
    }
    setError('');
    onAddExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim() || '',
    });
    setTitle('');
    setAmount('');
    setCategory('Food');
    setDate('');
    setNotes('');
  };

  return (
    <div className="expense-form-card">
      <h3 className="form-title">➕ Add Expense</h3>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dinner with friends" />
        </div>
        <div className="form-group">
          <label>Amount (PKR) *</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2200" min="0" step="1" />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">🍔 Food</option>
            <option value="Utilities">💡 Utilities</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Health">💊 Health</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
        </div>
        <button type="submit" className="submit-btn">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;