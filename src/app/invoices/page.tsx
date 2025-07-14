
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

'use client';

import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Invoice {
  id: number;
  customerName: string;
  date: string;
  usdToThbRate: number;
  thbToMmkRate: number;
  totalUsd: number;
  totalThb: number;
  totalMmk: number;
  finalMmk: number;
  status: string;
  items: Array<{
    id: number;
    description: string;
    amount: number;
  }>;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      const response = await fetch(`/api/invoices?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete invoice');
      loadInvoices();
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      alert('Failed to delete invoice. Please try again.');
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/invoices?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      loadInvoices();
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      alert('Failed to update invoice status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Loading invoices...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-accent text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (USD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final (MMK)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.totalUsd}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">K{invoice.finalMmk}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={invoice.status || 'pending'}
                      onChange={(e) => updateStatus(invoice.id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => window.location.href = `/invoices/${invoice.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}