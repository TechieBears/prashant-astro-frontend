import { FaClock, FaCalendarAlt, FaPhone } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCallsHistory } from '../../../api';

const CallHistory = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCallHistory, setSelectedCallHistory] = useState(null);
    const [callHistoryData, setCallHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCallHistory();
    }, []);

    const fetchCallHistory = async () => {
        try {
            const response = await getAllCallsHistory();

            if (response.success) {
                const transformedData = response.data.map((item) => {
                    const profile = item.astrologerId?.profile || {};
                    const skills = Array.isArray(profile.skills) ? profile.skills.join(', ') : 'Vedic, Astrology';
                    const languages = Array.isArray(profile.languages) ? profile.languages.join(', ') : 'English, Hindi';

                    return {
                        id: item._id,
                        astrologerId: item.astrologerId?._id,
                        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Astrologer',
                        image: item.astrologerId?.profileImage || 'https://via.placeholder.com/80',
                        specialties: skills,
                        languages: languages,
                        experience: `Exp: ${profile.experience || 5} Years`,
                        date: new Date(item.date).toLocaleDateString('en-GB'),
                        status: item.status,
                        duration: item.duration,
                        amountCharged: item.amountCharged,
                        buttonText: item.status === 'accepted' ? 'Call Again' : 'Requested',
                        buttonStyle: item.status === 'accepted' ? 'orange' : 'blue'
                    };
                });
                setCallHistoryData(transformedData);
            }
        } catch (error) {
            console.error('Error fetching call history:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    <div className="text-xs flex items-center gap-1">
                        <span className="text-gray-700 whitespace-nowrap">Date: {call.date}</span>
                        {/* <span className={`${call.status === 'accepted' ? 'text-green-500' : call.status === 'rejected' ? 'text-red-500' : 'text-blue-500'}`}>
                            {call.status === 'accepted' ? `${call.duration} min call done` : call.status}
                        </span> */}
                    </div>
                    {call.amountCharged && (
                        <div className="text-xs text-gray-600">
                            Amount: ₹{call.amountCharged.toFixed(2)}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => navigate(`/astrologer/${call.astrologerId}`)}
                        className={`px-4 py-1.5 rounded-lg font-medium text-xs text-white transition-all ${call.buttonStyle === 'blue'
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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600">Loading...</div>
                    </div>
                ) : callHistoryData.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600">No call history found</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {callHistoryData.map((call) => (
                            <CallCard key={call.id} call={call} />
                        ))}
                    </div>
                )}
            </div>


        </>
    );
};

export default CallHistory;