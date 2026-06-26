// App.jsx - Complete Firebase Integration

import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signOut } from './Firebase';
import { useFirestoreData } from './hooks/useFireStoreData';
import Auth from './Components/Auth/Auth';
import ExpenseForm from './Components/ExpenseForm/ExpenseForm';
import ExpenseList from './Components/ExpenseList/ExpenseList';
import Summary from './Components/Summary/Summary';
import FilterBar from './Components/FilterBar/FilterBar';
import MonthlyReport from './Components/Reports/MonthlyReport';
import BudgetPlanner from './Components/Budget/BudgetPlanner';
import IncomeTracker from './Components/Income/IncomeTracker';
import AdvancedAnalytics from './Components/Analytics/AdvanceAnalytics';
import { exportToCSV, exportToPDF, printReport } from './Utils/exportUtils';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses');
  const [filter, setFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);


  const { 
    expenses, 
    budgets,
    income,
    loading: dataLoading,
    error,
    addExpense, 
    deleteExpense, 
    updateExpense,
    updateBudget,
    addIncome,
    deleteIncome
  } = useFirestoreData();

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    let filtered = [...expenses];
    if (filter !== 'All') {
      filtered = filtered.filter(exp => exp.category === filter);
    }
    if (startDate) {
      filtered = filtered.filter(exp => new Date(exp.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(exp => new Date(exp.date) <= new Date(endDate));
    }
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredExpenses(filtered);
  }, [expenses, filter, startDate, endDate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">💰</span>
            <h1 className="app-title">FinWise</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              {user.photoURL && (
                <img src={user.photoURL} alt="User" className="user-avatar" />
              )}
              <span className="user-email">{user.displayName || user.email}</span>
              <button onClick={() => signOut(auth)} className="signout-btn">
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <p className="app-subtitle">Smart Expense Tracker</p>
      </header>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button className={activeTab === 'expenses' ? 'active' : ''} onClick={() => setActiveTab('expenses')}>
          💳 Expenses
        </button>
        <button className={activeTab === 'budget' ? 'active' : ''} onClick={() => setActiveTab('budget')}>
          💰 Budget
        </button>
        <button className={activeTab === 'income' ? 'active' : ''} onClick={() => setActiveTab('income')}>
          💵 Income
        </button>
        <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
          📊 Reports
        </button>
        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
          📈 Analytics
        </button>
        
      </div>

     
      {activeTab === 'expenses' && (
        <div className="export-actions">
          <button onClick={() => exportToCSV(filteredExpenses)}>📥 Export CSV</button>
          <button onClick={() => exportToPDF(filteredExpenses)}>📄 Export PDF</button>
          <button onClick={printReport}>🖨️ Print Report</button>
        </div>
      )}

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {dataLoading ? (
        <div className="loading-expenses">Loading your data...</div>
      ) : (
        <>
          {activeTab === 'expenses' && (
            <div className="app-grid">
              <div className="left-panel">
                <ExpenseForm onAddExpense={addExpense} />
                <Summary expenses={filteredExpenses} />
              </div>
              <div className="right-panel">
                <FilterBar
                  currentFilter={filter}
                  onFilterChange={setFilter}
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onClearDates={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                />
                <ExpenseList
                  expenses={filteredExpenses}
                  onDelete={deleteExpense}
                  onEdit={updateExpense}
                />
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <BudgetPlanner 
              budgets={budgets} 
              onUpdateBudget={updateBudget}
              expenses={expenses}
            />
          )}

          {activeTab === 'income' && (
            <IncomeTracker 
              income={income}
              onAddIncome={addIncome}
              onDeleteIncome={deleteIncome}
              expenses={expenses}
            />
          )}

          {activeTab === 'reports' && (
            <MonthlyReport expenses={expenses} />
          )}

          {activeTab === 'analytics' && (
            <AdvancedAnalytics expenses={expenses} />
          )}

          
        </>
      )}
    </div>
  );
};

export default App;