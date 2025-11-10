import React, { useEffect } from "react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-primary-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="font-serif text-xl font-normal text-primary-black">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-primary-black hover:text-accent-red transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-6">
            <Link
              to="/"
              onClick={onClose}
              className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              The Latest
            </Link>
            <Link
              to="/news"
              onClick={onClose}
              className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              News
            </Link>
            <Link
              to="/articles"
              onClick={onClose}
              className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Articles & Analysis
            </Link>
            <Link
              to="/case-studies"
              onClick={onClose}
              className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Case Studies
            </Link>
            <Link
              to="/trends"
              onClick={onClose}
              className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Tech Trends
            </Link>
            <Link
              to="/insights"
              onClick={onClose}
              className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Insights
            </Link>
            <Link
              to="/admin"
              onClick={onClose}
              className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
