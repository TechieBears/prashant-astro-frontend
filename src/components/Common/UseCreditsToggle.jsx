import React from 'react';

const UseCreditsToggle = ({ useCredits, onToggle, availableCredits = 0 }) => {
    return (
        <div className="bg-light-pg p-3 md:p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">Use Credits</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Available: ₹{availableCredits.toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        useCredits ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            useCredits ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        </div>
    );
};

export default UseCreditsToggle;
