'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary">Invoice System</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-accent text-primary'
                    : 'border-transparent text-secondary hover:border-gray-300 hover:text-primary'
                }`}
              >
                Generate Invoice
              </Link>
              <Link
                href="/invoices"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/invoices'
                    ? 'border-accent text-primary'
                    : 'border-transparent text-secondary hover:border-gray-300 hover:text-primary'
                }`}
              >
                Manage Invoices
              </Link>
              <Link
                href="/customers"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/customers'
                    ? 'border-accent text-primary'
                    : 'border-transparent text-secondary hover:border-gray-300 hover:text-primary'
                }`}
              >
                Add Customer
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/'
                ? 'border-accent text-accent bg-accent bg-opacity-10'
                : 'border-transparent text-secondary hover:bg-gray-50 hover:border-gray-300 hover:text-primary'
            }`}
          >
            Generate Invoice
          </Link>
          <Link
            href="/invoices"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/invoices'
                ? 'border-accent text-accent bg-accent bg-opacity-10'
                : 'border-transparent text-secondary hover:bg-gray-50 hover:border-gray-300 hover:text-primary'
            }`}
          >
            Manage Invoices
          </Link>
          <Link
            href="/customers"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === '/customers'
                ? 'border-accent text-accent bg-accent bg-opacity-10'
                : 'border-transparent text-secondary hover:bg-gray-50 hover:border-gray-300 hover:text-primary'
            }`}
          >
            Add Customer
          </Link>
        </div>
      </div>
    </nav>
  );
}