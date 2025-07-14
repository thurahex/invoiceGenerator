import { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

// Define custom interfaces to replace Prisma types
interface InvoiceItem {
  description: string;
  amount: number;
}

interface Invoice {
  id: number;
  status: string;
  date: Date | string;
  customerName: string;
  usdToThbRate: number;
  thbToMmkRate: number;
  totalUsd: number;
  totalThb: number;
  totalMmk: number;
  finalMmk: number;
  items: InvoiceItem[];
}

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: () => void;
}

export default function InvoicePreview({ invoice, onClose, onDownload }: InvoicePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-3 sm:p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex flex-col items-center mb-4 sm:mb-8 text-center">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">INVOICE</h1>
          <p className="text-lg sm:text-2xl font-semibold text-gray-800 mb-1">#{invoice.id}</p>
          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${invoice.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8 text-xs sm:text-sm">
          <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
            <h3 className="font-medium text-gray-500 mb-1 sm:mb-2">Client</h3>
            <p className="text-sm sm:text-lg font-semibold text-gray-900 break-words">{invoice.customerName}</p>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
            <h3 className="font-medium text-gray-500 mb-1 sm:mb-2">Exchange Rates</h3>
            <div className="space-y-1">
              <p className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">USD/THB:</span>
                <span className="font-medium text-gray-900">{invoice.usdToThbRate.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">THB/MMK:</span>
                <span className="font-medium text-gray-900">{invoice.thbToMmkRate.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-8 bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[280px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-800 break-words">{item.description}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 sm:p-6 mb-4 sm:mb-8">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-4">Summary</h3>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Total USD:</span>
              <span className="font-medium text-gray-900">${invoice.totalUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Total THB:</span>
              <span className="font-medium text-gray-900">฿{invoice.totalThb.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Total MMK:</span>
              <span className="font-medium text-gray-900">K{invoice.totalMmk.toFixed(2)}</span>
            </div>
            <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-lg font-semibold text-gray-900">Final Amount</span>
                <span className="text-base sm:text-2xl font-bold text-gray-900">K{invoice.finalMmk.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors text-sm"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors flex items-center justify-center text-sm"
          >
            <DocumentArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}