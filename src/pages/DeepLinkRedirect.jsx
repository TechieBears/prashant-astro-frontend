import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const APP_SCHEME = 'hamax://';
const ANDROID_INTENT_PREFIX = 'intent://';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.hamax';
const APP_STORE_URL = 'https://apps.apple.com/app/id0000000000';

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

const openWithIntentOnAndroid = (path) => {
    const intentUrl = `${ANDROID_INTENT_PREFIX}${path.replace(/^\//, '')}#Intent;scheme=hamax;package=com.hamax;S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
    window.location.href = intentUrl;
};

const tryOpenAppOrStore = (entityType, entityId) => {
    const appDeepLink = `${APP_SCHEME}${entityType}/${entityId}`;

    if (isAndroid()) {
        openWithIntentOnAndroid(`/${entityType}/${entityId}`);
        return;
    }

    if (isIOS()) {
        const now = Date.now();
        window.location.href = appDeepLink;

        setTimeout(() => {
            if (Date.now() - now < 1500) {
                window.location.href = APP_STORE_URL;
            }
        }, 5000);
        return;
    }

    window.location.href = PLAY_STORE_URL;
};

const DeepLinkRedirect = () => {
    const { id } = useParams();
    const location = useLocation();
    const pathFirstSegment = location.pathname.split('/').filter(Boolean)[0] || 'actor';
    const [countdown, setCountdown] = useState(3);
    const userAgent = navigator.userAgent || '';
    const fallbackIOS = APP_STORE_URL;
    const fallbackAndroid = PLAY_STORE_URL;

    useEffect(() => {
        if (!id) return;
        const allowed = ['actor', 'casting'];
        const entityType = allowed.includes(pathFirstSegment) ? pathFirstSegment : 'actor';
        tryOpenAppOrStore(entityType, id);
    }, [id, pathFirstSegment]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-orange-500 to-red-500 text-white px-4">
            <div className="text-center animate-fade-in-up">
                {/* App Icon or Logo */}
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                    <span className="text-3xl font-bold text-white">🎾</span>
                </div>

                <h1 className="text-2xl font-semibold mb-2">Launching Pi Play...</h1>
                <p className="text-sm text-white/80 mb-6">Please wait while we redirect you to the app</p>

                {/* Countdown Number */}
                <div className="text-5xl font-extrabold animate-pulse mb-4">{countdown}</div>

                {/* Spinner */}
                <div className="flex justify-center items-center">
                    <svg
                        className="animate-spin h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        ></path>
                    </svg>
                </div>

                {/* Manual Fallback */}
                <div className="mt-8 text-sm text-white/80">
                    Not working?
                    <br />
                    <a
                        href={
                            userAgent.includes('iPhone') || userAgent.includes('Macintosh')
                                ? fallbackIOS
                                : fallbackAndroid
                        }
                        className="underline text-white font-medium"
                    >
                        Tap here to open in app store
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DeepLinkRedirect;
