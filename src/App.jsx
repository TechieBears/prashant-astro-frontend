import "./App.css";
import { Provider } from 'react-redux';
import store from "./redux/store";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
let persistor = persistStore(store);
import { PrimeReactProvider } from 'primereact/api';
import ProjectRoutes from "./routes/ProjectRoutes";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import gsap from 'gsap';
import { SplitText, ScrollTrigger } from 'gsap/all';
import {
    checkNotificationSupport,
    initializePushNotifications,
    requestNotificationPermission,
} from './utils/pushNotifications';
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
// import ComingSoonModal from "./components/Modals/ComingSoonModal";

const App = () => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    useEffect(() => {
        const initNotifications = async () => {
            // Wait a bit to ensure service worker is registered
            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.ready;
                } catch (error) {
                    console.warn('Service worker not ready yet:', error);
                }
            }

            const support = checkNotificationSupport();

            // If permission is already granted, initialize notifications
            if (support.permission === 'granted' && support.hasServiceWorker && support.hasMessaging) {
                const initialized = await initializePushNotifications();
                if (initialized) {
                    console.log('Push notifications initialized');
                }
            }
            // Otherwise, request permission (this handles the 'default' case)
            else if (support.permission === 'default' && support.hasServiceWorker && support.hasMessaging) {
                const fcmToken = await requestNotificationPermission();
                if (fcmToken) {
                    console.log("⚡️🤯 ~ App.jsx ~ useEffect ~ fcmToken:", fcmToken);
                    await initializePushNotifications();
                } else {
                    console.log('Failed to enable push notifications - permission denied or dismissed');
                }
            }
        };

        initNotifications();
    }, []);
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {/* <ComingSoonModal isVisible={true} /> */}
                    <PrimeReactProvider>
                        <Toaster position="top-right" />
                        <ProjectRoutes />
                    </PrimeReactProvider>
                </PersistGate>

            </Provider>
        </>
    )
}

export default App;
