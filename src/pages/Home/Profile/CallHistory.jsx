import { FaClock, FaCalendarAlt, FaPhone } from 'react-icons/fa';
import { useState } from 'react';
import astrologer1 from '../../../assets/Astrologer/panditcall1.jpg';
import astrologer2 from '../../../assets/Astrologer/panditcall2.jpg';
import astrologer3 from '../../../assets/Astrologer/panditcall3.jpg';

const CallHistory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCallHistory, setSelectedCallHistory] = useState(null);
    const callHistoryData = [
        {
            id: 1,
            name: "Kalidas",
            image: astrologer1,
            specialties: "Vedic, Nadi, Vastu, Prashana, Life Coach",
            languages: "English, Tamil",
            experience: "Exp: 10 Years",
            calls: [
                { date: "08/10/2025-", status: "request", label: "Request" },
                { date: "05/10/2025-", status: "completed", label: "10 min call done" },
                { date: "02/10/2025-", status: "rejected", label: "Call Reject" }
            ],
            buttonText: "Requested",
            buttonStyle: "blue"
        },
        {
            id: 2,
            name: "Kalidas",
            image: astrologer2,
            specialties: "Vedic, Nadi, Vastu, Prashana, Life Coach",
            languages: "English, Tamil",
            experience: "Exp: 10 Years",
            calls: [
                { date: "03/10/2025-", status: "completed", label: "8 min call done" },
                { date: "02/10/2025-", status: "completed", label: "20 min call done" },
                { date: "12/10/2025-", status: "rejected", label: "Call Reject" }
            ],
            buttonText: "Call Again",
            buttonStyle: "orange"
        },
        {
            id: 3,
            name: "Kalidas",
            image: astrologer3,
            specialties: "Vedic, Nadi, Vastu, Prashana, Life Coach",
            languages: "English, Tamil",
            experience: "Exp: 10 Years",
            calls: [
                { date: "19/10/2025-", status: "completed", label: "5 min call done" },
                { date: "24/10/2025-", status: "completed", label: "12 min call done" },
                { date: "25/10/2025-", status: "rejected", label: "Call Reject" }
            ],
            buttonText: "Call Again",
            buttonStyle: "orange"
        },
        {
            id: 4,
            name: "Kalidas",
            image: astrologer1,
            specialties: "Vedic, Nadi, Vastu, Prashana, Life Coach",
            languages: "English, Tamil",
            experience: "Exp: 10 Years",
            calls: [
                { date: "14/10/2025-", status: "completed", label: "2 min call done" },
                { date: "20/10/2025-", status: "completed", label: "7 min call done" },
                { date: "22/10/2025-", status: "rejected", label: "Call Reject" }
            ],
            buttonText: "Call Again",
            buttonStyle: "orange"
        }
    ];

    const CallCard = ({ call }) => (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex gap-3 mb-3">
                <div className="w-20 h-20 rounded-full bg-button-vertical-gradient-orange flex-shrink-0 p-[2px]">
                    <img src={call.image} alt={call.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>{call.name}</h3>
                    <p className="text-xs text-gray-600 mb-0.5 leading-tight">{call.specialties}</p>
                    <p className="text-xs text-gray-600 mb-0.5 leading-tight">{call.languages}</p>
                    <p className="text-xs text-gray-600 leading-tight">{call.experience}</p>
                </div>
            </div>

            <div className="flex items-end justify-between gap-3">
                <div className="flex-1 space-y-1">
                    {call.calls.map((callItem, index) => (
                        <div key={index} className="text-xs flex items-center gap-1">
                            <span className="text-gray-700 whitespace-nowrap">{callItem.date}</span>
                            <span className={`${callItem.status === 'request' ? 'text-blue-500' :
                                callItem.status === 'completed' ? 'text-green-500' :
                                    'text-red-500'
                                }`}>
                                {callItem.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {call.buttonText === 'Requested' && (
                        <button 
                            onClick={() => {
                                setSelectedCallHistory(call.calls);
                                setIsModalOpen(true);
                            }}
                            className="text-gray-500 text-xs hover:text-gray-700"
                        >
                            View More
                        </button>
                    )}
                    <button className={`px-4 py-1.5 rounded-lg font-medium text-xs text-white transition-all ${call.buttonStyle === 'blue'
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-button-vertical-gradient-orange hover:opacity-90'
                        }`}>
                        {call.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Call History</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {callHistoryData.map((call) => (
                        <CallCard key={call.id} call={call} />
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-gray-50 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 px-6 pt-4 bg-white rounded-t-2xl">Call History</h2>
                        <div className="border-t border-gray-300 mb-4"></div>
                        <div className="px-6 pb-6">
                            <div className="bg-white rounded-xl p-4 space-y-2 border border-gray-300">
                                {selectedCallHistory?.map((callItem, index) => (
                                    <div key={index} className="text-sm">
                                        <span className="text-gray-700">{callItem.date} </span>
                                        <span className={`font-medium ${callItem.status === 'request' ? 'text-blue-500' :
                                            callItem.status === 'completed' ? 'text-green-500' :
                                                'text-red-500'
                                            }`}>
                                            {callItem.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CallHistory;