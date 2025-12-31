import { useState } from 'react';
import toast from 'react-hot-toast';
import { addWalletBalance } from '../../api';
import { openRazorpay } from '../../utils/paymentGetway';
import shadowImg from '../../assets/Wallet/shadow.png';
import moneyBagImg from '../../assets/Wallet/OBJECTS.png';

const WalletCard = ({ currentBalance, requiredAmount = 0, onDeposit }) => {
    const [depositAmount, setDepositAmount] = useState(Math.max(requiredAmount || 50, 50));

    const quickAmounts = ["+50", "+100", "+200", "+500", "+1000", "+1500"];

    const handleQuickAmount = (amount) => {
        setDepositAmount(parseInt(amount.replace('+', '')));
    };

    const handleDepositMoney = async () => {
        try {
            const result = await addWalletBalance(depositAmount, 'RAZORPAY');
            if (result?.success && result?.data?.paymentOrder) {
                const razorpayData = {
                    razorpay: {
                        orderId: result.data.paymentOrder.orderId,
                        amount: result.data.paymentOrder.amount,
                        currency: result.data.paymentOrder.currency
                    }
                };
                openRazorpay(
                    razorpayData,
                    () => {
                        toast.success('Balance added successfully!');
                        if (onDeposit) onDeposit(depositAmount);
                        window.location.reload();
                    },
                    (error) => toast.error(error || 'Payment failed')
                );
            } else {
                toast.error(result?.message || 'Failed to initiate payment');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="bg-button-vertical-gradient-orange rounded-xl p-4 md:p-6 shadow-md text-white relative overflow-hidden">
            {/* Shadow Image */}
            <img
                src={shadowImg}
                alt="shadow"
                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50"
            />

            <div className="flex items-end relative z-10 mb-2">
                <div className={`font-extrabold leading-none ${currentBalance.toString().length <= 2 ? 'text-[60px] sm:text-[80px] md:text-[100px]' :
                    currentBalance.toString().length <= 3 ? 'text-[50px] sm:text-[65px] md:text-[80px]' :
                        currentBalance.toString().length <= 4 ? 'text-[40px] sm:text-[50px] md:text-[60px]' : 'text-[35px] sm:text-[40px] md:text-[50px]'
                    }`}>₹{Number(currentBalance).toFixed(2).replace(/\.00$/, '')}</div>
                <div className="text-[10px] sm:text-xs pb-1 md:pb-2 ml-1">Total Balance</div>
            </div>

            {/* Money Bag Image */}
            <img
                src={moneyBagImg}
                alt="money"
                className="w-16 sm:w-20 md:w-24 absolute right-4 sm:right-8 md:right-14 top-12 sm:top-16 md:top-8 z-20"
            />

            {/* Inner Card */}
            <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 mt-2 text-gray-700 shadow-sm relative z-10">
                <label className="text-xs sm:text-sm font-medium">Enter Amount</label>
                <div className="mt-2">
                    <input
                        type="text"
                        value={`₹ ${depositAmount}`}
                        readOnly
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 cursor-default"
                    />
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                    {quickAmounts.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => handleQuickAmount(amt)}
                            className="py-1.5 sm:flex-1 border rounded-md text-[10px] sm:text-xs font-medium hover:bg-gray-100 transition-colors"
                        >
                            {amt}
                        </button>
                    ))}
                </div>

                <p className="text-[10px] sm:text-[11px] text-center text-gray-500 mt-2 sm:mt-3">
                    Enter Amount or Add money to set Deposit Amount
                </p>

                <div className="flex justify-center mt-3 sm:mt-4">
                    <button
                        onClick={handleDepositMoney}
                        className="w-full sm:w-auto px-6 py-2 bg-button-vertical-gradient-orange text-white rounded-md text-sm font-semibold shadow hover:opacity-90 transition-opacity"
                    >
                        Deposit Money
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
