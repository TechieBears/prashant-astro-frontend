import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { Input, Select } from '../Form';
import { getServicesList, getAllAstrologer, checkAvailability, getServiceCartItems } from '../../api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../css/react-calendar.css';

const EditServiceModal = ({
    isOpen,
    onClose,
    serviceData,
    onUpdateService
}) => {
    // State management
    const [services, setServices] = useState([]);
    const [allServicesData, setAllServicesData] = useState([]);
    const [astrologers, setAstrologers] = useState([]);
    const [availability, setAvailability] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { control, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            serviceType: '',
            serviceMode: 'online',
            astrologer: '',
            timeSlot: '',
            selectedDate: null
        }
    });

    // Watch form values with debounce to prevent multiple calls
    const watchedAstrologer = watch('astrologer');
    const watchedDate = watch('selectedDate');
    const watchedServiceType = watch('serviceMode');

    // Track if we've already processed the initial data
    const hasProcessedInitialData = React.useRef(false);

    // Memoized options
    const serviceModeOptions = useMemo(() => [
        { value: 'online', label: 'Consult Online' },
        { value: 'pandit_center', label: 'Consult at Astrologer location' },
        { value: 'pooja_at_home', label: 'Pooja at Home' }
    ], []);

    const timeSlots = useMemo(() => {
        if (!availability?.data?.timeSlots) return [];
        return availability.data.timeSlots
            .filter(slot => slot.status === 'available')
            .map(slot => ({
                value: slot.time,
                label: `${slot.display_time} - ${slot.display_end_time}`
            }));
    }, [availability]);

    const astrologerOptions = useMemo(() =>
        astrologers.map(astrologer => ({
            value: astrologer._id,
            label: astrologer.fullName
        })), [astrologers]);

    // Track if we need to reset the form
    const shouldResetForm = useRef(true);
    const isFetchingData = useRef(false);

    // Consolidated data fetching
    const fetchData = useCallback(async () => {
        if (!isOpen || isFetchingData.current) return;

        isFetchingData.current = true;
        setIsLoading(true);
        hasProcessedInitialData.current = false;

        // Check if we need to preserve the form state
        const shouldPreserveState = !shouldResetForm.current;
        shouldResetForm.current = false;

        try {
            const [servicesRes, astrologersRes, latestServiceData] = await Promise.all([
                getServicesList(),
                getAllAstrologer(),
                serviceData?.id ? getServiceCartItems() : Promise.resolve(null)
            ]);

            // Set services
            if (servicesRes?.success && servicesRes?.data) {
                const allServices = servicesRes.data.flatMap(category =>
                    category.services.map(service => ({
                        value: service._id,
                        label: service.name
                    }))
                );
                const completeServicesData = servicesRes.data.flatMap(category => category.services);
                setServices(allServices);
                setAllServicesData(completeServicesData);
            }

            // Set astrologers
            if (astrologersRes?.success && astrologersRes?.data) {
                setAstrologers(astrologersRes.data);
            }

            // Initialize form with latest data
            if (serviceData) {
                const latestItem = latestServiceData?.success
                    ? latestServiceData.data.items.find(item => item._id === serviceData.id)
                    : null;
                const dataToUse = latestItem || serviceData;

                // Only reset if we're not preserving state
                if (!shouldPreserveState) {
                    reset();
                    setSelectedDate(null);
                    setAvailability(null);
                }
                hasProcessedInitialData.current = false;

                // Set form values
                setValue('serviceType', dataToUse.serviceId || '');
                const serviceMode = dataToUse.serviceMode || 'online';
                setValue('serviceMode', serviceMode);

                // Handle astrologer (object or string)
                const astrologerId = typeof dataToUse.astrologer === 'object'
                    ? dataToUse.astrologer._id
                    : dataToUse.astrologer;

                // Set the astrologer value
                setValue('astrologer', astrologerId || '');

                // Handle date and time slot together
                if (dataToUse.date) {
                    const date = typeof dataToUse.date === 'string'
                        ? new Date(dataToUse.date)
                        : dataToUse.date;

                    setSelectedDate(date);
                    setValue('selectedDate', date);

                    // Set time slot immediately if we have the data
                    let timeSlotValue = '';
                    if (dataToUse.timeSlot) {
                        timeSlotValue = dataToUse.timeSlot;
                    } else if (dataToUse.startTime && dataToUse.endTime) {
                        timeSlotValue = `${dataToUse.startTime} - ${dataToUse.endTime}`;
                    }

                    if (timeSlotValue) {
                        // Add the time slot to the available slots if it doesn't exist
                        setAvailability(prev => {
                            const timeSlots = prev?.data?.timeSlots || [];
                            const slotExists = timeSlots.some(slot =>
                                slot.time === timeSlotValue ||
                                `${slot.display_time} - ${slot.display_end_time}` === timeSlotValue
                            );

                            if (!slotExists && timeSlotValue.includes(' - ')) {
                                const [startTime, endTime] = timeSlotValue.split(' - ');
                                return {
                                    ...(prev || {}),
                                    data: {
                                        ...(prev?.data || {}),
                                        timeSlots: [
                                            ...timeSlots,
                                            {
                                                time: timeSlotValue,
                                                display_time: startTime,
                                                display_end_time: endTime,
                                                status: 'available'
                                            }
                                        ]
                                    }
                                };
                            }
                            return prev;
                        });

                        // Use setTimeout to ensure the time slot is available in the dropdown
                        setTimeout(() => {
                            setValue('timeSlot', timeSlotValue);
                        }, 100);
                    }

                    // Only fetch availability if we don't have a time slot and we have required data
                    if (astrologerId && dataToUse.serviceId && !timeSlotValue) {
                        await checkAstrologerAvailability(date, astrologerId, serviceMode, true);
                    }
                }

                hasProcessedInitialData.current = true;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
            isFetchingData.current = false;
        }
    }, [isOpen, serviceData, setValue, reset]);

    // Check astrologer availability
    const checkAstrologerAvailability = useCallback(async (date, astrologerId, serviceType, isInitialLoad = false) => {
        if (!date || !astrologerId || !serviceType) return;
        if (isInitialLoad && hasProcessedInitialData.current) return; // Skip if already processed

        const currentTimeSlot = watch('timeSlot');
        // If we already have a time slot and this isn't a forced refresh, keep it
        if (currentTimeSlot && !isInitialLoad) {
            return;
        }

        setIsLoading(true);
        try {
            const formattedDate = date.toLocaleDateString('en-CA');
            const payload = {
                date: formattedDate,
                astrologer_id: astrologerId,
                service_type: serviceType === 'pooja_at_home' ? 'offline' : 'online',
                service_duration: 60
            };

            const response = await checkAvailability(payload);

            if (response?.success) {
                // Ensure we have time slots in the response
                const updatedResponse = {
                    ...response,
                    data: {
                        ...response.data,
                        timeSlots: response.data?.timeSlots || []
                    }
                };
                setAvailability(updatedResponse);

                // If we have a time slot value in the form but not in the response, add it
                const currentTimeSlot = watch('timeSlot');
                if (currentTimeSlot && !updatedResponse.data.timeSlots.some(slot =>
                    `${slot.display_time} - ${slot.display_end_time}` === currentTimeSlot ||
                    slot.time === currentTimeSlot
                )) {
                    // Add the current time slot to the available slots if it's not already there
                    const [startTime, endTime] = currentTimeSlot.split(' - ');
                    updatedResponse.data.timeSlots.push({
                        time: currentTimeSlot,
                        display_time: startTime,
                        display_end_time: endTime,
                        status: 'available'
                    });
                    setAvailability({ ...updatedResponse });
                }
            } else {
                setAvailability(null);
                toast.error(response?.message || 'No availability found');
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailability(null);
            toast.error('Failed to check availability');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle date selection
    const handleDateSelect = useCallback((date) => {
        const currentTimeSlot = watch('timeSlot');
        const currentDate = watch('selectedDate');

        // Only update if the date actually changed
        if (!currentDate || date.getTime() !== currentDate.getTime()) {
            setSelectedDate(date);
            setValue('selectedDate', date);

            // Only clear the time slot if the date changed
            if (currentTimeSlot) {
                setValue('timeSlot', '');
            }
        }
    }, [setValue, selectedDate, watch]);

    // Main effects
    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!watchedDate || !watchedAstrologer || !watchedServiceType) return;

        const currentTimeSlot = watch('timeSlot');
        const currentServiceMode = watch('serviceMode');

        // Skip if we already have a time slot and the service mode hasn't changed
        if (currentTimeSlot && currentServiceMode === watchedServiceType) {
            return;
        }

        // Skip if this is the initial load and we've already processed it
        if (hasProcessedInitialData.current) {
            checkAstrologerAvailability(watchedDate, watchedAstrologer, watchedServiceType);
        } else {
            hasProcessedInitialData.current = true;
        }
    }, [watchedDate, watchedAstrologer, watchedServiceType, checkAstrologerAvailability]);

    useEffect(() => {
        if (watchedServiceType && allServicesData.length) {
            const selectedService = allServicesData.find(service => service._id === watchedServiceType);
            if (selectedService?.serviceType) {
                setValue('serviceMode', selectedService.serviceType);
            }
        }
    }, [watchedServiceType, allServicesData, setValue]);

    const onSubmit = useCallback(async (data) => {
        try {
            // Validate required fields
            if (!data.selectedDate || !data.timeSlot || !data.astrologer) {
                toast.error('Please fill in all required fields');
                return;
            }

            // Parse timeSlot to extract startTime and endTime
            const [startTime, endTime] = data.timeSlot.split(' - ');

            // Prepare updated service data
            const updatedServiceData = {
                ...serviceData,
                serviceId: data.serviceType,
                serviceMode: data.serviceMode,
                astrologer: data.astrologer,
                timeSlot: data.timeSlot,
                startTime,
                endTime,
                date: data.selectedDate.toLocaleDateString('en-CA')
            };

            onUpdateService(updatedServiceData);
            onClose();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Failed to update service. Please try again.');
        }
    }, [serviceData, onUpdateService, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Service</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form key={serviceData?.id || 'new'} onSubmit={handleSubmit(onSubmit)} className="p-4">
                    <div className="space-y-4">
                        {/* Service Type - Read-only Display */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#62748E' }}>
                                Service Type
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-sm text-gray-700">
                                    {services.find(service => service.value === watch('serviceType'))?.label || 'Loading...'}
                                </span>
                            </div>
                        </div>

                        {/* Service Mode - Compact Display */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#62748E' }}>
                                Service Mode
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-sm text-gray-700">
                                    {serviceModeOptions.find(opt => opt.value === watch('serviceMode'))?.label || 'Consult Online'}
                                </span>
                            </div>
                        </div>

                        {/* Astrologer Selection */}
                        <Controller
                            name="astrologer"
                            control={control}
                            rules={{ required: 'Astrologer selection is required' }}
                            render={({ field }) => (
                                <Select
                                    key={`astrologer-${astrologers.length}-${serviceData?.id || 'new'}`}
                                    id="astrologer"
                                    label="Select Astrologer"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={astrologerOptions}
                                    required
                                    placeholder="Select an astrologer"
                                    disabled={isLoading}
                                    isLoading={isLoading}
                                />
                            )}
                        />
                        {errors.astrologer && (
                            <p className="text-red-500 text-sm mt-1">{errors.astrologer.message}</p>
                        )}

                        {/* Date Selection - Compact */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#62748E' }}>
                                Select Date
                            </label>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <Calendar
                                    onChange={handleDateSelect}
                                    value={selectedDate}
                                    minDate={new Date()}
                                    className="react-calendar-custom w-full"
                                    tileClassName="text-xs"
                                    style={{
                                        fontSize: '12px',
                                        lineHeight: '1.2'
                                    }}
                                />
                            </div>
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

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-white rounded-lg transition-colors text-sm ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-button-gradient-orange hover:opacity-90'
                                }`}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceModal;
