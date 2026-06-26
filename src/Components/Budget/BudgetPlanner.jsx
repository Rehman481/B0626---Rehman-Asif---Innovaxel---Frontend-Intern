// Components/Budget/BudgetPlanner.jsx

import React, { useState } from 'react';
import './BudgetPlanner.css';

const BudgetPlanner = ({ budgets, onUpdateBudget, expenses }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [newBudget, setNewBudget] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Food', 'Utilities', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Other'];

  // Debug: Log props on mount and update
  console.log('🔍 BudgetPlanner - budgets:', budgets);
  console.log('🔍 BudgetPlanner - onUpdateBudget:', onUpdateBudget);

  const calculateSpending = (category) => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
  };

  const getBudgetStatus = (category) => {
    const spent = calculateSpending(category);
    const budget = budgets?.[category] || 0;
    const remaining = budget - spent;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

    return {
      spent,
      budget,
      remaining,
      percentage: Math.min(percentage, 100),
      status: percentage >= 90 ? 'danger' : percentage >= 70 ? 'warning' : 'success'
    };
  };

  const handleSetBudget = (category) => {
    console.log('✏️ Editing category:', category);
    setEditingCategory(category);
    setNewBudget({ ...newBudget, [category]: budgets?.[category] || 0 });
    setError(null);
  };

  const handleSaveBudget = async (category) => {
    const amount = Number(newBudget[category]) || 0;
    
    console.log('💾 Saving budget:', { category, amount });
    console.log('📤 onUpdateBudget function:', onUpdateBudget);
    
    if (!onUpdateBudget) {
      console.error('❌ onUpdateBudget is undefined!');
      setError('Budget save function is not available');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Call the update function
      await onUpdateBudget(category, amount);
      console.log('✅ Budget saved successfully!');
      
      // Exit edit mode
      setEditingCategory(null);
      setNewBudget({});
    } catch (error) {
      console.error('❌ Error saving budget:', error);
      setError(error.message || 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewBudget({});
    setError(null);
  };

  // Safely calculate totals
  const totalBudget = Object.values(budgets || {}).reduce((sum, val) => sum + val, 0);
  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="budget-planner">
      <div className="budget-header">
        <h2>💰 Budget Planner</h2>
        <div className="budget-total">
          <span>Total Budget: PKR {totalBudget.toFixed(2)}</span>
          <span>Total Spent: PKR {totalSpent.toFixed(2)}</span>
          <span className={totalRemaining >= 0 ? 'positive' : 'negative'}>
            Remaining: PKR {totalRemaining.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="budget-error">
          ⚠️ {error}
        </div>
      )}

      <div className="budget-grid">
        {categories.map(category => {
          const status = getBudgetStatus(category);
          const isEditing = editingCategory === category;

          return (
            <div key={category} className={`budget-card status-${status.status}`}>
              <div className="budget-category-header">
                <h3>{category}</h3>
                {!isEditing && (
                  <button 
                    className="edit-budget-btn"
                    onClick={() => handleSetBudget(category)}
                    disabled={saving}
                  >
                    ✏️
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="budget-edit">
                  <input
                    type="number"
                    value={newBudget[category] || 0}
                    onChange={(e) => setNewBudget({
                      ...newBudget,
                      [category]: e.target.value
                    })}
                    placeholder="Set budget"
                    autoFocus
                    disabled={saving}
                    min="0"
                  />
                  <div className="budget-edit-actions">
                    <button 
                      onClick={() => handleSaveBudget(category)}
                      disabled={saving}
                    >
                      {saving ? '💾 Saving...' : '💾 Save'}
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                  {saving && <div className="saving-indicator">Saving to database...</div>}
                </div>
              ) : (
                <>
                  <div className="budget-amounts">
                    <span>Budget: PKR {status.budget.toFixed(2)}</span>
                    <span>Spent: PKR {status.spent.toFixed(2)}</span>
                    <span className={status.remaining >= 0 ? 'positive' : 'negative'}>
                      Remaining: PKR {status.remaining.toFixed(2)}
                    </span>
                  </div>

                  <div className="budget-bar-wrapper">
                    <div className="budget-bar">
                      <div 
                        className={`budget-fill ${status.status}`}
                        style={{ width: `${status.percentage}%` }}
                      />
                    </div>
                    <span className="budget-percentage">
                      {status.percentage.toFixed(1)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPlanner;