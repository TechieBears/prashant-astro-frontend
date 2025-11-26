import { useEffect, useRef, useState } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { getZoomSignature } from '../../api/index';

const ZoomSDKEmbed = ({ meetingNumber, password, userName }) => {
    const [loading, setLoading] = useState(true);
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
                console.log('Getting signature for meeting:', meetingNumber);
                const signatureResponse = await getZoomSignature(meetingNumber, 0);
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
        <div className="w-full h-full">
            {loading && (
                <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Zoom meeting...</p>
                    </div>
                </div>
            )}
            {error && (
                <div className="flex items-center justify-center h-full bg-gray-100">
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
            <div ref={meetingSDKElement} className="w-full h-full" style={{ display: loading || error ? 'none' : 'block' }}></div>
        </div>
    );
};

export default ZoomSDKEmbed;