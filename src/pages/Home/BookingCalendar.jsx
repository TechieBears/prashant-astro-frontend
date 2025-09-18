import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Calendar from '../../components/Calendar';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import { Input, Select } from '../../components/Form';
import { getServicesList } from '../../api';

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

    // Separate effect for user details population
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
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Memoized static options to prevent recreation on every render
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

    const panditOptions = useMemo(() => [
        'Pandit Rajesh Kumar',
        'Pandit Suresh Sharma',
        'Pandit Amit Verma',
        'Pandit Deepak Singh'
    ], []);

    // Memoized service options to prevent recreation on every render
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

    // Optimized fetch services with caching
    const fetchServices = useCallback(async () => {
        if (services.length > 0) return; // Don't refetch if already loaded

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
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to load services. Please try again.');
        } finally {
            setIsServicesLoading(false);
        }
    }, [services.length]);

    // Authentication check effect
    useEffect(() => {
        if (authLoading) return;

        if (!isLogged) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return;
        }
    }, [isLogged, authLoading, navigate]);

    // Service data initialization effect
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

    // Services fetching effect
    useEffect(() => {
        if (!isLogged || authLoading) return;
        fetchServices();
    }, [isLogged, authLoading, fetchServices]);

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

    // Memoized form validation
    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.serviceType) errors.serviceType = 'Service type is required';
        if (!formData.selectedDate) errors.selectedDate = 'Date is required';
        if (!formData.timeSlot) errors.timeSlot = 'Time slot is required';
        if (!formData.pandit) errors.pandit = 'Pandit selection is required';
        return errors;
    }, [formData]);

    // Memoized form input handler
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // Memoized month navigation handler
    const handleMonthChange = useCallback((direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else if (direction === 'next') {
                newMonth.setMonth(prev.getMonth() + 1);
            } else if (direction === 'prev-year') {
                newMonth.setFullYear(prev.getFullYear() - 1);
            } else if (direction === 'next-year') {
                newMonth.setFullYear(prev.getFullYear() + 1);
            }
            return newMonth;
        });
    }, []);

    // Memoized date selection handler
    const handleDateSelect = useCallback((date) => {
        const newSelectedDate = selectedDate && date.toDateString() === selectedDate.toDateString()
            ? null
            : date;

        setSelectedDate(newSelectedDate);
        setFormData(prev => ({
            ...prev,
            selectedDate: newSelectedDate,
            // Clear time slot when changing date
            timeSlot: newSelectedDate ? prev.timeSlot : ''
        }));
    }, [selectedDate]);

    // Optimized booking handler with validation
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
            // TODO: Replace with actual API call
            // await bookService(bookingData);

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
            <style jsx>{`
                select {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }
            `}</style>

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
                    <div className="flex items-center justify-between my-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Go Back
                        </button>

                        <h1 className="text-2xl font-md text-center text-gray-800">
                            Booking Calendar
                        </h1>

                        {/* Empty div for balance */}
                        <div className="w-20"></div>
                    </div>

                    {/* Main Booking Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
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
                                    <div className="flex gap-6">
                                        {serviceMoodOptions.map((option) => (
                                            <label key={option.value} className="flex items-center cursor-pointer whitespace-nowrap">
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
                                                <span className="ml-3 text-gray-700 text-sm">{option.label}</span>
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
                                <Calendar
                                    currentMonth={currentMonth}
                                    selectedDate={selectedDate}
                                    onDateSelect={handleDateSelect}
                                    onMonthChange={handleMonthChange}
                                />

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
