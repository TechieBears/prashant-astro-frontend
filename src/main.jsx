import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-calendar/dist/Calendar.css';
import { BrowserRouter } from 'react-router-dom'

if ('serviceWorker' in navigator) {
    // Register service worker as early as possible
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope);
            // Ensure service worker is activated
            if (registration.installing) {
                registration.installing.addEventListener('statechange', function() {
                    if (this.state === 'activated') {
                        console.log('Service Worker activated');
                    }
                });
            }
        })
        .catch((registrationError) => {
            console.error('SW registration failed: ', registrationError);
        });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
)
