importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyD75yuin8lFEkJ74D-L_I6zUlWy3jjWCzY",
    authDomain: "astroguid-1.firebaseapp.com",
    projectId: "astroguid-1",
    storageBucket: "astroguid-1.firebasestorage.app",
    messagingSenderId: "765854749850",
    appId: "1:765854749850:web:7533627e7c0530246dfb23",
    measurementId: "G-CR95Q3HXZR"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification';
    const notificationBody = payload.notification?.body || payload.data?.body || 'You have a new message';

    const notificationOptions = {
        body: notificationBody,
        icon: payload.notification?.icon || payload.data?.icon || '/favicon.ico',
        badge: '/favicon.ico',
        image: payload.notification?.image || payload.data?.image,
        data: payload.data || {},
        tag: payload.data?.tag || 'default',
        requireInteraction: false, // Changed to false for better UX
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: '/favicon.ico'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/favicon.ico'
            }
        ],
        // Add more notification options for better visibility
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
        silent: false
    };

    // Show the notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.');

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    // Handle the notification click
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window/tab open with the target URL
            const urlToOpen = event.notification.data?.url || '/';

            for (const client of clientList) {
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }

            // If no existing window, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Service worker activated.');
    event.waitUntil(self.clients.claim());
});

// Handle service worker installation
self.addEventListener('install', (event) => {
    console.log('[firebase-messaging-sw.js] Service worker installed.');
    self.skipWaiting();
});
