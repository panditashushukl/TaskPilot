import React from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button';

const TaskFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const hasActiveFilters = filters.status || filters.priority || filters.assignedTo;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={14} className="mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="select"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            className="select"
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <input
            type="text"
            placeholder="Enter username or name"
            className="input"
            value={filters.assignedTo}
            onChange={(e) => onFilterChange({ assignedTo: e.target.value })}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
              <button
                onClick={() => onFilterChange({ status: '' })}
                className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          
          {filters.priority && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Priority: {priorityOptions.find(opt => opt.value === filters.priority)?.label}
              <button
                onClick={() => onFilterChange({ priority: '' })}
                className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          
          {filters.assignedTo && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Assigned To: {filters.assignedTo}
              <button
                onClick={() => onFilterChange({ assignedTo: '' })}
                className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters; 