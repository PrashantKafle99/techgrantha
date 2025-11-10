import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Main Navigation */}
      <header className="bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="text-center" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-serif text-gray-900 tracking-wide">
                TECH GRANTHA
              </h1>
            </Link>
          </div>

          {/* Navigation Links - Always visible, centered below logo */}
          <nav className="pb-4">
            <div className="flex justify-center items-center pt-4">
              {/* Navigation Links - Always visible */}
              <div className="flex items-center justify-center">
                <Link 
                  to="/" 
                  className={`py-2 transition-colors text-sm font-bold ${
                    isActive('/') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
                  }`}
                  style={{ paddingLeft: '24px', paddingRight: '24px' }}
                >
                  Home
                </Link>
                <Link 
                  to="/dailytech" 
                  className={`py-2 transition-colors text-sm font-bold ${
                    isActive('/dailytech') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
                  }`}
                  style={{ paddingLeft: '24px', paddingRight: '24px' }}
                >
                  DailyTech
                </Link>
                <Link 
                  to="/article" 
                  className={`py-2 transition-colors text-sm font-bold ${
                    isActive('/article') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
                  }`}
                  style={{ paddingLeft: '24px', paddingRight: '24px' }}
                >
                  Articles
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>


    </>
  );
};

export default Header;