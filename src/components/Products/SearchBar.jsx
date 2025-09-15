import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        aria-label="Search products"
      />
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-4 h-4" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
        </svg>
      </span>
    </div>
  );
};

export default React.memo(SearchBar);
