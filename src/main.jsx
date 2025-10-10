import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-calendar/dist/Calendar.css';
import { BrowserRouter } from 'react-router-dom'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
)
