import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

    const { control, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            serviceType: '',
            serviceMode: 'online',
            astrologer: '',
            timeSlot: '',
            selectedDate: null
        }
    });

    // Watch form values
    const watchedAstrologer = watch('astrologer');
    const watchedDate = watch('selectedDate');
    const watchedServiceType = watch('serviceType');

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

    // Consolidated data fetching
    const fetchData = useCallback(async () => {
        if (!isOpen) return;

        setIsLoading(true);
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
            if (serviceData && latestServiceData?.success) {
                const latestItem = latestServiceData.data.items.find(item => item._id === serviceData.id);
                const dataToUse = latestItem || serviceData;

                reset();
                setSelectedDate(null);
                setAvailability(null);

                // Set form values
                setValue('serviceType', dataToUse.serviceId || '');
                setValue('serviceMode', dataToUse.serviceMode || 'online');

                // Handle astrologer (object or string)
                const astrologerId = typeof dataToUse.astrologer === 'object'
                    ? dataToUse.astrologer._id
                    : dataToUse.astrologer;
                setValue('astrologer', astrologerId || '');

                // Handle time slot
                let timeSlotValue = dataToUse.timeSlot || '';
                if (dataToUse.startTime && dataToUse.endTime && !timeSlotValue) {
                    timeSlotValue = `${dataToUse.startTime} - ${dataToUse.endTime}`;
                }
                setValue('timeSlot', timeSlotValue);

                // Handle date
                if (dataToUse.date) {
                    const date = new Date(dataToUse.date);
                    setSelectedDate(date);
                    setValue('selectedDate', date);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, serviceData, setValue, reset]);

    // Check availability
    const checkAstrologerAvailability = useCallback(async (date, astrologerId, serviceType) => {
        if (!date || !astrologerId || !serviceType) return;

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
                setAvailability(response);
            } else {
                setAvailability(null);
                toast.error(response?.message || 'No availability found');
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailability(null);
            toast.error('Failed to check availability');
        }
    }, []);

    // Date selection handler
    const handleDateSelect = useCallback((date) => {
        setSelectedDate(date);
        setValue('selectedDate', date);
        setValue('timeSlot', '');
    }, [setValue]);

    // Main effects
    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, fetchData]);

    useEffect(() => {
        if (watchedAstrologer && watchedDate && watchedServiceType) {
            const selectedService = allServicesData.find(service => service._id === watchedServiceType);
            if (selectedService) {
                checkAstrologerAvailability(watchedDate, watchedAstrologer, selectedService.serviceType);
            }
        }
    }, [watchedAstrologer, watchedDate, watchedServiceType, allServicesData, checkAstrologerAvailability]);

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
