/**
 * Utility functions for order data transformation and processing
 * 
 * FEATURES:
 * - Product Orders: Supports multiple product items in a single order
 * - Service Orders: Supports multiple service items in a single order
 */

// Default values for service data
const DEFAULT_SERVICE_VALUES = {
    serviceType: 'Service',
    sessionDuration: '30 minutes',
    date: '2025-10-11',
    time: '11:00 - 11:30',
    mode: 'online',
    zoomLink: 'Link will be provided'
};

/**
 * Extract image URL from various possible data structures
 * @param {Object} item - Item object with potential image data
 * @returns {string} Image URL or placeholder
 */
const getImageUrl = (item) => {
    if (!item) return 'https://via.placeholder.com/150';

    const imageSources = [
        item.snapshot?.images,
        item.images,
        item.product?.images,
        item.snapshot?.image,
        item.image
    ].filter(Boolean);

    for (const source of imageSources) {
        if (typeof source === 'string') return source;
        if (Array.isArray(source) && source[0]) return source[0];
    }

    return 'https://via.placeholder.com/150';
};

/**
 * Create default payment details object
 * @param {Object} overrides - Custom payment details to override defaults
 * @returns {Object} Default payment details
 */
const createDefaultPaymentDetails = (overrides = {}) => ({
    transactionId: `TXN${Date.now()}`,
    provider: 'PhonePe',
    status: 'PENDING',
    paidAt: null,
    ...overrides
});

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
 * @param {string} [options.couponId] - Optional coupon ID to apply
 * @returns {Object} Formatted order data
 */
export const createOrderData = ({
    productId,
    quantity,
    cartItems,
    addressId,
    paymentDetails = {},
    paymentMethod = 'UPI',
    paymentProvider = 'PhonePe',
    couponId
}) => {
    if (!addressId) throw new Error('addressId is required');
    if (!cartItems && (!productId || quantity === undefined)) {
        throw new Error('Either cartItems or both productId and quantity must be provided');
    }

    const items = cartItems
        ? cartItems.map(item => ({
            product: item.productId || item.product?._id || item._id,
            quantity: item.quantity
        }))
        : [{ product: productId, quantity }];

    const orderData = {
        items,
        address: addressId,
        paymentMethod,
        paymentDetails: createDefaultPaymentDetails({
            provider: paymentProvider,
            ...paymentDetails
        })
    };

    // Add coupon if provided
    if (couponId) {
        orderData.couponId = couponId;
    }

    return orderData;
};

/**
 * Transform API response data to match ProductSuccessSection props
 * @param {Object} apiData - The API response from createProductOrder
 * @returns {Object} Transformed data for ProductSuccessSection
 */
export const transformProductOrderData = (apiData) => {
    if (!apiData?.order?.items) {
        return {
            orderItems: [],
            subtotal: 0,
            totalDiscount: 0,
            total: 0,
            orderId: null
        };
    }

    const { order } = apiData;
    const orderItems = order.items.map((item, index) => ({
        id: item._id || `item-${index}`,
        title: item.snapshot?.name || item.name || 'Product',
        price: item.snapshot?.sellingPrice || item.price || (item.subtotal / item.quantity) || 0,
        oldPrice: item.snapshot?.mrpPrice || item.snapshot?.sellingPrice || item.price || (item.subtotal / item.quantity) || 0,
        image: getImageUrl(item),
        quantity: item.quantity || 1
    }));

    const subtotal = order.amount?.basePrice || order.totalAmount || 0;
    const total = order.finalAmount || order.totalAmount || 0;
    const totalDiscount = Math.max(0, subtotal - total);

    return { orderItems, subtotal, totalDiscount, total, orderId: order._id };
};

/**
 * Create default service data
 * @param {Object} overrides - Custom service data to override defaults
 * @returns {Object} Default service data
 */
const createDefaultServiceData = (overrides = {}) => ({
    ...DEFAULT_SERVICE_VALUES,
    ...overrides
});

/**
 * Transform service cart items to service booking data
 * @param {Array} serviceCartItems
 * @returns {Object}
 */
export const transformServiceData = (serviceCartItems) => {
    if (!serviceCartItems?.length) return null;

    const firstService = serviceCartItems[0];
    return {
        ...createDefaultServiceData({
            serviceType: firstService.name,
            sessionDuration: '30-60 minutes',
            date: '15th Sep, 2025',
            time: '12:00PM - 01:00PM',
            mode: 'In-person / Online',
            zoomLink: 'zoommtg://zoom.us/join?confno=8529015944&pwd=123456&uname=John%20Doe'
        }),
        orderId: `SRV-${Date.now()}`
    };
};

/**
 * Transform service order API response to ServiceSuccessSection props
 * @param {Object} serviceOrderData - The service order data from API
 * @returns {Object} Transformed data for ServiceSuccessSection
 */
export const transformServiceOrderData = (serviceOrderData) => {
    if (!serviceOrderData) {
        return {
            services: [createDefaultServiceData()],
            orderId: null,
            totalAmount: 0
        };
    }

    const orderId = serviceOrderData._id || `SRV-${Date.now()}`;
    const totalAmount = serviceOrderData.finalAmount || serviceOrderData.totalAmount || serviceOrderData.payingAmount || 0;
    const services = [];

    if (Array.isArray(serviceOrderData.services)) {
        serviceOrderData.services.forEach((serviceItem, index) => {
            const service = serviceItem.service || {};
            services.push(createDefaultServiceData({
                serviceType: service.name || `Service ${index + 1}`,
                sessionDuration: service.durationInMinutes ? `${service.durationInMinutes} minutes` : DEFAULT_SERVICE_VALUES.sessionDuration,
                date: serviceItem.bookingDate ? new Date(serviceItem.bookingDate).toISOString().split('T')[0] : DEFAULT_SERVICE_VALUES.date,
                time: serviceItem.startTime && serviceItem.endTime
                    ? `${serviceItem.startTime} - ${serviceItem.endTime}`
                    : DEFAULT_SERVICE_VALUES.time,
                mode: serviceItem.serviceType || service.serviceType || DEFAULT_SERVICE_VALUES.mode,
                zoomLink: serviceItem.zoomLink || DEFAULT_SERVICE_VALUES.zoomLink
            }));
        });
    }

    if (services.length === 0) {
        services.push(createDefaultServiceData());
    }

    return { services, orderId, totalAmount };
};

/**
 * Create service order data object with consistent structure
 * @param {Object} options - Service order creation options
 * @param {Array} [options.services] - Array of service items (use either this or single service params)
 * @param {string} [options.serviceId] - Service ID (for single service, use either this or services array)
 * @param {string} [options.astrologerId] - Astrologer ID (for single service)
 * @param {string} [options.bookingDate] - Booking date (YYYY-MM-DD format, for single service)
 * @param {string} [options.startTime] - Start time (HH:MM format, for single service)
 * @param {string} [options.paymentType='COD'] - Payment type (default: 'COD')
 * @param {string} [options.address] - Address ID (optional, for non-online services)
 * @param {Object} [options.paymentDetails] - Optional payment details
 * @returns {Object} Formatted service order data
 */
export const createServiceOrderData = ({
    services,
    serviceId,
    astrologerId,
    bookingDate,
    startTime,
    paymentType = 'UPI', // Changed default from 'COD' to 'UPI'
    address,
    paymentDetails = {}
}) => {
    if (!services && (!serviceId || !astrologerId || !bookingDate || !startTime)) {
        throw new Error('Either services array or serviceId, astrologerId, bookingDate, and startTime are required');
    }

    if (services && services.length === 0) {
        throw new Error('Services array cannot be empty');
    }

    const defaultPaymentDetails = {
        note: "Cash will be collected at time of service",
        ...paymentDetails
    };

    // Generate payment ID
    const paymentId = `COD-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`;

    const orderData = {
        paymentType,
        paymentId,
        paymentDetails: defaultPaymentDetails
    };

    // Handle multiple services
    if (services) {
        orderData.serviceItems = services.map(service => {
            const serviceItem = {
                serviceId: String(service.serviceId || '').trim(),
                astrologerId: String(service.astrologerId || '').trim(),
                bookingDate: service.bookingDate,
                startTime: service.startTime || '00:00',
                endTime: service.endTime || '00:30',
                serviceMode: service.serviceMode || 'online',
                firstName: String(service.firstName || '').trim(),
                lastName: String(service.lastName || '').trim(),
                email: String(service.email || '').trim(),
                phone: String(service.phone || '').trim()
            };

            // Add address only for non-online services
            if (service.address && service.serviceMode !== 'online' && service.serviceMode !== 'pandit_center') {
                serviceItem.address = String(service.address).trim();
            }

            return serviceItem;
        });
    } else {
        // Handle single service (backward compatibility)
        orderData.serviceItems = [{
            serviceId: String(serviceId || '').trim(),
            astrologerId: String(astrologerId || '').trim(),
            bookingDate: bookingDate,
            startTime: startTime || '00:00',
            endTime: endTime || '00:30',
            serviceMode: 'online',
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        }];
    }

    // Add address to each service item if provided (for non-online services)
    if (address) {
        orderData.serviceItems = orderData.serviceItems.map(item => {
            if (item.serviceMode !== 'online' && item.serviceMode !== 'pandit_center') {
                return {
                    ...item,
                    address: String(address).trim()
                };
            }
            return item;
        });
    }

    return orderData;
};

/**
 * Transform service cart items to service order data
 * @param {Array} serviceCartItems - Array of service cart items
 * @param {string} [addressId] - Optional address ID for non-online services
 * @param {string} [couponId] - Optional coupon ID to apply
 * @returns {Object} Service order data ready for API
 */
export const transformServiceCartToOrderData = (serviceCartItems, addressId = null, couponId = null) => {
    if (!serviceCartItems || serviceCartItems.length === 0) {
        throw new Error('No service items in cart');
    }

    const userInfo = serviceCartItems[0]?.user || {};

    const services = serviceCartItems.map(service => {
        const serviceId = service.serviceId || service._id;
        if (!serviceId) {
            throw new Error('Invalid service item in cart');
        }

        let bookingDate = service.bookingDate || service.date;
        if (bookingDate) {
            const dateObj = new Date(bookingDate);
            if (!isNaN(dateObj.getTime())) {
                bookingDate = dateObj.toISOString().split('T')[0];
            } else {
                bookingDate = new Date().toISOString().split('T')[0];
            }
        } else {
            bookingDate = new Date().toISOString().split('T')[0];
        }

        const astrologerId = service.astrologer?._id || service.astrologerId;
        const serviceMode = service.serviceMode || 'online';
        const userData = service.cust || userInfo || {};

        // Handle address data - check for both address ID and addressData string
        const addressData = {};
        if (service.address) {
            addressData.address = String(service.address).trim();
        } else if (service.cust?.addressData) {
            addressData.addressData = String(service.cust.addressData).trim();
        }

        return {
            serviceId: serviceId,
            astrologerId: astrologerId,
            bookingDate: bookingDate,
            startTime: service.startTime || '00:00',
            endTime: service.endTime || '00:30',
            serviceMode: serviceMode,
            firstName: (service.cust?.firstName || userInfo?.firstName || '').trim(),
            lastName: (service.cust?.lastName || userInfo?.lastName || '').trim(),
            email: (service.cust?.email || userInfo?.email || '').trim(),
            phone: (service.cust?.phone || userInfo?.phone || '').trim(),
            ...addressData
        };
    });

    // Create the order data with serviceItems directly
    const orderData = {
        paymentType: 'UPI',
        paymentId: `COD-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`,
        paymentDetails: {
            note: "Cash will be collected at time of service"
        },
        serviceItems: services.map(service => {
            const serviceItem = {
                serviceId: service.serviceId,
                serviceType: service.serviceMode || 'online',
                astrologerId: service.astrologerId,
                bookingDate: service.bookingDate,
                startTime: service.startTime,
                firstName: service.firstName || '',
                lastName: service.lastName || '',
                email: service.email || '',
                phone: service.phone || ''
            };

            // Add address or addressData based on what exists
            if (service.address) {
                serviceItem.address = String(service.address).trim();
            } else if (service.addressData) {
                serviceItem.addressData = String(service.addressData).trim();
            }

            return serviceItem;
        })
    };

    // Add coupon if provided
    if (couponId) {
        orderData.couponId = couponId;
    }

    return orderData;
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