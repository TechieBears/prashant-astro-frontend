import React from 'react';
import {
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaTruck,
    FaBoxOpen,
    FaMoneyBillWave,
    FaUndo
} from 'react-icons/fa';

const STATUS_CONFIG = {
    DELIVERED: {
        text: 'Delivered',
        icon: FaBoxOpen,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100'
    },
    PENDING: {
        text: 'Pending',
        icon: FaClock,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
    },
    CANCELLED: {
        text: 'Cancelled',
        icon: FaTimesCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-100'
    },
    SHIPPED: {
        text: 'Shipped',
        icon: FaTruck,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100'
    },
    REFUNDED: {
        text: 'Refunded',
        icon: FaUndo,
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-100'
    },
    CONFIRMED: {
        text: 'Confirmed',
        icon: FaCheckCircle,
        iconColor: 'text-green-500',
        bgColor: 'bg-green-50'
    }
};

const DEFAULT_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const OrderStatusBar = ({ currentStatus = 'PENDING', className = '' }) => {
    const status = (currentStatus || 'PENDING').toUpperCase();
    const isException = status === 'CANCELLED' || status === 'REFUNDED';
    const steps = isException ? [...DEFAULT_STATUSES, status] : DEFAULT_STATUSES;
    const currentIndex = steps.findIndex((s) => s === status);

    // Determine theme based on status
    const getThemeColors = () => {
        if (status === 'DELIVERED') {
            return {
                progressBar: 'bg-green-500',
                highlightRing: 'ring-green-500',
                completedText: 'text-green-600',
                currentText: 'text-green-700 font-semibold',
                inactiveText: 'text-green-400'
            };
        } else if (status === 'REFUNDED') {
            return {
                progressBar: 'bg-orange-500',
                highlightRing: 'ring-orange-500',
                completedText: 'text-orange-600',
                currentText: 'text-orange-700 font-semibold',
                inactiveText: 'text-orange-400'
            };
        } else if (status === 'CANCELLED') {
            return {
                progressBar: 'bg-red-700',
                highlightRing: 'ring-red-700',
                completedText: 'text-red-600',
                currentText: 'text-red-800 font-semibold',
                inactiveText: 'text-red-400'
            };
        } else {
            // Default theme for PENDING, CONFIRMED, SHIPPED
            return {
                progressBar: 'bg-green-500',
                highlightRing: 'ring-orange-500',
                completedText: 'text-slate-600',
                currentText: 'text-orange-700 font-semibold',
                inactiveText: 'text-slate-400'
            };
        }
    };

    const theme = getThemeColors();

    const getStatusConfig = (step) => {
        return STATUS_CONFIG[step] || {
            text: step,
            icon: FaCheckCircle,
            iconColor: 'text-gray-400',
            bgColor: 'bg-gray-100'
        };
    };

    // Override icon colors based on status for consistent theming
    const getEffectiveIconColor = (step) => {
        if (status === 'DELIVERED') {
            return 'text-green-600';
        } else if (status === 'REFUNDED') {
            return 'text-orange-600';
        } else if (status === 'CANCELLED') {
            return 'text-red-700';
        }
        return STATUS_CONFIG[step]?.iconColor || 'text-gray-400';
    };

    const getEffectiveBgColor = (step) => {
        if (status === 'DELIVERED') {
            return 'bg-green-100';
        } else if (status === 'REFUNDED') {
            return 'bg-orange-100';
        } else if (status === 'CANCELLED') {
            return 'bg-red-100';
        }
        return STATUS_CONFIG[step]?.bgColor || 'bg-gray-100';
    };

    const getStatusClasses = (step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const config = getStatusConfig(step);

        if (isException) {
            if (isCompleted) return theme.completedText;
            if (isCurrent) return theme.currentText;
        } else {
            if (isCompleted) return theme.completedText;
            if (isCurrent) return theme.currentText;
        }
        return theme.inactiveText;
    };

    return (
        <div className={`w-full select-none ${className}`}>
            <div className="relative px-1 sm:px-2 h-8 sm:h-10">
                <div className="absolute left-4 sm:left-5 right-4 sm:right-5 top-1/2 -translate-y-1/2 z-0">
                    <div className="h-[2px] bg-gray-200"></div>
                    <div
                        className={`absolute h-[2px] ${theme.progressBar} transition-all duration-300`}
                        style={{
                            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
                            top: 0,
                            left: 0
                        }}
                    ></div>
                </div>

                {/* Icons layer */}
                <div className="flex justify-between items-center h-8 sm:h-10">
                    {steps.map((step, index) => {
                        const config = getStatusConfig(step);
                        const Icon = config.icon;
                        const isActive = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={step} className="relative z-10">
                                <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${isCurrent ? `ring-2 ring-offset-2 ${step === 'DELIVERED' ? 'ring-green-500' : theme.highlightRing}` : ''} ${getEffectiveBgColor(step)} transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                >
                                    <Icon
                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${getEffectiveIconColor(step)} transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Labels row aligned under icons */}
            <div className="flex justify-between text-[10px] sm:text-xs mt-1 font-medium px-1 sm:px-2">
                {steps.map((step, index) => (
                    <span
                        key={step}
                        className={`text-center w-8 sm:w-10 ${getStatusClasses(step, index)}`}
                        style={{
                            display: 'inline-block'
                        }}
                    >
                        {getStatusConfig(step).text}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusBar;
