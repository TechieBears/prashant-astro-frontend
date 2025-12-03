import { X } from 'lucide-react';

const TalkSessionModal = ({ isOpen, onClose, callTime = 15, astrologerName }) => {
    if (!isOpen) return null;

    const charges = callTime * 10;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />
            <div className="fixed bottom-4 right-4 z-50 w-[380px] animate-in slide-in-from-bottom-5">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            ✨ AstroGuid Talk Session
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Connect with Trusted Astrologers — Anytime, Anywhere
                        </p>
                    </div>

                    <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-gray-800 text-sm">
                            <span>⏱️</span>
                            <span className="font-semibold">Session Duration: {callTime} Minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-800 text-sm">
                            <span>💰</span>
                            <span className="font-semibold">Charges: ₹{charges} (₹10 per minute)</span>
                        </div>
                    </div>

                    <div className="mb-4 space-y-0.5 text-xs text-gray-500">
                        <p>Your wallet will be debited automatically once the session starts.</p>
                        <p>No hidden fees — pay only for the time you talk.</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            🔮 How it works:
                        </h3>
                        <ul className="space-y-1.5 text-gray-700 text-xs">
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>Choose your preferred astrologer.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>Start your {callTime}-minute call instantly.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span>Extend your session anytime at ₹10 per minute.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2.5 mb-4 border border-amber-100">
                        <p className="text-xs text-amber-800 flex items-start gap-2">
                            <span className="text-sm">💡</span>
                            <span><span className="font-medium">Tip:</span> Make sure your wallet has enough balance before starting to avoid interruptions.</span>
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 text-center">✨ AstroGuid — Guiding your path, one insight at a time.</p>
                </div>
            </div>
        </>
    );
};

export default TalkSessionModal;
