import React from 'react';

const ItemsPerPageSelector = ({ itemsPerPage, onItemsPerPageChange, totalItems }) => {
  const options = [5, 10, 25, 50, 100];
  
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="itemsPerPage" className="text-sm text-gray-700 whitespace-nowrap">
        Items per page:
      </label>
      <select
        id="itemsPerPage"
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option} disabled={option > totalItems && totalItems > 0}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemsPerPageSelector;