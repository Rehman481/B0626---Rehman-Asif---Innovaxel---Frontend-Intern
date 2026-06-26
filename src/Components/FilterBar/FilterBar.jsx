// Components/FilterBar/FilterBar.js

import React from 'react';
import './FilterBar.css';

const FilterBar = ({
  currentFilter,
  onFilterChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates
}) => {
  const categories = [
    'All',
    'Food',
    'Utilities',
    'Transport',
    'Shopping',
    'Health',
    'Entertainment',
    'Other'
  ];

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <label className="filter-label">Filter by category:</label>
        <div className="category-tags">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tag ${currentFilter === category ? 'active' : ''}`}
              onClick={() => onFilterChange(category)}
            >
              {category === 'All' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section date-section">
        <div className="date-filters">
          <div className="date-group">
            <label htmlFor="startDate">From</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-group">
            <label htmlFor="endDate">To</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="date-input"
            />
          </div>
          {(startDate || endDate) && (
            <button onClick={onClearDates} className="clear-dates-btn">
              ✕ Clear Dates
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;