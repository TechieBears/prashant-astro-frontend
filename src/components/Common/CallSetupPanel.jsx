import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import CallButton from './CallButton';

const CallSetupPanel = ({
    phoneNumber,
    setPhoneNumber,
    callTime,
    setCallTime,
    astrologer,
    userBalance,
    onCallRequired,
    onRecharge
}) => {
    const [phoneError, setPhoneError] = useState('');

    const incrementTime = (amount) => {
        setCallTime((prev) => Math.max(1, prev + amount));
    };

    const decrementTime = () => {
        setCallTime((prev) => Math.max(1, prev - 1));
    };

    const validatePhone = (value) => {
        if (!value || value.trim() === '') {
            setPhoneError('Phone number is required');
            return false;
        }
        const phoneRegex = /^[+]?[0-9]{10,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            setPhoneError('Please enter a valid phone number (10-15 digits)');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        if (value) validatePhone(value);
        else setPhoneError('');
    };

    const handleCallClick = () => {
        if (!validatePhone(phoneNumber)) {
            return;
        }
        onCallRequired();
    };

    const pricePerMin = astrologer?.pricePerMin || 10;
    const totalAmount = callTime * pricePerMin;
    const hasInsufficientBalance = userBalance < totalAmount;

    return (
        <div className="lg:col-span-1">
            <div className="w-full max-w-[305px] mx-auto">
                <div className="bg-white rounded-[15px] border border-black/15 p-4 pb-[22px] shadow-sm">
                    <div className="flex flex-col gap-[14px]">
                        {/* Phone Number Section */}
                        <div className="flex flex-col gap-[4px]">
                            <label
                                htmlFor="phone"
                                className="text-slate-700 font-poppins text-base font-medium"
                            >
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                onBlur={() => phoneNumber && validatePhone(phoneNumber)}
                                placeholder="Enter phone number"
                                className={`h-10 px-5 rounded-[5px] border bg-white text-sm font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                    phoneError ? 'border-red-500 focus:ring-red-300' : 'border-black/15 focus:ring-slate-300'
                                }`}
                            />
                            {phoneError && (
                                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                            )}
                        </div>

                        {/* Maximum Call Time Section */}
                        <div className="flex flex-col gap-[4px]">
                            <div className="flex items-center justify-between">
                                <label className="text-slate-700 font-poppins text-base font-medium">
                                    Maximum Call Time
                                </label>
                                <button
                                    onClick={() => setCallTime(1)}
                                    className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                                    aria-label="Reset time"
                                    title="Reset to 1 min"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="h-10 px-5 rounded-[5px] border border-black/15 bg-white flex items-center justify-between">
                                <button
                                    onClick={decrementTime}
                                    className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                                    aria-label="Decrease time"
                                >
                                    <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                                </button>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#1D293D] font-poppins text-sm font-medium">
                                        {callTime}
                                    </span>
                                    <span className="text-slate-500 font-poppins text-sm font-medium">
                                        Min
                                    </span>
                                </div>
                                <button
                                    onClick={() => incrementTime(1)}
                                    className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                                    aria-label="Increase time"
                                >
                                    <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Time Increment Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => incrementTime(5)}
                                className="flex-1 py-2.5 px-2 rounded-lg border border-black/15 bg-slate-50 text-slate-500 font-poppins text-sm font-medium text-center hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 whitespace-nowrap"
                            >
                                +5 Min
                            </button>
                            <button
                                onClick={() => incrementTime(10)}
                                className="flex-1 py-2.5 px-2 rounded-lg border border-black/15 bg-slate-50 text-slate-500 font-poppins text-sm font-medium text-center hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 whitespace-nowrap"
                            >
                                +10 Min
                            </button>
                            <button
                                onClick={() => incrementTime(20)}
                                className="flex-1 py-2.5 px-2 rounded-lg border border-black/15 bg-slate-50 text-slate-500 font-poppins text-sm font-medium text-center hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 whitespace-nowrap"
                            >
                                +20 Min
                            </button>
                        </div>

                        {/* Balance and Price Display */}
                        <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600">Rate</span>
                                <span className="text-xs font-semibold text-slate-900">₹{pricePerMin}/min</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600">Wallet</span>
                                <span className={`text-xs font-semibold ${hasInsufficientBalance ? 'text-red-500' : 'text-green-600'}`}>₹{userBalance}</span>
                            </div>
                            <div className="border-t border-black/10 pt-1 flex justify-between items-center">
                                <span className="text-xs font-medium text-slate-700">Total</span>
                                <span className={`text-sm font-bold ${hasInsufficientBalance ? 'text-red-600' : 'text-green-600'}`}>₹{totalAmount}</span>
                            </div>
                            {hasInsufficientBalance && (
                                <p className="text-red-500 text-[10px] font-medium text-center">
                                    Insufficient balance
                                </p>
                            )}
                        </div>

                        {/* Call Required Button */}
                        <CallButton
                            status={hasInsufficientBalance ? 'Busy' : 'Online'}
                            onClick={hasInsufficientBalance ? onRecharge : handleCallClick}
                            allowClickWhenBusy={true}
                            className="py-[9px] font-poppins text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            {hasInsufficientBalance ? 'Recharge' : 'Call Required'}
                        </CallButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallSetupPanel;
