import { load } from '@cashfreepayments/cashfree-js';
import { environment } from '../env';

let cashfree;

const initializeSDK = async function () {

    try {
        cashfree = await load({
            mode: environment?.production ? "production" : "sandbox"
        });
        console.log("Cashfree SDK initialized successfully");
    } catch (error) {
        console.error("Failed to initialize Cashfree SDK:", error);
    }
};

// Initialize immediately
initializeSDK();

export const getCashfree = async () => {
    // Wait for initialization if not ready
    if (!cashfree) {
        await initializeSDK();
    }
    return cashfree;
};

export const openRazorpay = (orderData, onSuccess, onFailure) => {
    const { razorpay, order, transaction } = orderData;
    
    if (!razorpay || !razorpay.orderId) {
        console.error('Invalid razorpay data:', orderData);
        onFailure && onFailure('Invalid payment data');
        return;
    }
    
    const options = {
        key: environment?.razorpayKey || 'YOUR_RAZORPAY_KEY',
        amount: razorpay.amount,
        currency: razorpay.currency,
        order_id: razorpay.orderId,
        name: 'Astroguid',
        description: order ? 'Order Payment' : 'Payment',
        handler: function (response) {
            onSuccess({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order?._id,
                transactionId: transaction?._id
            });
        },
        modal: {
            ondismiss: function() {
                onFailure && onFailure('Payment cancelled by user');
            }
        },
        theme: {
            color: '#F37254'
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
};

export default cashfree;
