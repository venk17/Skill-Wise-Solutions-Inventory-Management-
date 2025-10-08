import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const InventoryHistorySidebar = ({ product, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      fetchHistory();
    }
  }, [product, isOpen]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getHistory(product.id);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getChangeDirection = (oldQty, newQty) => {
    if (newQty > oldQty) return 'increase';
    if (newQty < oldQty) return 'decrease';
    return 'no-change';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory History</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          {product && (
            <p className="text-gray-600 mt-2">
              {product.name} - {product.brand}
            </p>
          )}
        </div>
        
        <div className="p-6 overflow-y-auto h-full pb-20">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : history.length === 0 ? (
            <p className="text-gray-500 text-center">No history available</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => {
                const direction = getChangeDirection(entry.old_quantity, entry.new_quantity);
                const change = entry.new_quantity - entry.old_quantity;
                
                return (
                  <div key={entry.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center space-x-2 ${
                        direction === 'increase' ? 'text-green-600' : 
                        direction === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <span className="text-lg">
                          {direction === 'increase' ? '↗' : direction === 'decrease' ? '↘' : '→'}
                        </span>
                        <span className="font-medium">
                          {entry.old_quantity} → {entry.new_quantity}
                        </span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        direction === 'increase' ? 'bg-green-100 text-green-800' : 
                        direction === 'decrease' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {change > 0 ? '+' : ''}{change}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Date: {formatDate(entry.change_date)}</p>
                      <p>By: {entry.user_info}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryHistorySidebar;