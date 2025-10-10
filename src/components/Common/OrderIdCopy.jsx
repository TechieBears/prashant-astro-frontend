import React, { useState, useCallback } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

const OrderIdCopy = ({
    orderId,
    displayLength = 8,
    showHash = true,
    className = '',
    iconClassName = '',
    textClassName = '',
    toastMessage = 'Order ID copied to clipboard!'
}) => {
    const [copied, setCopied] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const handleCopy = useCallback((e) => {
        e.stopPropagation(); // Prevent triggering parent click events
        if (orderId) {
            navigator.clipboard.writeText(orderId).then(() => {
                setCopied(true);
                setShowMessage(true);
                setTimeout(() => {
                    setCopied(false);
                    setShowMessage(false);
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    }, [orderId]);

    if (!orderId) return null;

    const displayId = showHash
        ? `#${orderId.slice(-displayLength)}`
        : orderId.slice(-displayLength);

    return (
        <>
            <div className={`flex items-center gap-1.5 ${className}`}>
                <span
                    className={`font-medium truncate ${textClassName}`}
                    title={orderId}
                >
                    {displayId}
                </span>
                <button
                    onClick={handleCopy}
                    className={`text-gray-500 hover:text-gray-700 transition-colors p-0.5 flex-shrink-0 ${iconClassName}`}
                    title="Copy full Order ID"
                    type="button"
                >
                    {copied ? (
                        <FaCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
                    ) : (
                        <FaCopy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    )}
                </button>
            </div>

            {/* Copy Success Message Toast */}
            {showMessage && (
                <div className="fixed bottom-4 left-0 right-0 flex justify-center z-[10000] pointer-events-none">
                    <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
                        <FaCheck className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderIdCopy;

