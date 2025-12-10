import React from 'react';

const Tabs = ({ activeTab, onTabChange, tabs, className = '', buttonClassName = '' }) => {
  return (
    <div className={`flex w-full bg-white rounded-full p-1 border border-gray-200 shadow-sm ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 px-4 sm:px-6 py-2 rounded-full transition-colors text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === tab.id
            ? 'bg-button-gradient-orange text-white hover:opacity-90'
            : 'text-gray-600 hover:bg-gray-50'
            } ${buttonClassName}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
