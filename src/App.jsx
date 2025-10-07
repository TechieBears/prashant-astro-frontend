import "./App.css";
import { Provider } from 'react-redux';
import store from "./redux/store";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
let persistor = persistStore(store);
import { PrimeReactProvider } from 'primereact/api';
import ProjectRoutes from "./routes/ProjectRoutes";
import { Toaster } from 'react-hot-toast';
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
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import ComingSoonModal from './components/Modals/ComingSoonModal';
import { getHomeModalStatus } from './api';

const App = () => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    const [homeModalStatus, setHomeModalStatus] = useState(false);

    useEffect(() => {
        async function initializeNotifications() {
            const support = checkNotificationSupport();
            if (support.isSupported && support.hasServiceWorker && support.hasMessaging && support.permission === 'granted') {
                initializePushNotifications();
            }

            const fcmToken = await requestNotificationPermission();
            if (fcmToken) {
                console.log("⚡️🤯 ~ App.jsx ~ useEffect ~ fcmToken:", fcmToken)
            } else {
                console.log('Failed to enable push notifications');
            }
        }

        initializeNotifications();
    }, []);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant',
        });
    }, [pathname]);

    useEffect(() => {
        const fetchHomeModalStatus = async () => {
            const response = await getHomeModalStatus();
            if (response.success) {
                setHomeModalStatus(response?.data?.data?.coming_soon ? true : false);
            }
        };
        fetchHomeModalStatus();
    }, []);

    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <PrimeReactProvider>
                        <div className={homeModalStatus ? 'blur-sm pointer-events-none' : ''}>
                            <ProjectRoutes />
                        </div>
                        <Toaster
                            position="top-right"
                            reverseOrder={false}
                            gutter={8}
                            containerClassName=""
                            containerStyle={{}}
                            toastOptions={{
                                // Default options for all toasts
                                duration: 3000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                                // Default options for specific types
                                success: {
                                    duration: 2000,
                                    style: {
                                        background: '#10B981',
                                        color: '#fff',
                                    },
                                },
                                error: {
                                    duration: 4000,
                                    style: {
                                        background: '#EF4444',
                                        color: '#fff',
                                    },
                                },
                            }}
                        />
                        <ComingSoonModal isVisible={homeModalStatus} />
                    </PrimeReactProvider>
                </PersistGate>
            </Provider>
        </>
    )
}

export default App;
