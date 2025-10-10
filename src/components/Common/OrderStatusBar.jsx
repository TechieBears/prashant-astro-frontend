import React from 'react';

const DEFAULT_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED'
];

const OrderStatusBar = ({ currentStatus = 'PENDING', className = '' }) => {
    const status = (currentStatus || '').toUpperCase();

    const isException = status === 'CANCELLED' || status === 'REFUNDED';

    const steps = isException ? [...DEFAULT_STATUSES, status] : DEFAULT_STATUSES;

    const currentIndex = steps.findIndex((s) => s === status);

    const getCircleClasses = (index) => {
        if (index < currentIndex) {
            return isException ? 'bg-red-400' : 'bg-green-600';
        }
        if (index === currentIndex) {
            return isException ? 'bg-red-600' : 'bg-orange-500';
        }
        return 'bg-gray-300';
    };

    const getLineClasses = (index) => {
        if (index < currentIndex) {
            return isException ? 'bg-red-400' : 'bg-green-600';
        }
        return 'bg-gray-300';
    };

    return (
        <div className={`w-full select-none ${className}`}>
            <div className="flex items-center w-full">
                {steps.map((step, idx) => (
                    <div key={step} className="flex items-center w-full">
                        <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 ${getCircleClasses(idx)}`}
                        />
                        {idx !== steps.length - 1 && (
                            <div className={`flex-1 h-0.5 ${getLineClasses(idx)} mx-1 sm:mx-2`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs mt-1 font-medium text-gray-600">
                {steps.map((step) => (
                    <span key={step} className="w-16 text-center break-words uppercase">
                        {step === 'REFUNDED' ? 'REFUND' : step}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusBar;
