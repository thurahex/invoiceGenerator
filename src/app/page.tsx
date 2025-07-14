'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    items: [{ description: '', amount: 0 }],
    usdToThbRate: 35,
    thbToMmkRate: 0.09,
    date: new Date().toISOString().split('T')[0]
  });

  const invoiceRef = useRef<HTMLDivElement>(null);

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
    const finalMmkTotal = mmkTotal * 0.92; // Apply 8% reduction
    const finalThbTotal = thbTotal * 0.92; // Apply 8% reduction
    return {
      usd: usdTotal.toFixed(2),
      thb: thbTotal.toFixed(2),
      mmk: mmkTotal.toFixed(2),
      final: finalMmkTotal.toFixed(2),
      finalThb: finalThbTotal.toFixed(2)
    };
  };

  const downloadInvoice = async () => {
    try {
      if (invoiceRef.current) {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2, // Increase resolution
          useCORS: true, // Enable cross-origin images
          logging: false,
          backgroundColor: null,
          imageTimeout: 0,
          removeContainer: true,
          allowTaint: true
        });
        const link = document.createElement('a');
        link.download = `invoice-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0); // Maximum quality
        link.click();
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

    const totals = calculateTotal();
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Invoice Generator</h1>
          
          {/* Customer Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={invoiceData.customerName}
              onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
              required
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
        </div>

        {/* Invoice Preview */}
        <div ref={invoiceRef} className="bg-[#1877F2] text-white shadow-xl rounded-xl p-12 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12 text-center border-b border-white/20 pb-8">
            <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight">INVOICE</h2>
            <p className="text-2xl font-semibold text-white/90 mb-6">thurablog payout service</p>
            <div className="text-white/80 text-[22px] grid grid-cols-2 gap-10 w-full max-w-lg">
              <div>
                <p className="font-medium text-white/70 mb-1">Customer</p>
                <p className="font-semibold text-white">{invoiceData.customerName}</p>
              </div>
              <div>
                <p className="font-medium text-white/70 mb-1">Date</p>
                <p className="font-semibold text-white">{invoiceData.date}</p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-white/20">
                  <th className="text-left py-6 text-lg font-semibold text-white/90 uppercase tracking-wider">Description</th>
                  <th className="text-right py-6 text-lg font-semibold text-white/90 uppercase tracking-wider">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-6 text-[25px] text-white/90">{item.description}</td>
                    <td className="py-6 text-right text-lg font-medium text-white">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 space-y-6 shadow-inner border border-white/20">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
              <div className="space-y-6">
                <div className="flex justify-between text-[23px]">
                  <span className="text-white/80">Total (USD):</span>
                  <span className="font-semibold text-white">${totals.usd}</span>
                </div>
                <div className="flex justify-between text-[23px]">
                  <span className="text-white/80">Total (THB):</span>
                  <span className="font-semibold text-white">฿{totals.thb}</span>
                </div>
                <div className="flex justify-between text-[23px]">
                  <span className="text-white/80">Final (THB):</span>
                  <span className="font-semibold text-white">฿{totals.finalThb}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between text-[23px]">
                  <span className="text-white/80">Total (MMK):</span>
                  <span className="font-semibold text-white">K{totals.mmk}</span>
                </div>
                <div className="flex justify-between text-[23px] text-white/90">
                  <span>Reduction (8%):</span>
                  <span>-K {(Number(totals.mmk) * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[23px] text-white/90">
                  <span>Reduction (8%):</span>
                  <span>-THB {(Number(totals.thb) * 0.08).toFixed(2)}</span>
                </div>
                
              </div>
            </div>
            <div className="pt-8 border-t-2 border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-semibold text-white">Final Amount</span>
                <span className="text-4xl font-bold text-white">K{totals.final}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={downloadInvoice}
            className="w-full max-w-md bg-accent text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Download Invoice as PNG
          </button>
        </div>
      </div>
    </div>
  );
}