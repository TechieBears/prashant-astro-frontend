/**
 * Utility functions for order data transformation and processing
 * 
 * FEATURES:
 * - Product Orders: Supports multiple product items in a single order
 * - Service Orders: Supports multiple service items in a single order
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
 * Transform service order API response to ServiceSuccessSection props
 * @param {Object} serviceOrderData - The service order data from API
 * @returns {Object} Transformed data for ServiceSuccessSection
 */
export const transformServiceOrderData = (serviceOrderData) => {
    if (!serviceOrderData) {
        return {
            services: [{
                serviceType: "Service",
                sessionDuration: "30-60 minutes",
                date: "Date will be confirmed",
                time: "Time will be confirmed",
                mode: "Online",
                zoomLink: "Link will be provided"
            }],
            orderId: null,
            totalAmount: 0
        };
    }

    // Format the order ID
    const orderId = serviceOrderData._id || `SRV-${Date.now()}`;

    // Format the total amount
    const totalAmount = serviceOrderData.finalAmount || serviceOrderData.totalAmount || 0;

    // Transform services array - handle both ID arrays and full service objects
    const services = [];

    if (serviceOrderData.services && Array.isArray(serviceOrderData.services)) {
        serviceOrderData.services.forEach((service, index) => {
            // Check if service is an object with details or just an ID
            if (typeof service === 'object' && service !== null) {
                // Full service object
                services.push({
                    serviceType: service.serviceName || `Service ${index + 1}`,
                    sessionDuration: service.durationInMinutes
                        ? `${service.durationInMinutes} minutes`
                        : "30-60 minutes",
                    date: service.bookingDate
                        ? new Date(service.bookingDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        : "Date will be confirmed",
                    time: service.startTime && service.endTime
                        ? `${service.startTime} - ${service.endTime}`
                        : "Time will be confirmed",
                    mode: service.serviceType === 'online'
                        ? 'Consult Online'
                        : service.serviceType === 'pandit_center'
                            ? 'Consult at Astrologer location'
                            : service.serviceType === 'pooja_at_home'
                                ? 'Pooja at Home'
                                : "Online",
                    zoomLink: service.zoomLink || "Meeting link will be provided"
                });
            } else {
                // Service ID - create placeholder service
                services.push({
                    serviceType: `Service ${index + 1}`,
                    sessionDuration: "30-60 minutes",
                    date: "Date will be confirmed",
                    time: "Time will be confirmed",
                    mode: "Online",
                    zoomLink: "Meeting link will be provided"
                });
            }
        });
    }

    // If no services found, create a default one
    if (services.length === 0) {
        services.push({
            serviceType: "Astrology Service",
            sessionDuration: "30-60 minutes",
            date: "Date will be confirmed",
            time: "Time will be confirmed",
            mode: "Online",
            zoomLink: "Meeting link will be provided"
        });
    }

    return {
        services,
        orderId,
        totalAmount
    };
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
    // Validate input - either services array or individual service params
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
        // Map services to the required format for the API
        orderData.serviceItems = services.map(service => {
            // Ensure all required fields are present and properly formatted
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
 * @returns {Object} Service order data ready for API
 */
export const transformServiceCartToOrderData = (serviceCartItems, addressId = null) => {
    if (!serviceCartItems || serviceCartItems.length === 0) {
        throw new Error('No service items in cart');
    }

    // Get user information from the first cart item or from a user object
    const userInfo = serviceCartItems[0]?.user || {};

    // Transform all service cart items to the format expected by the API
    const services = serviceCartItems.map(service => {
        // Ensure we have a valid service object with serviceId
        const serviceId = service.serviceId || service._id;
        if (!serviceId) {
            console.error('Invalid service item - missing serviceId:', service);
            throw new Error('Invalid service item in cart');
        }

        // Ensure date is in YYYY-MM-DD format
        let bookingDate = service.bookingDate || service.date;
        if (bookingDate) {
            // If date is in a different format, convert it
            const dateObj = new Date(bookingDate);
            if (!isNaN(dateObj.getTime())) {
                bookingDate = dateObj.toISOString().split('T')[0];
            } else {
                bookingDate = new Date().toISOString().split('T')[0];
            }
        } else {
            bookingDate = new Date().toISOString().split('T')[0];
        }

        // Get astrologer ID from either the service or astrologer object
        const astrologerId = service.astrologer?._id || service.astrologerId;

        // Get service mode (default to 'online' if not specified)
        const serviceMode = service.serviceMode || 'online';

        // Get user information from cart item or userInfo
        const userData = service.cust || userInfo || {};
        const address = serviceMode !== 'online' && serviceMode !== 'pandit_center' && addressId
            ? { address: String(addressId).trim() }
            : {};

        return {
            serviceId: serviceId,
            astrologerId: astrologerId,
            bookingDate: bookingDate,
            startTime: service.startTime || '00:00',
            endTime: service.endTime || '00:30',
            serviceMode: serviceMode,
            // Include user information from cart item or user info
            firstName: (service.cust?.firstName || userInfo?.firstName || '').trim(),
            lastName: (service.cust?.lastName || userInfo?.lastName || '').trim(),
            email: (service.cust?.email || userInfo?.email || '').trim(),
            phone: (service.cust?.phone || userInfo?.phone || '').trim(),
            // Include address if needed
            ...address
        };
    });

    // Create the order data with serviceItems directly
    const orderData = {
        paymentType: 'UPI',
        paymentId: `COD-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`,
        paymentDetails: {
            note: "Cash will be collected at time of service"
        },
        serviceItems: services.map(service => ({
            serviceId: service.serviceId,
            astrologerId: service.astrologerId,
            bookingDate: service.bookingDate,
            startTime: service.startTime,
            endTime: service.endTime || '00:30',
            serviceMode: service.serviceMode || 'online',
            firstName: service.firstName || '',
            lastName: service.lastName || '',
            email: service.email || '',
            phone: service.phone || '',
            ...(service.address ? { address: String(service.address).trim() } : {})
        }))
    };

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