import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Wallet = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { requiredAmount = 0, callTime, astrologerName } = location.state || {};

    const [currentBalance] = useState(500);
    const [depositAmount, setDepositAmount] = useState(requiredAmount || 500);

    const quickAmounts = ["+20", "+50", "+100", "+200", "+500", "+1000"];

    const handleQuickAmount = (amount) => {
        setDepositAmount(parseInt(amount.replace('+', '')));
    };

    const handleDepositMoney = () => {
        console.log('Depositing amount:', depositAmount);
    };

    return (
        <div className="min-h-screen bg-[#f8f1e8] flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow p-4 border">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-sm font-medium text-gray-700">My Wallet</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-10 py-2 bg-button-vertical-gradient-orange text-white rounded-md text-sm font-semibold shadow"
                    >
                        Add Balance
                    </button>
                </div>

                {/* Wallet Card */}
                <div className="w-full flex justify-center">
                    <div className="w-[530px] bg-button-vertical-gradient-orange rounded-xl p-6 shadow-md text-white relative">

                        <div className="flex items-end">
                            <div className="text-[100px] font-extrabold leading-none">₹{currentBalance}</div>
                            <div className="text-xs pb-2">Total Balance</div>
                        </div>

                        {/* Money Bag Image */}
                        <img
                            src="/src/assets/Wallet/OBJECTS.png"
                            alt="money"
                            className="w-24 absolute right-14 top-20"
                        />

                        {/* Inner Card */}
                        <div className="bg-white rounded-xl p-5 mt-2 text-gray-700 shadow-sm">
                            <label className="text-sm font-medium">Enter Amount</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={`₹ ${depositAmount}`}
                                    onChange={(e) => {
                                        const value = e.target.value.replace('₹ ', '');
                                        setDepositAmount(parseInt(value) || 0);
                                    }}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            {/* Quick Add Buttons */}
                            <div className="flex gap-3 mt-4 flex-wrap">
                                {quickAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => handleQuickAmount(amt)}
                                        className="px-4 py-1.5 border rounded-md text-xs font-medium hover:bg-gray-100"
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
                </div>
            </div>
        </div>
    );
};

export default Wallet;