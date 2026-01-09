import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { getZoomSignature } from '../../api/index';
import './ZoomSDKEmbed.css';

const ZoomSDKEmbed = ({ meetingNumber, password, userName, onMeetingEnd }) => {
    const { roleIs } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [leaving, setLeaving] = useState(false);
    const [error, setError] = useState(null);
    const meetingSDKElement = useRef(null);
    const clientRef = useRef(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        const initZoom = async () => {
            // Small delay to ensure DOM is ready
            await new Promise(resolve => setTimeout(resolve, 100));

            if (!mounted || !meetingSDKElement.current || !meetingNumber || !password) return;

            // Cleanup any existing client
            if (clientRef.current) {
                try {
                    await clientRef.current.leaveMeeting();
                    clientRef.current = null;
                } catch (e) {
                    console.log('Previous client cleanup:', e);
                }
            }

            try {
                const role = localStorage.getItem('role') || roleIs;
                const zoomRole = (role === 'admin' || role === 'employee') ? 1 : 0;

                console.log('Getting signature for meeting:', meetingNumber, 'with role:', zoomRole);
                const signatureResponse = await getZoomSignature(meetingNumber, zoomRole);
                console.log('Signature response:', signatureResponse);

                if (!mounted) return;

                if (signatureResponse.success === false) {
                    throw new Error(signatureResponse.message || 'Failed to get signature');
                }

                const { signature, sdkKey } = signatureResponse;

                if (!signature || !sdkKey) {
                    throw new Error('Missing signature or SDK key');
                }

                console.log('Initializing Zoom with signature:', signature.substring(0, 20) + '...');

                const client = ZoomMtgEmbedded.createClient();
                clientRef.current = client;

                await client.init({
                    zoomAppRoot: meetingSDKElement.current,
                    language: 'en-US',
                    patchJsMedia: true,
                    leaveOnPageUnload: true
                });

                if (!mounted) return;

                await client.join({
                    signature,
                    meetingNumber: meetingNumber.toString(),
                    password: password,
                    userName: userName || 'Guest'
                });

                console.log('Joined meeting successfully');
                if (mounted) setLoading(false);

                // Listen for all meeting end events
                const handleMeetingEnd = () => {
                    console.log('Meeting ended - redirecting');
                    setLeaving(true);
                    setTimeout(() => {
                        if (onMeetingEnd) onMeetingEnd();
                    }, 1500);
                };

                client.on('meeting-ended', handleMeetingEnd);
                client.on('connection-change', (payload) => {
                    console.log('Connection change:', payload);
                    if (payload.state === 'Closed') handleMeetingEnd();
                });
            } catch (err) {
                console.error('Error initializing Zoom:', err);
                if (mounted) {
                    setError(`Failed to load meeting: ${err.message || JSON.stringify(err)}`);
                    setLoading(false);
                }
            }
        };

        initZoom();

        return () => {
            mounted = false;
            if (clientRef.current) {
                try {
                    clientRef.current.leaveMeeting();
                    clientRef.current = null;
                } catch (e) {
                    console.log('Cleanup error:', e);
                }
            }
        };
    }, [meetingNumber, password, userName]);

    return (
        <div className="w-full h-screen relative">
            {leaving && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Meeting ended. Redirecting...</p>
                    </div>
                </div>
            )}
            {loading && !leaving && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Zoom meeting...</p>
                    </div>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}
            <div
                ref={meetingSDKElement}
                className="zoom-meeting-container"
                style={{ display: loading || error || leaving ? 'none' : 'block' }}
            ></div>
        </div>
    );
};

export default ZoomSDKEmbed;