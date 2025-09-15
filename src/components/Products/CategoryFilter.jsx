import React from 'react';

const CategoryFilter = ({ categories, selected, onToggle }) => {
  return (
    <ul className="space-y-3">
      {categories.map((category) => {
        const isChecked = selected.includes(category.key);
        return (
          <li key={category.key} className="flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => onToggle(category.key)}
              className="flex items-center gap-3 w-full"
              aria-label={`Filter by ${category.label}`}
            >
              <span className={`chk-box ${isChecked ? 'checked' : ''}`}>
                {isChecked && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    className="w-3 h-3" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
              </span>
              <span className="text-slate-700 text-base flex items-center gap-2">
                {category.label}
                <span className="text-slate-500">({category.count})</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default React.memo(CategoryFilter);
