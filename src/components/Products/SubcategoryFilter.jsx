import React from 'react';

const SubcategoryFilter = ({ 
  subcategories = [], 
  selectedSubcategories = [], 
  onToggleSubcategory 
}) => {
  if (subcategories.length === 0) {
    return <p className="text-sm text-gray-500">No subcategories available</p>;
  }

  return (
    <ul className="space-y-2 pl-4 border-l-2 border-gray-100">
      {subcategories.map((subcategory) => {
        const isChecked = selectedSubcategories.includes(subcategory._id);
        return (
          <li key={subcategory._id} className="flex items-center">
            <button
              type="button"
              onClick={() => onToggleSubcategory(subcategory._id)}
              className="flex items-center gap-2 w-full group"
              aria-label={`Filter by ${subcategory.name}`}
            >
              <span className={`flex-shrink-0 w-4 h-4 border-2 rounded ${
                isChecked 
                  ? 'bg-orange-400 border-orange-400 flex items-center justify-center' 
                  : 'border-gray-300 group-hover:border-orange-200'
              } transition-colors`}>
                {isChecked && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    className="w-2.5 h-2.5 text-white" 
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
              <span className={`text-sm flex items-center gap-1 ${
                isChecked ? 'text-orange-600 font-medium' : 'text-gray-600 group-hover:text-orange-500'
              } transition-colors`}>
                {subcategory.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default React.memo(SubcategoryFilter);
