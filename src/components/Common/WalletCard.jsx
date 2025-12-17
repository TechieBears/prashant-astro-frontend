import { useState } from 'react';

const WalletCard = ({ currentBalance, requiredAmount = 0, onDeposit }) => {
    const [depositAmount, setDepositAmount] = useState(Math.max(requiredAmount || 50, 50));

    const quickAmounts = ["+50", "+100", "+200", "+500", "+1000", "+1500"];

    const handleQuickAmount = (amount) => {
        setDepositAmount(parseInt(amount.replace('+', '')));
    };

    const handleDepositMoney = () => {
        if (onDeposit) {
            onDeposit(depositAmount);
        }
    };

    return (
        <div className="bg-button-vertical-gradient-orange rounded-xl p-6 shadow-md text-white relative">
            {/* Shadow Image */}
            <img
                src="/src/assets/Wallet/shadow.png"
                alt="shadow"
                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50"
            />

            <div className="flex items-end relative z-10">
                <div className="text-[100px] font-extrabold leading-none">₹{currentBalance}</div>
                <div className="text-xs pb-2">Total Balance</div>
            </div>

            {/* Money Bag Image */}
            <img
                src="/src/assets/Wallet/OBJECTS.png"
                alt="money"
                className="w-24 absolute right-14 top-20 z-20"
            />

            {/* Inner Card */}
            <div className="bg-white rounded-xl p-5 mt-2 text-gray-700 shadow-sm relative z-10">
                <label className="text-sm font-medium">Enter Amount</label>
                <div className="mt-2">
                    <input
                        type="text"
                        value={`₹ ${depositAmount}`}
                        onChange={(e) => {
                            const value = e.target.value.replace('₹ ', '');
                            setDepositAmount(parseInt(value) || 50);
                        }}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                {/* Quick Add Buttons */}
                <div className="flex gap-2 mt-4">
                    {quickAmounts.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => handleQuickAmount(amt)}
                            className="flex-1 py-1.5 border rounded-md text-xs font-medium hover:bg-gray-100"
                        >
                            {amt}
                        </button>
                    ))}
                </div>

                <p className="text-[11px] text-center text-gray-500 mt-3">
                    Enter Amount or Add money to set Deposit Amount
                </p>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleDepositMoney}
                        className="px-6 py-2 bg-button-vertical-gradient-orange text-white rounded-md text-sm font-semibold shadow"
                    >
                        Deposit Money
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
