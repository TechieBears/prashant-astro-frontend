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
import { getServicesList, getAllAstrologer, checkAvailability, addServiceToCart } from '../../api';

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

    // Form setup with react-hook-form
    const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            serviceType: '',
            serviceMode: 'online',
            astrologer: '',
            fullName: '',
            mobileNumber: '',
            emailAddress: '',
            timeSlot: '',
            selectedDate: null
        }
    });

    // Watch form values for availability checks
    const watchedAstrologer = watch('astrologer');
    const watchedDate = watch('selectedDate');
    const watchedServiceType = watch('serviceType');

    // User details population
    useEffect(() => {
        if (loggedUserDetails && Object.keys(loggedUserDetails).length > 0) {
            setValue('fullName', `${loggedUserDetails.firstName || ''} ${loggedUserDetails.lastName || ''}`.trim());
            setValue('mobileNumber', loggedUserDetails.mobileNo || '');
            setValue('emailAddress', loggedUserDetails.email || '');
        }
    }, [loggedUserDetails, setValue]);

    const [selectedDate, setSelectedDate] = useState(null);

    const serviceModeOptions = getServiceModeOptions();

    const timeSlots = useMemo(() => {
        if (!availability?.data?.timeSlots) return [];
        const availableSlots = availability.data.timeSlots
            .filter(slot => slot.status === 'available')
            .map(slot => ({
                value: slot.time,
                label: `${slot.display_time} - ${slot.display_end_time}`
            }));
        return availableSlots;
    }, [availability]);

    // Astrologer options
    const AstrologerOptions = useMemo(() => {
        if (!astrologers.length) return [];
        return astrologers.map(astrologer => ({
            value: astrologer._id,
            label: astrologer.fullName
        }));
    }, [astrologers]);

    // Service options
    const serviceOptions = useMemo(() => {
        if (!services.length) return [];
        return [
            {
                value: selectedService?._id || '',
                label: selectedService?.name || 'Select a service'
            },
            ...services.filter(service => service.value !== selectedService?._id)
        ];
    }, [services, selectedService]);

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
    }, [services.length, isServicesLoading]);

    // Fetch astrologers
    const fetchAstrologers = useCallback(async () => {
        if (astrologers.length > 0 || isAstrologersLoading) return;

        try {
            setIsAstrologersLoading(true);
            const response = await getAllAstrologer();
            if (response?.success && response?.data) {
                setAstrologers(response.data);
            } else {
                toast.error('Failed to load astrologers. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching astrologers:', error);
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
        if (serviceData?.serviceType) {
            setValue('serviceMode', serviceData.serviceType);
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

    // Watch for service type changes and update service mode
    useEffect(() => {
        if (!watchedServiceType || !allServicesData.length) return;

        const selectedServiceData = allServicesData.find(service => service._id === watchedServiceType);
        if (selectedServiceData?.serviceType) {
            setValue('serviceMode', selectedServiceData.serviceType);
            setSelectedService(selectedServiceData);
        }
    }, [watchedServiceType, allServicesData, setValue]);

    if (authLoading || !isLogged || !serviceData || Object.keys(serviceData).length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {authLoading ? 'Checking authentication...' : 'Loading booking information...'}
                    </p>
                </div>
            </div>
        );
    }

    const checkAstrologerAvailability = useCallback(async (date, astrologerId, serviceType) => {
        if (!date || !astrologerId || !serviceType) return;

        try {
            setIsAvailabilityLoading(true);

            const formattedDate = date.toLocaleDateString('en-CA');
            const payload = {
                date: formattedDate,
                astrologer_id: astrologerId,
                service_type: getServiceType(serviceType),
                service_duration: parseInt(serviceData.durationInMinutes) || 60
            };
            const response = await checkAvailability(payload);

            // Check if the response indicates the astrologer is not available
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
    }, [serviceData.durationInMinutes]);

    // Date selection handler for react-calendar
    const handleDateSelect = useCallback((date) => {
        // Format date to YYYY-MM-DD
        const formattedDate = date ?
            date.toLocaleDateString('en-CA') :
            null;

        setSelectedDate(date);
        setValue('selectedDate', date);
        setValue('timeSlot', '');
    }, [setValue]);

    useEffect(() => {
        if (watchedAstrologer && watchedDate && watchedServiceType) {
            const selectedAstrologer = astrologers.find(astrologer => astrologer._id === watchedAstrologer);
            const selectedService = allServicesData.find(service => service._id === watchedServiceType);
            if (selectedAstrologer && selectedService) {
                checkAstrologerAvailability(watchedDate, selectedAstrologer._id, selectedService?.serviceType);
            }
        }
    }, [watchedAstrologer, watchedDate, watchedServiceType, checkAstrologerAvailability]);

    // Form submission handler
    const onSubmit = useCallback(async (data) => {
        try {
            // Validate required fields
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

            // Format date for API (YYYY-MM-DD format)
            const formattedDate = data.selectedDate.toLocaleDateString('en-CA');

            // Map serviceMode values to API enum
            const serviceModeMap = {
                'online': 'online',
                'pandit_center': 'pandit_center',
                'pooja_at_home': 'pooja_at_home'
            };

            // Parse timeSlot to extract startTime and endTime
            const timeSlotParts = data.timeSlot.split(' - ');
            const startTime = timeSlotParts[0];
            const endTime = timeSlotParts[1];

            // Prepare payload for addServiceToCart API
            const servicePayload = {
                serviceId: data.serviceType,
                serviceMode: serviceModeMap[data.serviceMode] || 'online',
                astrologer: data.astrologer,
                startTime: startTime,
                endTime: endTime,
                date: formattedDate
            };

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
    }, [navigate]);


    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F5F5] py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading service details...</p>
                </div>
            </div>
        );
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
                                            disabled={isServicesLoading}
                                            isLoading={isServicesLoading}
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
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm font-medium mb-3" style={{ color: '#62748E' }}>
                                                Service Mode
                                            </label>
                                            <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2">
                                                {serviceModeOptions.map((option) => (
                                                    <label key={option.value} className={`flex items-center whitespace-nowrap flex-shrink-0 ${field.value === option.value ? 'cursor-default' : 'cursor-not-allowed opacity-50'}`}>
                                                        <div className="relative flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="serviceMode"
                                                                value={option.value}
                                                                checked={field.value === option.value}
                                                                onChange={() => { }} // Disabled - no onChange action
                                                                disabled={true} // Disable all radio buttons
                                                                className="absolute opacity-0 w-0 h-0"
                                                            />
                                                            <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center transition-colors ${field.value === option.value ? 'border-[#FF8835]' : 'border-[#E2E8F0]'}`}>
                                                                {field.value === option.value && (
                                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FF8835] rounded-full"></span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <span className={`ml-1.5 sm:ml-2 text-xs sm:text-sm ${field.value === option.value ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors.serviceMode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.serviceMode.message}</p>
                                )}

                                {/* Select Astrologer */}
                                <Controller
                                    name="astrologer"
                                    control={control}
                                    rules={{ required: 'Astrologer selection is required' }}
                                    render={({ field }) => (
                                        <Select
                                            id="astrologer"
                                            label="Select Astrologer"
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={AstrologerOptions}
                                            required
                                            placeholder="Select a astrologer"
                                            disabled={isAstrologersLoading}
                                            isLoading={isAstrologersLoading}
                                        />
                                    )}
                                />
                                {errors.astrologer && (
                                    <p className="text-red-500 text-sm mt-1">{errors.astrologer.message}</p>
                                )}

                                {/* Full Name and Mobile Number in one row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <Controller
                                        name="fullName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="fullName"
                                                label="Full Name"
                                                type="text"
                                                value={field.value}
                                                readOnly
                                                className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                                            />
                                        )}
                                    />

                                    {/* Mobile Number */}
                                    <Controller
                                        name="mobileNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="mobileNumber"
                                                label="Mobile Number"
                                                type="tel"
                                                value={field.value}
                                                readOnly
                                                className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Email Address */}
                                <Controller
                                    name="emailAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="emailAddress"
                                            label="Email Address"
                                            type="email"
                                            value={field.value}
                                            readOnly
                                            className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                                        />
                                    )}
                                />
                            </div>

                            {/* Right Column - Time and Date Selection */}
                            <div className="space-y-6 flex flex-col">
                                {/* Calendar */}
                                <div className="bg-light-pg rounded-2xl shadow-lg p-2 sm:p-4 md:p-6 overflow-hidden">
                                    <Calendar
                                        onChange={handleDateSelect}
                                        value={selectedDate}
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
                                            disabled={!selectedDate || timeSlots.length === 0}
                                        />
                                    )}
                                />
                                {errors.timeSlot && (
                                    <p className="text-red-500 text-sm mt-1">{errors.timeSlot.message}</p>
                                )}
                                {selectedDate && timeSlots.length === 0 && (
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