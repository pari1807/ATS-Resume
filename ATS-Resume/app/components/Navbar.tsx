import React from 'react';
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 select-none">
      <nav className="navbar">
        <Link to="/" className="flex items-center group">
          <img src="/images/logo.svg" alt="MatchRate" className="h-6.5 w-auto object-contain transition-opacity duration-200 hover:opacity-90" />
        </Link>
        <Link to="/upload" className="primary-button !py-2 !px-4 hover:shadow-primary-500/10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Analyze Resume
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;