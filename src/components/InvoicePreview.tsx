import { useState } from 'react';
import { Invoice, InvoiceItem } from '@prisma/client';

type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
  customerName: string;
};

interface InvoicePreviewProps {
  invoice: InvoiceWithItems;
  onClose: () => void;
  onDownload: () => void;
}

export default function InvoicePreview({ invoice, onClose, onDownload }: InvoicePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl overflow-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-1">#{invoice.id}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${invoice.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-medium text-gray-500 mb-2">Client</h3>
            <p className="text-lg font-semibold text-gray-900">{invoice.customerName}</p>
            <p className="text-gray-600 mt-1">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-medium text-gray-500 mb-2">Exchange Rates</h3>
            <div className="space-y-1">
              <p className="flex justify-between">
                <span className="text-gray-600">USD/THB:</span>
                <span className="font-medium text-gray-900">{invoice.usdToThbRate.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">THB/MMK:</span>
                <span className="font-medium text-gray-900">{invoice.thbToMmkRate.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-xl border border-gray-200">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-sm text-gray-800">{item.description}</td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total USD:</span>
              <span className="font-medium text-gray-900">${invoice.totalUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total THB:</span>
              <span className="font-medium text-gray-900">฿{invoice.totalThb.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total MMK:</span>
              <span className="font-medium text-gray-900">K{invoice.totalMmk.toFixed(2)}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Final Amount</span>
                <span className="text-2xl font-bold text-gray-900">K{invoice.finalMmk.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}