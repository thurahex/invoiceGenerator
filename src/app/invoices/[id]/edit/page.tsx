'use client';

import { useState, useEffect } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

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

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    items: [{ description: '', amount: 0 }],
    usdToThbRate: 35,
    thbToMmkRate: 0.09,
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices?id=${params.id}`);
      if (!response.ok) throw new Error('Failed to load invoice');
      const invoice = await response.json();
      setInvoiceData({
        customerName: invoice.customerName,
        date: invoice.date,
        usdToThbRate: invoice.usdToThbRate,
        thbToMmkRate: invoice.thbToMmkRate,
        items: invoice.items.map((item: any) => ({
          description: item.description,
          amount: item.amount
        }))
      });
    } catch (error) {
      console.error('Failed to load invoice:', error);
      setError('Failed to load invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', amount: 0 }]
    });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateTotal = () => {
    const usdTotal = invoiceData.items.reduce((sum, item) => sum + Number(item.amount), 0);
    const thbTotal = usdTotal * invoiceData.usdToThbRate;
    const mmkTotal = thbTotal * invoiceData.thbToMmkRate;
    const finalTotal = mmkTotal * 0.95; // Apply 5% reduction
    return {
      usd: usdTotal.toFixed(2),
      thb: thbTotal.toFixed(2),
      mmk: mmkTotal.toFixed(2),
      final: finalTotal.toFixed(2)
    };
  };

  const updateInvoice = async () => {
    try {
      const totals = calculateTotal();
      const response = await fetch(`/api/invoices?id=${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: invoiceData.customerName,
          date: invoiceData.date,
          usdToThbRate: invoiceData.usdToThbRate,
          thbToMmkRate: invoiceData.thbToMmkRate,
          items: invoiceData.items,
          totals
        })
      });

      if (!response.ok) throw new Error('Failed to update invoice');
      window.location.href = '/invoices';
    } catch (error) {
      console.error('Failed to update invoice:', error);
      alert('Failed to update invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Loading invoice...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Invoice Preview</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{invoiceData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{invoiceData.date}</span>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{item.description}</span>
                    <span>${item.amount}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total (USD):</span>
                  <span>${totals.usd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total (THB):</span>
                  <span>฿{totals.thb}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total (MMK):</span>
                  <span>K{totals.mmk}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Final Total (MMK):</span>
                  <span>K{totals.final}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Edit Invoice</h1>
          
          {/* Customer Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={invoiceData.customerName}
              onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
            />
          </div>

          {/* Exchange Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">USD to THB Rate</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={invoiceData.usdToThbRate}
                onChange={(e) => setInvoiceData({ ...invoiceData, usdToThbRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">THB to MMK Rate</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={invoiceData.thbToMmkRate}
                onChange={(e) => setInvoiceData({ ...invoiceData, thbToMmkRate: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full p-2 border rounded-md"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount (USD)"
                  className="w-full p-2 border rounded-md"
                  value={item.amount}
                  onChange={(e) => updateItem(index, 'amount', Number(e.target.value))}
                />
              </div>
            ))}
            <button
              onClick={addItem}
              className="bg-accent text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Total (USD):</span>
              <span>${totals.usd}</span>
            </div>
            <div className="flex justify-between">
              <span>Total (THB):</span>
              <span>฿{totals.thb}</span>
            </div>
            <div className="flex justify-between">
              <span>Total (MMK):</span>
              <span>K{totals.mmk}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Final Total (MMK) after 5% reduction:</span>
              <span>K{totals.final}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => window.location.href = '/invoices'}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Preview
            </button>
            <button
              onClick={updateInvoice}
              className="bg-accent text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}