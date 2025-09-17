import { messaging, getToken, onMessage } from './firebase/firebase.js';

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY_API_KEY;

// Global variable to track if listener is already set up
let isListenerSetup = false;
let currentMessageCallback = null;

export const requestNotificationPermission = async () => {
    try {
        // Check if the browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return null;
        }

        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            console.log('This browser does not support service workers');
            return null;
        }

        // Check if messaging is available
        if (!messaging) {
            console.log('Firebase messaging is not available');
            return null;
        }

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('Notification permission granted');

            // Get FCM token
            const token = await getFCMToken();
            return token;
        } else if (permission === 'denied') {
            console.log('Notification permission denied');
            return null;
        } else {
            console.log('Notification permission dismissed');
            return null;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return null;
    }
};

export const getFCMToken = async () => {
    try {
        if (!messaging) {
            console.log('Firebase messaging is not available');
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY
        });

        if (token) {
            console.log('FCM Token:', token);
            localStorage.setItem('fcmToken', token);
            return token;
        } else {
            console.log('No registration token available');
            return null;
        }
    } catch (error) {
        console.error('An error occurred while retrieving token:', error);
        return null;
    }
};

export const listenToForegroundMessages = (callback) => {
    if (!messaging) {
        console.log('Firebase messaging is not available');
        return;
    }

    // Only set up listener once
    if (!isListenerSetup) {
        isListenerSetup = true;
        currentMessageCallback = callback;

        onMessage(messaging, (payload) => {
            console.log('Message received in foreground:', payload);

            // Show custom notification in the app
            if (payload.notification) {
                const { title, body, icon, image } = payload.notification;

                // Create custom notification
                const notificationData = {
                    title: title || 'New Notification',
                    body: body || 'You have a new message',
                    icon: icon || '/favicon.ico',
                    image: image,
                    data: payload.data
                };

                // Call the callback with notification data
                if (currentMessageCallback && typeof currentMessageCallback === 'function') {
                    currentMessageCallback(notificationData);
                }

                // Show toast notification only once
                toast.success(notificationData.title, {
                    description: notificationData.body,
                    duration: 5000,
                });
            }
        });
    } else {
        // Update the callback if listener is already set up
        currentMessageCallback = callback;
    }
};

export const checkNotificationSupport = () => {
    const isSupported = 'Notification' in window;
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasMessaging = messaging !== null;

    let permission = 'default';
    if (isSupported) {
        permission = Notification.permission;
    }

    return {
        isSupported,
        hasServiceWorker,
        hasMessaging,
        permission,
        canReceiveNotifications: isSupported && hasServiceWorker && hasMessaging && permission === 'granted'
    };
};

export const initializePushNotifications = async (onMessageCallback) => {
    try {
        const support = checkNotificationSupport();

        if (!support.isSupported) {
            console.log('Notifications not supported');
            return false;
        }

        if (!support.hasServiceWorker) {
            console.log('Service worker not supported');
            return false;
        }

        if (!support.hasMessaging) {
            console.log('Firebase messaging not available');
            return false;
        }

        // If permission is already granted, get token and listen to messages
        if (support.permission === 'granted') {
            const token = await getFCMToken();
            if (token && onMessageCallback) {
                listenToForegroundMessages(onMessageCallback);
            }
            return true;
        }

        // If permission is not granted, request it
        if (support.permission === 'default') {
            const token = await requestNotificationPermission();
            if (token && onMessageCallback) {
                listenToForegroundMessages(onMessageCallback);
            }
            return token !== null;
        }

        return false;
    } catch (error) {
        console.error('Error initializing push notifications:', error);
        return false;
    }
};

export const sendTokenToServer = async (token, userId = null) => {
    try {
        // Replace with your API endpoint
        const response = await fetch('/api/register-fcm-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                userId,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            console.log('FCM token sent to server successfully');
        } else {
            console.error('Failed to send FCM token to server');
        }
    } catch (error) {
        console.error('Error sending FCM token to server:', error);
    }
};

export const unsubscribeFromNotifications = async () => {
    try {
        // Remove token from localStorage
        localStorage.removeItem('fcmToken');

        // You might want to call your server to remove the token
        const token = localStorage.getItem('fcmToken');
        if (token) {
            await fetch('/api/unregister-fcm-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token })
            });
        }

        console.log('Unsubscribed from push notifications');
    } catch (error) {
        console.error('Error unsubscribing from notifications:', error);
    }
};

export const showCustomNotification = (notificationData) => {
    const { title, body, icon, image, data } = notificationData;

    console.log('showCustomNotification called with:', notificationData);
    console.log('Notification permission:', Notification.permission);

    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
        try {
            const notification = new Notification(title, {
                body,
                icon: icon || '/favicon.ico',
                image: image,
                data: data,
                tag: data?.tag || 'default',
                requireInteraction: false, // Changed to false for better UX
                vibrate: [200, 100, 200],
                silent: false
            });

            console.log('Browser notification created:', notification);

            notification.onclick = () => {
                window.focus();
                notification.close();

                // Handle notification click
                if (data?.url) {
                    window.location.href = data.url;
                }
            };

            // Auto close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
        } catch (error) {
            console.error('Error creating browser notification:', error);
        }
    } else {
        console.log('Notification permission not granted:', Notification.permission);
    }

    // Show toast notification only if not already handled by foreground listener
    // This prevents duplicate toast notifications
    if (!isListenerSetup) {
        toast.success(title, {
            description: body,
            duration: 5000,
        });
    }
};

// Test function to check notification functionality
export const testNotification = () => {
    console.log('Testing notification functionality...');

    const testData = {
        title: 'Test Notification',
        body: 'This is a test notification to check if everything is working',
        icon: '/favicon.ico',
        data: { test: true }
    };

    showCustomNotification(testData);
};
