import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../css/react-calendar.css';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import { getServiceModeOptions, getServiceType } from '../../utils/serviceConfig';
import { Input, Select } from '../../components/Form';
import { getServicesList, getAllAstrologer, checkAvailability, addServiceToCart, getSelectedService } from '../../api';
import Preloaders from '../../components/Loader/Preloaders';
import ServiceAddressSelector from '../../components/Address/ServiceAddressSelector';
import { useAddress } from '../../context/AddressContext';

const BookingCalendar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const serviceData = location.state?.serviceData || {};

    // Get auth state and user details from Redux
    const isLogged = useSelector(state => state.user.isLogged);
    const authLoading = useSelector(state => state.user.loading);
    const loggedUserDetails = useSelector(state => state.user.loggedUserDetails);

    // Service state
    const [selectedService, setSelectedService] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [allServicesData, setAllServicesData] = useState([]);
    const [isServicesLoading, setIsServicesLoading] = useState(false);
    const [astrologers, setAstrologers] = useState([]);
    const [isAstrologersLoading, setIsAstrologersLoading] = useState(false);
    const [availability, setAvailability] = useState(null);
    const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
    const [isFetchingServiceDetail, setIsFetchingServiceDetail] = useState(false);

    // Form setup with react-hook-form
    const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            serviceType: '',
            serviceMode: 'online',
            astrologer: '',
            bookingType: 'self', // 'self' or 'others'
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            timeSlot: '',
            selectedDate: null
        }
    });

    const watchedAstrologer = watch('astrologer');
    const watchedDate = watch('selectedDate');
    const watchedServiceType = watch('serviceType');
    const watchedBookingType = watch('bookingType');

    // Get address context - must be called before any returns
    const { defaultAddress } = useAddress();

    // User details population
    useEffect(() => {
        if (loggedUserDetails && Object.keys(loggedUserDetails).length > 0) {
            setValue('firstName', loggedUserDetails.firstName || '');
            setValue('lastName', loggedUserDetails.lastName || '');
            setValue('phone', loggedUserDetails.mobileNo || '');
            setValue('email', loggedUserDetails.email || '');
        }
    }, [loggedUserDetails, setValue]);

    // Handle booking type change
    useEffect(() => {
        if (watchedBookingType === 'others') {
            setValue('firstName', '');
            setValue('lastName', '');
            setValue('phone', '');
            setValue('email', '');
            setValue('address', '');
        } else if (watchedBookingType === 'self') {
            if (loggedUserDetails && Object.keys(loggedUserDetails).length > 0) {
                setValue('firstName', loggedUserDetails.firstName || '');
                setValue('lastName', loggedUserDetails.lastName || '');
                setValue('phone', loggedUserDetails.mobileNo || '');
                setValue('email', loggedUserDetails.email || '');
            }
        }
    }, [watchedBookingType, loggedUserDetails, setValue]);

    const serviceModeOptions = getServiceModeOptions();

    const timeSlots = useMemo(() => {
        if (!availability?.data?.timeSlots) return [];
        const availableSlots = availability.data.timeSlots
            .filter(slot => (slot.status === 'available' && slot.disabled === false))
            .map(slot => ({
                value: slot.time,
                label: `${slot.time}`
            }));
        return availableSlots;
    }, [availability]);

    // Astrologer options
    const AstrologerOptions = useMemo(() => {
        if (!astrologers.length) return [];
        return astrologers.map(astrologer => ({
            value: astrologer._id,
            label: astrologer?.profile?.firstName + ' ' + astrologer?.profile?.lastName
        }));
    }, [astrologers]);

    // Service options
    const serviceOptions = useMemo(() => {
        if (!services.length) return [];
        return services;
    }, [services]);

    // Fetch services
    const fetchServices = useCallback(async () => {
        if (services.length > 0 || isServicesLoading) return;

        try {
            setIsServicesLoading(true);
            const response = await getServicesList();
            if (response?.success && response?.data) {
                const allServices = response.data.flatMap(category =>
                    category.services.map(service => ({
                        value: service._id,
                        label: service.name
                    }))
                );
                const completeServicesData = response.data.flatMap(category => category.services);
                setServices(allServices);
                setAllServicesData(completeServicesData);
            } else {
                toast.error('Failed to load services. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services. Please try again.');
        } finally {
            setIsServicesLoading(false);
        }
    }, [isServicesLoading]);

    // Fetch astrologers
    const fetchAstrologers = useCallback(async () => {
        if (astrologers.length > 0 || isAstrologersLoading) return;

        try {
            setIsAstrologersLoading(true);
            const response = await getAllAstrologer();
            if (response?.success) {
                setAstrologers(response.data || []);
            } else {
                setAstrologers([]);
                toast.error('Failed to load astrologers. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching astrologers:', error);
            setAstrologers([]);
            toast.error('Failed to load astrologers. Please try again.');
        } finally {
            setIsAstrologersLoading(false);
        }
    }, [astrologers.length, isAstrologersLoading]);

    useEffect(() => {
        if (authLoading) return;

        if (!isLogged) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return;
        }
    }, [isLogged, authLoading, navigate]);

    // Service data initialization
    useEffect(() => {
        if (!isLogged || authLoading) return;

        if (!serviceData || Object.keys(serviceData).length === 0) {
            console.warn('No service data available - redirecting to service detail page');
            const serviceId = window.location.pathname.split('/').pop();
            if (serviceId) {
                navigate(`/services/${serviceId}`);
            } else {
                navigate('/');
            }
            return;
        }

        setSelectedService(serviceData);
        setValue('serviceType', serviceData?._id || '');

        // Auto-select service Mode based on serviceType from API
        if (serviceData?.serviceType && Array.isArray(serviceData.serviceType) && serviceData.serviceType.length > 0) {
            setValue('serviceMode', serviceData.serviceType[0]);
        }

        setIsLoading(false);
    }, [isLogged, authLoading, serviceData, navigate, setValue]);

    // Services fetching
    useEffect(() => {
        if (!isLogged || authLoading) return;
        fetchServices();
    }, [isLogged, authLoading, fetchServices]);

    // Astrologers fetching
    useEffect(() => {
        if (!isLogged || authLoading) return;
        fetchAstrologers();
    }, [isLogged, authLoading, fetchAstrologers]);

    // Watch for service type changes and fetch full service details
    useEffect(() => {
        const fetchServiceDetail = async () => {
            if (!watchedServiceType || !allServicesData.length) return;
            if (watchedServiceType === selectedService?._id) return;

            try {
                setIsFetchingServiceDetail(true);
                setAvailability(null);
                setValue('timeSlot', '');
                const serviceFromList = allServicesData.find(service => service._id === watchedServiceType);

                if (serviceFromList) {
                    const response = await getSelectedService(watchedServiceType);
                    if (response?.success && response?.data) {
                        setSelectedService(response.data);
                        const serviceMode = Array.isArray(response.data.serviceType) && response.data.serviceType.length > 0
                            ? response.data.serviceType[0]
                            : 'online';
                        setValue('serviceMode', serviceMode);
                    } else {
                        const serviceMode = Array.isArray(serviceFromList.serviceType) && serviceFromList.serviceType.length > 0
                            ? serviceFromList.serviceType[0]
                            : 'online';
                        setValue('serviceMode', serviceMode);
                        setSelectedService(serviceFromList);
                    }
                }
            } catch (error) {
                console.error('Error fetching service details:', error);
                toast.error('Failed to load service details');

                // Fallback to list data on error
                const serviceFromList = allServicesData.find(service => service._id === watchedServiceType);
                if (serviceFromList) {
                    const serviceMode = Array.isArray(serviceFromList.serviceType) && serviceFromList.serviceType.length > 0
                        ? serviceFromList.serviceType[0]
                        : 'online';
                    setValue('serviceMode', serviceMode);
                    setSelectedService(serviceFromList);
                }
            } finally {
                setIsFetchingServiceDetail(false);
            }
        };

        fetchServiceDetail();
    }, [watchedServiceType, allServicesData, selectedService?._id, setValue]);

    if (authLoading || !isLogged || !serviceData || Object.keys(serviceData).length === 0) {
        return <Preloaders />;
    }

    const checkAstrologerAvailability = useCallback(async (date, astrologerId, serviceType, serviceDuration) => {
        if (!date || !astrologerId || !serviceType) return;

        try {
            setIsAvailabilityLoading(true);

            const formattedDate = date.toLocaleDateString('en-CA');
            const payload = {
                date: formattedDate,
                astrologer_id: astrologerId,
                service_type: getServiceType(serviceType),
                service_duration: parseInt(serviceDuration) || 60
            };
            const response = await checkAvailability(payload);

            if (response && response.success === false) {
                toast.error(response.message || 'Astrologer is not available on this day');
                setAvailability(null);
                return null;
            }
            if (response && response.success === true) {
                setAvailability(response);
                return response;
            }

            setAvailability(null);
            return null;
        } catch (error) {
            console.error('Error checking availability:', error);

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to check availability. Please try again.');
            }

            setAvailability(null);
            return null;
        } finally {
            setIsAvailabilityLoading(false);
        }
    }, []);

    // Date selection handler for react-calendar
    const handleDateSelect = useCallback((date) => {
        setValue('selectedDate', date);
        setValue('timeSlot', '');
    }, [setValue]);

    useEffect(() => {
        if (!watchedServiceType || !watchedAstrologer || !watchedDate) return;
        if (!selectedService?._id || watchedServiceType !== selectedService._id) return;
        if (!selectedService.serviceType || !selectedService.durationInMinutes) return;

        checkAstrologerAvailability(
            watchedDate,
            watchedAstrologer,
            selectedService.serviceType,
            selectedService.durationInMinutes
        );
    }, [watchedServiceType, watchedAstrologer, watchedDate, selectedService?._id, selectedService?.serviceType, selectedService?.durationInMinutes, checkAstrologerAvailability]);

    // Form submission handler
    const onSubmit = useCallback(async (data) => {
        try {
            if (!data.selectedDate) {
                toast.error('Please select a date');
                return;
            }

            if (!data.timeSlot) {
                toast.error('Please select a time slot');
                return;
            }

            if (!data.astrologer) {
                toast.error('Please select an astrologer');
                return;
            }

            // Validate address based on booking type
            if (data.bookingType === 'self') {
                if (!defaultAddress) {
                    toast.error('Please select a default address');
                    return;
                }
            } else {
                if (!data.address || !data.address.trim()) {
                    toast.error('Please enter address');
                    return;
                }
            }

            const formattedDate = data.selectedDate.toLocaleDateString('en-CA');

            // Map serviceMode values to API enum
            const serviceModeMap = {
                'online': 'online',
                'pandit_center': 'pandit_center',
                'pooja_at_home': 'pooja_at_home'
            };

            const timeSlotParts = data.timeSlot.split(' - ');
            const startTime = timeSlotParts[0];
            const endTime = timeSlotParts[1];

            // Construct payload based on booking type
            let servicePayload;

            if (data.bookingType === 'self') {
                // For self booking: use default address ID from context
                servicePayload = {
                    serviceId: data.serviceType,
                    serviceMode: serviceModeMap[data.serviceMode] || 'online',
                    astrologer: data.astrologer,
                    startTime: startTime,
                    endTime: endTime,
                    date: formattedDate,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: defaultAddress ? defaultAddress._id : ''
                };
            } else {
                // For others booking: use address data from form
                servicePayload = {
                    serviceId: data.serviceType,
                    serviceMode: serviceModeMap[data.serviceMode] || 'online',
                    astrologer: data.astrologer,
                    startTime: startTime,
                    endTime: endTime,
                    date: formattedDate,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    addressData: data.address || ''
                };
            }

            // Call the API to add service to cart
            const response = await addServiceToCart(servicePayload);

            if (response.success) {
                toast.dismiss();
                toast.success('Service added to cart successfully!');
                // Navigate to cart page with services tab selected
                setTimeout(() => {
                    navigate('/cart', { state: { activeTab: 'services' } });
                }, 100);
            } else {
                toast.dismiss();
                toast.error(response.message || 'Failed to add service to cart');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.dismiss();
            toast.error('Failed to book service. Please try again.');
        }
    }, [navigate, defaultAddress]);


    // Show loading state
    if (isLoading) {
        return <Preloaders />;
    }

    return (
        <>
            <BackgroundTitle
                title="Booking Calendar"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: "Book Now", href: "#" }
                ]}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            <div className="min-h-screen">
                <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-12 md:py-14">
                    {/* Header with Go Back and Title */}
                    <div className="flex items-center justify-between my-4 sm:my-6 md:my-8 px-2 sm:px-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                        >
                            <FaArrowLeft className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Go Back</span>
                            <span className="sm:hidden">Back</span>
                        </button>

                        <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-center text-gray-800 flex-1 mx-2 sm:mx-4">
                            Booking Calendar
                        </h1>

                        {/* Empty div for balance */}
                        <div className="w-12 sm:w-16 md:w-20"></div>
                    </div>

                    {/* Main Booking Card */}
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg px-4 sm:px-6 py-6 sm:py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="space-y-6">
                                {/* Services Type */}
                                <Controller
                                    name="serviceType"
                                    control={control}
                                    rules={{ required: 'Service type is required' }}
                                    render={({ field }) => (
                                        <Select
                                            id="serviceType"
                                            label="Services Type"
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={serviceOptions}
                                            required
                                            disabled={isServicesLoading || isFetchingServiceDetail}
                                            isLoading={isServicesLoading || isFetchingServiceDetail}
                                        />
                                    )}
                                />
                                {errors.serviceType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.serviceType.message}</p>
                                )}

                                {/* Select Service Mode */}
                                <Controller
                                    name="serviceMode"
                                    control={control}
                                    rules={{ required: 'Service Mode is required' }}
                                    render={({ field }) => {
                                        const availableServiceTypes = selectedService?.serviceType || [];

                                        return (
                                            <div>
                                                <label className="block text-sm font-medium mb-3" style={{ color: '#62748E' }}>
                                                    Service Mode
                                                </label>
                                                <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2">
                                                    {serviceModeOptions.map((option) => {
                                                        const isAvailable = availableServiceTypes.includes(option.value);

                                                        return (
                                                            <label key={option.value} className={`flex items-center whitespace-nowrap flex-shrink-0 ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                                                                <div className="relative flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="serviceMode"
                                                                        value={option.value}
                                                                        checked={field.value === option.value}
                                                                        onChange={() => isAvailable && field.onChange(option.value)}
                                                                        disabled={!isAvailable}
                                                                        className="absolute opacity-0 w-0 h-0"
                                                                    />
                                                                    <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center transition-colors ${field.value === option.value ? 'border-[#FF8835]' : 'border-[#E2E8F0]'}`}>
                                                                        {field.value === option.value && (
                                                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FF8835] rounded-full"></span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <span className={`ml-1.5 sm:ml-2 text-xs sm:text-sm ${isAvailable ? (field.value === option.value ? 'text-gray-700 font-medium' : 'text-gray-600') : 'text-gray-400'}`}>{option.label}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                {errors.serviceMode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.serviceMode.message}</p>
                                )}

                                {/* Select Pandit */}
                                <Controller
                                    name="astrologer"
                                    control={control}
                                    rules={{ required: 'Astrologer selection is required' }}
                                    render={({ field }) => (
                                        <Select
                                            id="astrologer"
                                            label="Select Pandit"
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={AstrologerOptions}
                                            required
                                            placeholder="Select a Pandit"
                                            disabled={isAstrologersLoading}
                                            isLoading={isAstrologersLoading}
                                        />
                                    )}
                                />
                                {errors.astrologer && (
                                    <p className="text-red-500 text-sm mt-1">{errors.astrologer.message}</p>
                                )}

                                {/* Booking Type Tabs */}
                                <Controller
                                    name="bookingType"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex justify-center">
                                            <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm w-full max-w-md">
                                                <button
                                                    type="button"
                                                    className={`px-6 py-2 rounded-full transition-colors text-sm flex-1 ${field.value === 'self'
                                                        ? 'bg-button-gradient-orange text-white hover:opacity-90'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => field.onChange('self')}
                                                >
                                                    For Self
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`px-6 py-2 rounded-full transition-colors text-sm flex-1 ${field.value === 'others'
                                                        ? 'bg-button-gradient-orange text-white hover:opacity-90'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => field.onChange('others')}
                                                >
                                                    For Others
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* First Name and Last Name in one row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        rules={{
                                            required: watchedBookingType === 'others' ? 'First name is required' : false
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                id="firstName"
                                                label="First Name"
                                                type="text"
                                                value={field.value}
                                                onChange={field.onChange}
                                                readOnly={watchedBookingType === 'self'}
                                                className={watchedBookingType === 'others' ? "" : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"}
                                            />
                                        )}
                                    />

                                    {/* Last Name */}
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        rules={{
                                            required: watchedBookingType === 'others' ? 'Last name is required' : false
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                id="lastName"
                                                label="Last Name"
                                                type="text"
                                                value={field.value}
                                                onChange={field.onChange}
                                                readOnly={watchedBookingType === 'self'}
                                                className={watchedBookingType === 'others' ? "" : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Phone and Email in one row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone Number */}
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{
                                            required: watchedBookingType === 'others' ? 'Phone number is required' : false
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                id="phone"
                                                label="Phone Number"
                                                type="tel"
                                                value={field.value}
                                                onChange={field.onChange}
                                                readOnly={watchedBookingType === 'self'}
                                                className={watchedBookingType === 'others' ? "" : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"}
                                            />
                                        )}
                                    />

                                    {/* Email Address */}
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: watchedBookingType === 'others' ? 'Email address is required' : false,
                                            pattern: watchedBookingType === 'others' ? {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            } : undefined
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                id="email"
                                                label="Email Address"
                                                type="email"
                                                value={field.value}
                                                onChange={field.onChange}
                                                readOnly={watchedBookingType === 'self'}
                                                className={watchedBookingType === 'others' ? "" : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Address field for "For Others" */}
                                {watchedBookingType === 'others' && (
                                    <Controller
                                        name="address"
                                        control={control}
                                        rules={{
                                            required: 'Address is required'
                                        }}
                                        render={({ field }) => (
                                            <div className="flex flex-col h-full">
                                                <div>
                                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Address
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                </div>
                                                <div className="flex-grow flex flex-col justify-center">
                                                    <textarea
                                                        id="address"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Enter complete address including street, city, state, and postal code"
                                                        required
                                                        rows={4}
                                                        className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white resize-vertical"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                )}

                                {/* Display validation errors */}
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                )}
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                )}
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                                )}

                                {/* Address section - only show for "For Self" */}
                                {watchedBookingType === 'self' && (
                                    <div className="mt-6">
                                        <h2 className="text-lg font-semibold mb-2">Address</h2>
                                        <ServiceAddressSelector />
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Time and Date Selection */}
                            <div className="space-y-6 flex flex-col">
                                {/* Calendar */}
                                <div className="bg-light-pg rounded-2xl shadow-lg p-2 sm:p-4 md:p-6 overflow-hidden">
                                    <Calendar
                                        onChange={handleDateSelect}
                                        value={watchedDate}
                                        minDate={new Date()}
                                        className="react-calendar-custom w-full"
                                    />
                                </div>

                                {/* Time Slots */}
                                <Controller
                                    name="timeSlot"
                                    control={control}
                                    rules={{ required: 'Time slot is required' }}
                                    render={({ field }) => (
                                        <Select
                                            id="timeSlot"
                                            label="Available Time Slots"
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={[
                                                { value: '', label: 'Select a time slot', disabled: true },
                                                ...timeSlots
                                            ]}
                                            required
                                            disabled={!watchedDate || timeSlots.length === 0}
                                        />
                                    )}
                                />
                                {errors.timeSlot && (
                                    <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>
                                )}
                                {watchedDate && timeSlots.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-1">No available time slots for this date</p>
                                )}
                            </div>
                        </div>


                        {/* Book Service Button */}
                        <div className="flex justify-center mt-8 w-full px-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-button-diagonal-gradient-orange text-white py-3 rounded-[0.2rem] font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 w-full max-w-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'Booking...' : 'Book Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BookingCalendar;