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

const App = () => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    useEffect(async () => {
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
    }, []);
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <PrimeReactProvider>
                        <ProjectRoutes />
                    </PrimeReactProvider>
                </PersistGate>
            </Provider>
        </>
    )
}

export default App;
