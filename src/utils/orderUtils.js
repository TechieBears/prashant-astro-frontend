/**
 * Utility functions for order data transformation and processing
 */

/**
 * Create order data object with consistent structure
 * @param {Object} options - Order creation options
 * @param {string} [options.productId] - ID of a single product (use either this or cartItems)
 * @param {number} [options.quantity] - Quantity for a single product
 * @param {Array} [options.cartItems] - Array of cart items (use either this or productId/quantity)
 * @param {string} options.addressId - Shipping address ID
 * @param {Object} [options.paymentDetails] - Optional payment details
 * @param {string} [options.paymentMethod='UPI'] - Payment method (default: 'UPI')
 * @param {string} [options.paymentProvider='PhonePe'] - Payment provider (default: 'PhonePe')
 * @returns {Object} Formatted order data
 */
export const createOrderData = ({
  productId,
  quantity,
  cartItems,
  addressId,
  paymentDetails = {},
  paymentMethod = 'UPI',
  paymentProvider = 'PhonePe'
}) => {
  if (!addressId) {
    throw new Error('addressId is required');
  }

  if (!cartItems && (!productId || quantity === undefined)) {
    throw new Error('Either cartItems or both productId and quantity must be provided');
  }

  const defaultPaymentDetails = {
    transactionId: `TXN${Date.now()}`,
    provider: paymentProvider,
    status: 'PENDING',
    paidAt: null,
    ...paymentDetails
  };

  // Create items array based on input type
  const items = cartItems 
    ? cartItems.map(item => ({
        product: item.productId || item.product?._id || item._id,
        quantity: item.quantity
      }))
    : [{ product: productId, quantity }];

  return {
    items,
    address: addressId,
    paymentMethod,
    paymentDetails: defaultPaymentDetails
  };
};

/**
 * Transform API response data to match ProductSuccessSection props
 * @param {Object} apiData - The API response from createProductOrder
 * @returns {Object} Transformed data for ProductSuccessSection
 */
export const transformProductOrderData = (apiData) => {
    if (!apiData || !apiData.order || !apiData.order.items) {
        return {
            orderItems: [],
            subtotal: 0,
            totalDiscount: 0,
            total: 0,
            orderId: null
        };
    }

    const orderItems = apiData.order.items.map((item, index) => ({
        id: item._id || `item-${index}`,
        title: item.snapshot?.name || 'Product',
        price: item.snapshot?.sellingPrice || item.subtotal / item.quantity,
        oldPrice: item.snapshot?.mrpPrice || item.snapshot?.sellingPrice || item.subtotal / item.quantity,
        image: item.snapshot?.images || 'https://via.placeholder.com/150',
        quantity: item.quantity
    }));

    const subtotal = apiData.order.amount?.basePrice || apiData.order.totalAmount || 0;
    const total = apiData.order.finalAmount || apiData.order.totalAmount || 0;
    const totalDiscount = Math.max(0, subtotal - total);
    const orderId = apiData.order._id;

    return {
        orderItems,
        subtotal,
        totalDiscount,
        total,
        orderId
    };
};

/**
 * Transform service cart items to service booking data
 * @param {Array} serviceCartItems
 * @returns {Object}
 */
export const transformServiceData = (serviceCartItems) => {
    if (!serviceCartItems || serviceCartItems.length === 0) {
        return null;
    }

    const firstService = serviceCartItems[0];

    return {
        serviceType: firstService.name || "Service",
        sessionDuration: "30-60 minutes",
        date: "15th Sep, 2025",
        time: "12:00PM - 01:00PM",
        mode: "In-person / Online",
        zoomLink: "zoommtg://zoom.us/join?confno=8529015944&pwd=123456&uname=John%20Doe",
        orderId: `SRV-${Date.now()}`
    };
};

/**
 * Validate order data before processing
 * @param {Object} orderData - Order data to validate
 * @param {string} orderType - Type of order ('products' or 'services')
 * @returns {Object} Validation result with isValid and error message
 */
export const validateOrderData = (orderData, orderType) => {
    if (!orderData) {
        return { isValid: false, error: 'No order data provided' };
    }

    if (orderType === 'products') {
        if (!orderData.order || !orderData.order.items || orderData.order.items.length === 0) {
            return { isValid: false, error: 'No product items found in order' };
        }
    } else if (orderType === 'services') {
        if (!orderData.serviceType) {
            return { isValid: false, error: 'No service type found in booking' };
        }
    }

    return { isValid: true, error: null };
};

/**
 * Format order summary for display
 * @param {Object} orderData - Order data
 * @param {string} orderType - Type of order
 * @returns {Object} Formatted order summary
 */
export const formatOrderSummary = (orderData, orderType) => {
    if (orderType === 'products') {
        const transformed = transformProductOrderData(orderData);
        return {
            type: 'Product Order',
            itemCount: transformed.orderItems.length,
            totalItems: transformed.orderItems.reduce((sum, item) => sum + item.quantity, 0),
            total: transformed.total,
            orderId: transformed.orderId
        };
    } else if (orderType === 'services') {
        return {
            type: 'Service Booking',
            serviceType: orderData.serviceType,
            orderId: orderData.orderId
        };
    }

    return null;
};
