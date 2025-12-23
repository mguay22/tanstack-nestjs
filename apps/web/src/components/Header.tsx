import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, Menu, X, CheckSquare } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="h-16 px-4 flex items-center justify-between bg-gray-900 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">TanStack + NestJS</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors"
            activeProps={{ className: 'text-white font-medium' }}
          >
            Home
          </Link>
          <Link
            to="/tasks"
            className="text-gray-300 hover:text-white transition-colors"
            activeProps={{ className: 'text-white font-medium' }}
          >
            Tasks
          </Link>
        </nav>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/tasks"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2',
            }}
          >
            <CheckSquare size={20} />
            <span className="font-medium">Tasks</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
