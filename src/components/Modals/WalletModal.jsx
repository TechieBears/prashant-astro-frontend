import { useState } from 'react';
import { X } from 'lucide-react';
import WalletCard from '../Common/WalletCard';

const WalletModal = ({ isOpen, onClose, requiredAmount = 0, callTime, astrologerName }) => {
    const [currentBalance] = useState(500);

    const handleDepositMoney = (amount) => {
        console.log('Depositing amount:', amount);
        // Add your deposit logic here
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative">
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-10 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-[530px]">
                    <WalletCard
                        currentBalance={currentBalance}
                        requiredAmount={requiredAmount}
                        onDeposit={handleDepositMoney}
                    />
                </div>
            </div>
        </div>
    );
};

export default WalletModal;