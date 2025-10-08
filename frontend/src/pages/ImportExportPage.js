import React, { useState } from 'react';
import { productsAPI } from '../services/api';

const ImportExportPage = () => {
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
    } else {
      showMessage('Please select a valid CSV file', 'error');
      e.target.value = '';
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      showMessage('Please select a CSV file to import', 'error');
      return;
    }

    try {
      setImporting(true);
      const response = await productsAPI.import(importFile);
      showMessage(response.data.message, 'success');
      setImportFile(null);
      // Clear the file input
      document.getElementById('csvFile').value = '';
    } catch (error) {
      console.error('Import error:', error);
      showMessage(
        error.response?.data?.error || 'Error importing products',
        'error'
      );
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await productsAPI.export();
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showMessage('Products exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showMessage('Error exporting products', 'error');
    } finally {
      setExporting(false);
    }
  };

  const csvTemplate = `name,unit,category,brand,stock,status
Sample Product,pcs,Electronics,Sample Brand,10,In Stock
Another Product,box,Stationery,Another Brand,0,Out of Stock`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-template.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Import & Export
            </h1>
            <p className="text-gray-600 mt-1">
              Import products from CSV or export current inventory
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className={`rounded-md p-4 mb-6 ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Import Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Import Products
            </h2>
            <p className="text-gray-600 mb-4">
              Upload a CSV file to import multiple products at once.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {importFile && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">
                    Selected: {importFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(importFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={importing || !importFile}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {importing ? 'Importing...' : 'Import Products'}
              </button>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  CSV Format Requirements:
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Headers: name, unit, category, brand, stock, status</li>
                  <li>• Stock should be a number (0 or greater)</li>
                  <li>• Status will be auto-calculated based on stock</li>
                </ul>

                <button
                  onClick={downloadTemplate}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Download Sample Template
                </button>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Export Products
            </h2>
            <p className="text-gray-600 mb-6">
              Download all products as a CSV file for backup or external use.
            </p>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {exporting ? 'Exporting...' : 'Export All Products'}
            </button>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Export Features:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Includes all product information</li>
                <li>• CSV format compatible with Excel</li>
                <li>• Filename includes current date</li>
                <li>• Ready for re-import if needed</li>
              </ul>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                💡 Pro Tip
              </h4>
              <p className="text-sm text-blue-800">
                Regular exports serve as great backups. Consider exporting your inventory weekly or before major changes.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Data Preview */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            CSV Format Example
          </h2>
          <div className="overflow-x-auto">
            <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 whitespace-pre">
{csvTemplate}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;