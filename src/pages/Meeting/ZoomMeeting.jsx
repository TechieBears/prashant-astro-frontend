import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { parseZoomUrl } from '../../utils/zoomUtils';
import ZoomSDKEmbed from '../../components/ZoomMeeting/ZoomSDKEmbed';

const ZoomMeeting = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { roleIs } = useSelector((state) => state.user);
    const [meetingData, setMeetingData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const zoomUrl = searchParams.get('zoomUrl');
        const meetingId = searchParams.get('meetingId');
        const password = searchParams.get('password');
        const userName = searchParams.get('userName') || 'Guest';

        if (zoomUrl) {
            // Parse Zoom URL for SDK
            const parsed = parseZoomUrl(zoomUrl);
            if (parsed.isValid) {
                setMeetingData(parsed);
            } else {
                setError('Invalid Zoom meeting URL');
            }
        } else if (meetingId && password) {
            // Direct parameters
            setMeetingData({
                meetingId,
                password,
                userName,
                isValid: true
            });
        } else {
            setError('Missing meeting parameters');
        }
    }, [searchParams]);

    const handleMeetingEnd = () => {
        const role = roleIs || localStorage.getItem('role');

        if (role === 'admin') {
            navigate('/service-bookings');
        } else if (role === 'employee') {
            navigate('/service-bookings');
        } else {
            navigate('/profile/orders');
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!meetingData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-8" style={{ overflow: 'visible' }}>
            <ZoomSDKEmbed
                key={meetingData.meetingId}
                meetingNumber={meetingData.meetingId}
                password={meetingData.password}
                userName={meetingData.userName}
                onMeetingEnd={handleMeetingEnd}
            />
        </div>
    );
};

export default ZoomMeeting;