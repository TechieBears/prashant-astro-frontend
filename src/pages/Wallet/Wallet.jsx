import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWalletBalance } from '../../api';

const Wallet = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { requiredAmount = 0, callTime, astrologerName } = location.state || {};

    const [currentBalance, setCurrentBalance] = useState(0);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            const res = await getWalletBalance();
            if (res?.success) {
                setCurrentBalance(res?.data?.balance || 0);
            }
        };
        fetchWalletBalance();
    }, []);
    const [depositAmount, setDepositAmount] = useState(requiredAmount || 500);
    const quickAmounts = ["+20", "+50", "+100", "+200", "+500", "+1000"];

    const transactions = [
        { id: 1, type: 'sent', description: 'Talk with Astrology', amount: 150, date: '10/30/2025 12:30 PM' },
        { id: 2, type: 'received', description: 'Deposit by razorpay', amount: 300, date: '10/29/2025 10:49 AM' },
        { id: 3, type: 'sent', description: 'Service Booked', amount: 300, date: '10/28/2025 02:15 PM' },
        { id: 4, type: 'sent', description: 'Product Order', amount: 450, date: '10/25/2025 11:28 AM' },
        { id: 5, type: 'sent', description: 'Talk with Astrology', amount: 150, date: '10/30/2025 12:30 PM' },
        { id: 6, type: 'received', description: 'Deposit by razorpay', amount: 300, date: '10/29/2025 10:49 AM' },
        { id: 7, type: 'sent', description: 'Service Booked', amount: 300, date: '10/28/2025 02:15 PM' },
        { id: 8, type: 'sent', description: 'Product Order', amount: 450, date: '10/25/2025 11:28 AM' }
    ];

    const handleQuickAmount = (amount) => {
        setDepositAmount(parseInt(amount.replace('+', '')));
    };

    const handleDepositMoney = () => {
        console.log('Depositing amount:', depositAmount);
    };

    return (
        <div className="min-h-screen bg-[#f8f1e8] flex justify-center items-start pt-20 md:pt-10 pb-4 md:pb-10 px-2 md:px-4">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow p-2 md:p-4 border">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-3 sm:gap-0">
                    <h1 className="text-lg md:text-xl font-bold text-gray-700">My Wallet</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 md:px-10 py-2 bg-button-vertical-gradient-orange text-white rounded-md text-sm font-semibold shadow w-full sm:w-auto"
                    >
                        Add Balance
                    </button>
                </div>

                {/* Wallet Card and Transaction History */}
                <div className="w-full flex flex-col lg:flex-row justify-start gap-4 items-stretch px-2 md:px-4 lg:px-8">
                    {/* Left Column - Wallet Card and Empty Card */}
                    <div className="w-full lg:w-[520px] flex flex-col gap-4 flex-shrink-0 self-stretch">
                        {/* Wallet Card */}
                        <div className="bg-button-vertical-gradient-orange rounded-xl p-4 md:p-6 shadow-md text-white relative">
                            {/* Shadow Image */}
                            <img
                                src="/src/assets/Wallet/shadow.png"
                                alt="shadow"
                                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50"
                            />

                            <div className="flex items-end relative z-10">
                                <div className="text-[60px] md:text-[80px] lg:text-[100px] font-extrabold leading-none">₹{currentBalance}</div>
                                <div className="text-base md:text-lg pb-1">Total Balance</div>
                            </div>

                            {/* Money Bag Image */}
                            <img
                                src="/src/assets/Wallet/OBJECTS.png"
                                alt="money"
                                className="w-20 md:w-28 absolute right-6 md:right-14 top-16 md:top-20 z-20"
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
                                            setDepositAmount(parseInt(value) || 0);
                                        }}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                </div>

                                {/* Quick Add Buttons */}
                                <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4">
                                    {quickAmounts.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => handleQuickAmount(amt)}
                                            className="px-3 md:px-4 py-1.5 border rounded-md text-xs font-medium hover:bg-gray-100 active:bg-gray-200"
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

                        {/* Empty Card */}
                        <div className="h-[160px] md:h-[180px] bg-gradient-to-b from-[#FFF5E6] to-[#FFE8F0] rounded-xl border border-black/15 relative p-3 md:p-4 hidden lg:block">
                            <h3 className="font-semibold text-gray-800 text-lg md:text-xl">Download Our Mobile App</h3>
                            <p className="text-xs md:text-sm text-gray-500 max-w-xs mt-2">For a same less experience, download our apps on your phone</p>
                            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="w-32 md:w-40 mt-2" />
                            <img src="/src/assets/Wallet/phone.png" alt="phone" className="absolute bottom-0 right-4 md:right-6 h-[7.5rem] md:h-[8.5rem]" />
                        </div>
                    </div>

                    {/* Transaction History Card */}
                    <div className="flex-1 bg-white rounded-xl shadow-md border border-black/15 flex flex-col min-h-[400px] lg:min-h-0">
                        <h2 className="text-sm md:text-md text-gray-800 bg-slate-100 p-2 md:p-3 rounded-t-xl border-b border-black/15 flex-shrink-0">Transaction History</h2>

                        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full px-2 md:px-3 pb-3 pt-3 min-h-0">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 hover:bg-gray-50 transition-colors border-b border-black/15">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${transaction.type === 'sent' ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center flex-shrink-0`}>
                                        <svg className={`w-4 h-4 md:w-5 md:h-5 ${transaction.type === 'sent' ? 'text-red-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={transaction.type === 'sent' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] md:text-xs text-gray-500">{transaction.type === 'sent' ? 'Sent' : 'Received'}</p>
                                        <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{transaction.description}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs md:text-sm font-semibold text-gray-800">₹{transaction.amount}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500 truncate max-w-[100px] md:max-w-none">{transaction.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;