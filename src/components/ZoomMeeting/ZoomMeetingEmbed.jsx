import { useEffect, useState } from 'react';

const ZoomMeetingEmbed = ({ meetingId, password, userName, webClientUrl }) => {
    const [zoomUrl, setZoomUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (webClientUrl) {
            setZoomUrl(webClientUrl);
            setLoading(false);
        } else if (meetingId && password) {
            const url = `https://us06web.zoom.us/wc/join/${meetingId}?pwd=${password}&uname=${encodeURIComponent(userName || 'Guest')}`;
            setZoomUrl(url);
            setLoading(false);
        }
        
        // Auto-copy passcode when component loads
        if (password) {
            navigator.clipboard.writeText(password).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            }).catch(() => {});
        }
    }, [meetingId, password, userName, webClientUrl]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading meeting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col">
            {password && (
                <div className="bg-blue-50 p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Meeting Passcode:</p>
                            <p className="font-mono text-lg font-semibold text-blue-600">{password}</p>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(password);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                copied 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
            <iframe
                src={zoomUrl}
                className="w-full flex-1 border-0"
                allow="camera; microphone; fullscreen; speaker; display-capture; autoplay; clipboard-read; clipboard-write"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zoom Meeting"
            />
        </div>
    );
};

export default ZoomMeetingEmbed;