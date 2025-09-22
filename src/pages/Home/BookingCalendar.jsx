import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
// import Calendar from '../../components/Calendar'; // Commented out custom calendar
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../css/react-calendar.css';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import { Input, Select } from '../../components/Form';
import { getServicesList, getAstrologers } from '../../api';

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
    const [isServicesLoading, setIsServicesLoading] = useState(false);
    const [astrologers, setAstrologers] = useState([]);
    const [isAstrologersLoading, setIsAstrologersLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        serviceType: '',
        serviceMood: 'consult-online',
        pandit: '',
        fullName: '',
        mobileNumber: '',
        emailAddress: '',
        timeSlot: '',
        selectedDate: null
    });

    // User details population
    useEffect(() => {
        if (loggedUserDetails) {
            setFormData(prev => ({
                ...prev,
                fullName: `${loggedUserDetails.firstName || ''} ${loggedUserDetails.lastName || ''}`.trim(),
                mobileNumber: loggedUserDetails.mobileNo || '',
                emailAddress: loggedUserDetails.email || ''
            }));
        }
    }, [loggedUserDetails]);

    // Calendar state
    const [selectedDate, setSelectedDate] = useState(null);

    // Static options
    const serviceMoodOptions = useMemo(() => [
        { value: 'consult-online', label: 'Consult Online' },
        { value: 'consult-pandit-location', label: 'Consult at Pandit location' },
        { value: 'pooja-at-home', label: 'Pooja at Home' }
    ], []);

    const timeSlots = useMemo(() => [
        '09:00 AM - 12:00 PM',
        '12:00 PM - 03:00 PM',
        '03:00 PM - 06:00 PM',
        '06:00 PM - 09:00 PM'
    ], []);

    // Astrologer options
    const panditOptions = useMemo(() => {
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
        if (services.length > 0 || isServicesLoading) return; // Don't refetch if already loaded or loading

        try {
            setIsServicesLoading(true);
            setError(null);
            const response = await getServicesList();
            if (response?.success && response?.data) {
                const allServices = response.data.flatMap(category =>
                    category.services.map(service => ({
                        value: service._id,
                        label: service.name
                    }))
                );
                setServices(allServices);
            } else {
                setError('Failed to load services. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to load services. Please try again.');
        } finally {
            setIsServicesLoading(false);
        }
    }, [services.length, isServicesLoading]);

    // Fetch astrologers
    const fetchAstrologers = useCallback(async () => {
        if (astrologers.length > 0 || isAstrologersLoading) return; // Don't refetch if already loaded or loading

        try {
            setIsAstrologersLoading(true);
            setError(null);
            const response = await getAstrologers();
            if (response?.success && response?.data) {
                setAstrologers(response.data);
            } else {
                setError('Failed to load astrologers. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching astrologers:', error);
            setError('Failed to load astrologers. Please try again.');
        } finally {
            setIsAstrologersLoading(false);
        }
    }, [astrologers.length, isAstrologersLoading]);

    // Authentication check
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
        setFormData(prev => ({
            ...prev,
            serviceType: serviceData?._id || ''
        }));
        setIsLoading(false);
    }, [isLogged, authLoading, serviceData, navigate]);

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

    // Form validation
    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.serviceType) errors.serviceType = 'Service type is required';
        if (!formData.selectedDate) errors.selectedDate = 'Date is required';
        if (!formData.timeSlot) errors.timeSlot = 'Time slot is required';
        if (!formData.pandit) errors.pandit = 'Pandit selection is required';
        return errors;
    }, [formData]);

    // Form input handler
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // Date selection handler for react-calendar
    const handleDateSelect = useCallback((date) => {
        console.log('Date selected:', date);
        console.log('Date type:', typeof date);
        console.log('Date string:', date?.toString());
        console.log('Date ISO:', date?.toISOString());

        setSelectedDate(date);
        setFormData(prev => ({
            ...prev,
            selectedDate: date,
            // Clear time slot when changing date
            timeSlot: date ? prev.timeSlot : ''
        }));
    }, []);

    // Booking handler with validation
    const handleBookService = useCallback(async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Format the date for submission (ISO string)
            const bookingData = {
                ...formData,
                selectedDate: formData.selectedDate.toISOString(),
                // Format the date for display in the confirmation
                formattedDate: formData.selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            };

            console.log('Booking data:', bookingData);

            alert(`Service booked for ${bookingData.formattedDate} at ${bookingData.timeSlot}`);
        } catch (error) {
            console.error('Booking error:', error);
            setError('Failed to book service. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm]);


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
                title="Booking Calender"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: "Book Now", href: "#" }
                ]}
                backgroundPosition="center 73%"
                backgroundSize="100%"
            />

            <div className="min-h-screen py-8">
                <div className="container mx-auto px-2 sm:px-3 max-w-7xl">
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
                    <div className="bg-white rounded-2xl shadow-lg px-4 sm:px-6 py-6 sm:py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="space-y-6">
                                {/* Services Type */}
                                <Select
                                    id="serviceType"
                                    label="Services Type"
                                    value={formData.serviceType}
                                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                                    options={serviceOptions}
                                    required
                                    disabled={isServicesLoading}
                                    isLoading={isServicesLoading}
                                />

                                {/* Select Service Mood */}
                                <div>
                                    <label className="block text-sm font-medium mb-3" style={{ color: '#62748E' }}>
                                        Select Service Mood <span class="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                                        {serviceMoodOptions.map((option) => (
                                            <label key={option.value} className="flex items-center cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="serviceMood"
                                                        value={option.value}
                                                        checked={formData.serviceMood === option.value}
                                                        onChange={(e) => handleInputChange('serviceMood', e.target.value)}
                                                        className="absolute opacity-0 w-0 h-0"
                                                    />
                                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${formData.serviceMood === option.value ? 'border-[#FF8835]' : 'border-[#E2E8F0]'}`}>
                                                        {formData.serviceMood === option.value && (
                                                            <span className="w-2 h-2 bg-[#FF8835] rounded-full"></span>
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="ml-2 sm:ml-3 text-gray-700 text-xs sm:text-sm">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Select Pandit */}
                                <Select
                                    id="pandit"
                                    label="Select Pandit"
                                    value={formData.pandit}
                                    onChange={(e) => handleInputChange('pandit', e.target.value)}
                                    options={panditOptions}
                                    required
                                    placeholder="Select a pandit"
                                    disabled={isAstrologersLoading}
                                    isLoading={isAstrologersLoading}
                                />

                                {/* Full Name and Mobile Number in one row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <Input
                                        id="fullName"
                                        label="Full Name"
                                        type="text"
                                        value={formData.fullName}
                                        readOnly
                                        className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                                    />

                                    {/* Mobile Number */}
                                    <Input
                                        id="mobileNumber"
                                        label="Mobile Number"
                                        type="tel"
                                        value={formData.mobileNumber}
                                        readOnly
                                        className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                                    />
                                </div>

                                {/* Email Address */}
                                <div>
                                    <Input
                                        id="emailAddress"
                                        label="Email Address"
                                        type="email"
                                        value={formData.emailAddress}
                                        readOnly
                                        className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                                    />
                                </div>
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
                                <Select
                                    id="timeSlot"
                                    label="Time Slots"
                                    value={formData.timeSlot}
                                    onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                                    options={timeSlots}
                                    required
                                    disabled={!selectedDate}
                                />
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="flex justify-center mt-4">
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Book Service Button */}
                        <div className="flex justify-center mt-8 w-full px-4">
                            <button
                                onClick={handleBookService}
                                disabled={isSubmitting}
                                className={`bg-button-diagonal-gradient-orange text-white py-3 rounded-[0.2rem] font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 w-full max-w-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'Booking...' : 'Book Service'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingCalendar;
