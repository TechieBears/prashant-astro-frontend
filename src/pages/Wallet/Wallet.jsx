import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWalletBalance, getWalletTransactions } from '../../api';
import WalletCard from '../../components/Common/WalletCard';
import phoneImg from '../../assets/Wallet/phone.png';

const TRANSACTION_LABELS = {
    deposit: 'Deposit by razorpay',
    withdrawal: 'Withdrawal',
    referral_bonus: 'Referral Bonus',
    call_charge: 'Call with Astrologer'
};

const TransactionItem = ({ transaction }) => {
    const isSent = transaction.type === 'sent';
    return (
        <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 hover:bg-gray-50 transition-colors border-b border-black/15">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${isSent ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center flex-shrink-0`}>
                <svg className={`w-4 h-4 md:w-5 md:h-5 ${isSent ? 'text-red-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSent ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs text-gray-500">{isSent ? 'Sent' : 'Received'}</p>
                <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{transaction.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-xs md:text-sm font-semibold text-gray-800">₹{transaction.amount.toFixed(2)}</p>
                <p className="text-[10px] md:text-xs text-gray-500 truncate max-w-[100px] md:max-w-none">{transaction.date}</p>
            </div>
        </div>
    );
};

const Wallet = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { requiredAmount = 0 } = state || {};

    const [currentBalance, setCurrentBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const [balanceRes, transactionsRes] = await Promise.all([
                    getWalletBalance(),
                    getWalletTransactions()
                ]);

                if (balanceRes?.success) {
                    setCurrentBalance(balanceRes.data.balance || 0);
                }

                if (transactionsRes?.success && transactionsRes.data?.transactions) {
                    setTransactions(transactionsRes.data.transactions.map(txn => ({
                        id: txn._id,
                        type: ['deposit', 'referral_bonus'].includes(txn.type) ? 'received' : 'sent',
                        description: TRANSACTION_LABELS[txn.type] || txn.type,
                        amount: txn.amount,
                        date: new Date(txn.transactionDate).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    })));
                }
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWalletData();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f1e8] flex justify-center items-start pt-20 md:pt-10 pb-4 md:pb-10 px-2 md:px-4">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow p-2 md:p-4 border">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-3 sm:gap-0">
                    <h1 className="text-lg md:text-xl font-bold text-gray-700">My Wallet</h1>
                    {/* <button
                        onClick={() => navigate(-1)}
                        className="px-6 md:px-10 py-2 bg-button-vertical-gradient-orange text-white rounded-md text-sm font-semibold shadow w-full sm:w-auto"
                    >
                        Add Balance
                    </button> */}
                </div>

                {/* Wallet Card and Transaction History */}
                <div className="w-full flex flex-col lg:flex-row justify-start gap-4 items-stretch px-2 md:px-4 lg:px-8">
                    {/* Left Column - Wallet Card and Empty Card */}
                    <div className="w-full lg:w-[520px] flex flex-col gap-4 flex-shrink-0 self-stretch">
                        {/* Wallet Card */}
                        <WalletCard
                            currentBalance={currentBalance}
                            requiredAmount={requiredAmount}
                        />

                        {/* Empty Card */}
                        <div className="h-[160px] md:h-[180px] bg-gradient-to-b from-[#FFF5E6] to-[#FFE8F0] rounded-xl border border-black/15 relative p-3 md:p-4 hidden lg:block">
                            <h3 className="font-semibold text-gray-800 text-lg md:text-xl">Download Our Mobile App</h3>
                            <p className="text-xs md:text-sm text-gray-500 max-w-xs mt-2">For a same less experience, download our apps on your phone</p>
                            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="w-32 md:w-40 mt-2" />
                            <img src={phoneImg} alt="phone" className="absolute bottom-0 right-4 md:right-6 h-[7.5rem] md:h-[8.5rem]" />
                        </div>
                    </div>

                    {/* Transaction History Card */}
                    <div className="flex-1 bg-white rounded-xl shadow-md border border-black/15 flex flex-col min-h-[400px] lg:min-h-0">
                        <h2 className="text-sm md:text-md text-gray-800 bg-slate-100 p-2 md:p-3 rounded-t-xl border-b border-black/15 flex-shrink-0">Transaction History</h2>

                        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full px-2 md:px-3 pb-3 pt-3 min-h-0">
                            {loading || transactions.length === 0 ? (
                                <div className="flex justify-center items-center h-32">
                                    <p className="text-gray-500 text-sm">{loading ? 'Loading...' : 'No transactions found'}</p>
                                </div>
                            ) : transactions.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;