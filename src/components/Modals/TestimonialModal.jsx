import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CloseCircle, DocumentUpload } from 'iconsax-reactjs';
import LoadBox from '../Loader/LoadBox';
import TextInput from '../TextInput/TextInput';
import { createTestimonial, getServiceDropdown, getProductCategoriesWithProductsPublic, uploadToCloudinary } from '../../api';
import { formBtn1 } from '../../utils/CustomClass';

function TestimonialModal({ open, setOpen }) {
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            testimonial_for: '',
            service_id: '',
            product_id: '',
            message: '',
            city: '',
            state: '',
            country: ''
        }
    });

    const { loggedUserDetails, isLogged } = useSelector(state => state.user);
    const [loader, setLoader] = useState(false);
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);

    const city = watch('city');
    const testimonialFor = watch('testimonial_for');

    // Clear service/product selection when testimonial type changes
    useEffect(() => {
        if (testimonialFor === 'service') {
            setValue('product_id', '');
        } else if (testimonialFor === 'product') {
            setValue('service_id', '');
        }
    }, [testimonialFor, setValue]);

    const toggle = () => {
        setOpen(!open);
        reset();
        setMediaFiles([]);
        setMediaPreviews([]);
    };

    // Auto-fill state and country based on city
    useEffect(() => {
        const fetchCityDetails = async () => {
            if (!city || city.trim().length < 3) {
                return;
            }

            const cityName = city.trim();
            setCityLoading(true);

            try {
                const res = await fetch(`https://api.postalpincode.in/postoffice/${cityName}`);
                const data = await res.json();

                if (data[0]?.Status === "Success") {
                    const postOffice = data[0].PostOffice?.[0];
                    if (postOffice) {
                        setValue("state", postOffice.State, { shouldValidate: true });
                        setValue("country", "India", { shouldValidate: true });
                    }
                } else {
                    console.log("City not found or invalid.");
                }
            } catch (err) {
                console.error("City API error:", err);
            } finally {
                setCityLoading(false);
            }
        };

        // Debounce the API call
        const timeoutId = setTimeout(() => {
            fetchCityDetails();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [city, setValue]);

    // Fetch services and products dropdowns
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [servicesRes, productsRes] = await Promise.all([
                    getServiceDropdown(),
                    getProductCategoriesWithProductsPublic()
                ]);

                if (servicesRes?.success) {
                    setServices(servicesRes.data || []);
                }
                if (productsRes?.success) {
                    // Flatten products from categories
                    const allProducts = productsRes.data?.reduce((acc, category) => {
                        if (category.products && category.products.length > 0) {
                            return [...acc, ...category.products];
                        }
                        return acc;
                    }, []) || [];
                    setProducts(allProducts);
                }
            } catch (error) {
                console.error('Error fetching dropdowns:', error);
            }
        };

        if (open) {
            fetchDropdowns();
        }
    }, [open]);

    // Handle media file selection
    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [...mediaFiles, ...files];

        // Create previews
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            file: file
        }));

        setMediaFiles(newFiles);
        setMediaPreviews([...mediaPreviews, ...newPreviews]);
    };

    // Remove media file
    const removeMedia = (index) => {
        const newFiles = mediaFiles.filter((_, i) => i !== index);
        const newPreviews = mediaPreviews.filter((_, i) => i !== index);

        // Revoke object URL to free memory
        URL.revokeObjectURL(mediaPreviews[index].url);

        setMediaFiles(newFiles);
        setMediaPreviews(newPreviews);
    };

    const formSubmit = async (data) => {
        if (!isLogged) {
            toast.error('Please login to share your experience');
            return;
        }

        try {
            setLoader(true);

            // Create FormData
            const formData = new FormData();
            formData.append('user_id', loggedUserDetails?._id);
            formData.append('service_id', data.service_id || '');
            formData.append('product_id', data.product_id || '');
            formData.append('message', data.message);
            formData.append('city', data.city);
            formData.append('state', data.state);
            formData.append('country', data.country);

            // Separate images and videos
            mediaFiles.forEach(file => {
                if (file.type.startsWith('image/')) {
                    formData.append('images', file);
                } else if (file.type.startsWith('video/')) {
                    formData.append('videos', file);
                }
            });

            const res = await createTestimonial(formData);

            if (res?.success) {
                toast.success(res?.message || 'Thank you for sharing your experience!');
                setLoader(false);
                toggle();
            } else {
                toast.error(res?.message || 'Something went wrong');
                setLoader(false);
            }
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            setLoader(false);
            toast.error('Failed to submit testimonial');
        }
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={toggle}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-[2.3px] bg-black/20" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto scrollbars">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                                        Share Your Experience
                                    </Dialog.Title>
                                    <button
                                        onClick={toggle}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit(formSubmit)} className="bg-white">
                                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto scrollbars">
                                        {/* Write Testimonials For */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Write Testimonials for <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                {...register('testimonial_for', {
                                                    required: 'Please select what you want to write testimonials for'
                                                })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                            >
                                                <option value="">-- Select Type --</option>
                                                <option value="service">Service</option>
                                                <option value="product">Product</option>
                                            </select>
                                            {errors.testimonial_for && (
                                                <p className="mt-1 text-sm text-red-600">{errors.testimonial_for.message}</p>
                                            )}
                                        </div>

                                        {/* Service Selection - Show only if 'service' is selected */}
                                        {testimonialFor === 'service' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Service <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    {...register('service_id', {
                                                        validate: (value) => {
                                                            if (testimonialFor === 'service' && !value) {
                                                                return 'Please select a service';
                                                            }
                                                            return true;
                                                        }
                                                    })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                >
                                                    <option value="">-- Select a Service --</option>
                                                    {services.map((service) => (
                                                        <option key={service._id} value={service._id}>
                                                            {service.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.service_id && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.service_id.message}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Product Selection - Show only if 'product' is selected */}
                                        {testimonialFor === 'product' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Product <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    {...register('product_id', {
                                                        validate: (value) => {
                                                            if (testimonialFor === 'product' && !value) {
                                                                return 'Please select a product';
                                                            }
                                                            return true;
                                                        }
                                                    })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                >
                                                    <option value="">-- Select a Product --</option>
                                                    {products.map((product) => (
                                                        <option key={product._id} value={product._id}>
                                                            {product.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.product_id && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.product_id.message}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Experience <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                {...register('message', {
                                                    required: 'Message is required',
                                                    minLength: { value: 10, message: 'Message must be at least 10 characters' }
                                                })}
                                                rows={4}
                                                placeholder="Share your experience with us..."
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                                            />
                                            {errors.message && (
                                                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                            )}
                                        </div>

                                        {/* Media Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Upload Photos/Videos (Optional)
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-400 transition-colors">
                                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                                    <DocumentUpload size={32} className="text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-600">Click to upload images or videos</span>
                                                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, MP4, MOV up to 10MB</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*,video/*"
                                                        onChange={handleMediaChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            {/* Media Previews */}
                                            {mediaPreviews.length > 0 && (
                                                <div className="mt-4 grid grid-cols-3 gap-3">
                                                    {mediaPreviews.map((preview, index) => (
                                                        <div key={index} className="relative group">
                                                            {preview.type === 'image' ? (
                                                                <img
                                                                    src={preview.url}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="w-full h-24 object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <video
                                                                    src={preview.url}
                                                                    className="w-full h-24 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMedia(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <CloseCircle size={20} variant="Bold" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* City, State and Country */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        {...register('city', { required: 'City is required' })}
                                                        placeholder="Enter your city"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                    />
                                                    {cityLoading && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.city && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('state', { required: 'State is required' })}
                                                    placeholder="Enter your state"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                />
                                                {errors.state && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Country */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                {...register('country', { required: 'Country is required' })}
                                                placeholder="Enter your country"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                            />
                                            {errors.country && (
                                                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={toggle}
                                            className="px-6 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            disabled={loader || uploadingMedia}
                                        >
                                            Cancel
                                        </button>
                                        {loader || uploadingMedia ? (
                                            <LoadBox className={formBtn1} />
                                        ) : (
                                            <button
                                                type="submit"
                                                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                            >
                                                Submit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default TestimonialModal;