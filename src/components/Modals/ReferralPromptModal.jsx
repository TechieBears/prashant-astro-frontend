import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInput from '../TextInput/TextInput';
import toast from 'react-hot-toast';
import { updateCustomerProfile } from '../../api';
import { useSelector, useDispatch } from 'react-redux';
import { validateAlphabets } from '../../utils/validateFunction';
import { X, CheckCircle, Gift, User, Phone, Users, CheckSquare, Square } from 'lucide-react';
import LoadBox from '../Loader/LoadBox';
import SelectTextInput from '../TextInput/SelectTextInput';
import { setUserDetails, setIsRegistered } from '../../redux/Slices/loginSlice';


function ReferralPromptModal({ open, toggle, forceProfileScreen = false, onModalClose }) {
    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            mobileNo: '',
            gender: '',
            referralCode: ''
        }
    });
    const user = useSelector(state => state.user.userDetails);
    const isRegistered = useSelector(state => state.user.isRegistered);
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [showOnlyReferral, setShowOnlyReferral] = useState(true);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const isProfileComplete = user?.firstName && user?.lastName && user?.mobileNo && user?.gender;

    useEffect(() => {
        if (open && user) {
            const formData = {
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                mobileNo: user?.mobileNo || '',
                gender: user?.gender || '',
                referralCode: ''
            };

            reset(formData);
            if (forceProfileScreen) {
                setShowOnlyReferral(false);
            } else {
                setShowOnlyReferral(true);
            }
        }
    }, [open, user, reset, forceProfileScreen]);

    // Additional effect to ensure form values are set when user data changes
    useEffect(() => {
        if (user && open) {
            console.log('Setting individual form values:', {
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                mobileNo: user?.mobileNo || '',
                gender: user?.gender || ''
            });
            setValue('firstName', user?.firstName || '');
            setValue('lastName', user?.lastName || '');
            setValue('mobileNo', user?.mobileNo || '');
            setValue('gender', user?.gender || '');
        }
    }, [user, setValue, open]);

    const formSubmit = async (data) => {
        console.log('Form submitted with data:', data);
        console.log('Current showOnlyReferral state:', showOnlyReferral);

        try {
            setLoader(true);
            const payload = {
                ...data
            };

            const res = await updateCustomerProfile(payload);
            console.log('API response:', res);

            if (res?.success) {
                dispatch(setUserDetails(res?.data?.user || res?.data));

                if (showOnlyReferral) {
                    // Check if profile is complete, if yes, close modal directly
                    if (isProfileComplete) {
                        console.log('Profile already complete, closing modal');
                        dispatch(setIsRegistered(false));
                        onModalClose?.();
                        toggle();
                        toast.success('Referral code added successfully!');
                        reset();
                    } else {
                        console.log('Moving to profile screen');
                        toast.success('Referral code added! Now complete your profile.');
                        setTimeout(() => {
                            setShowOnlyReferral(false);
                        }, 100);
                    }
                } else {
                    // Profile completion - close modal
                    console.log('Closing modal after profile completion');
                    dispatch(setIsRegistered(false));
                    onModalClose?.();
                    toggle();
                    toast.success('Profile completed successfully!');
                    reset();
                }
            } else {
                console.log('API call failed:', res?.message);
                toast.error(res?.message || "Something went wrong");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (!open) {
            setShowOnlyReferral(true);
            setDontShowAgain(false);
        }
    }, [open]);

    const validatePhoneNumber = (value) => {
        if (!value) return true;
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(value) || 'Phone number must be 10 digits';
    };

    // Don't show modal if isRegistered is false
    if (!isRegistered) {
        return null;
    }

    return (
        <>
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={() => toggle()}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 backdrop-blur-[2.3px] bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                    {/* Header */}
                                    <div className="relative bg-button-gradient-orange px-6 py-8">
                                        <button
                                            onClick={() => {
                                                dispatch(setIsRegistered(false));
                                                onModalClose?.();
                                                toggle();
                                            }}
                                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all"
                                        >
                                            <X size={24} className="text-white" />
                                        </button>

                                        <div className="flex items-center gap-3 mb-2">
                                            {showOnlyReferral ? (
                                                <>
                                                    <Gift size={28} className="text-yellow-300" />
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white">Enter Referral Code</h2>
                                                </>
                                            ) : (
                                                <>
                                                    <User size={28} className="text-yellow-300" />
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white">Complete Your Profile</h2>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-primary-light text-sm">
                                            {showOnlyReferral
                                                ? 'Got a referral code? Enter it here to unlock rewards!'
                                                : 'Please fill in your details to continue'}
                                        </p>
                                    </div>

                                    {/* Form Container */}
                                    <div className="p-6 md:p-8">
                                        {/* Progress Bar */}
                                        {!showOnlyReferral && (
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                                                    <span className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full">
                                                        {isProfileComplete ? '100%' : '0%'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className="bg-button-gradient-orange h-full rounded-full transition-all duration-500"
                                                        style={{ width: isProfileComplete ? '100%' : '0%' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit(formSubmit)}>
                                            {showOnlyReferral ? (
                                                // Referral Code First Screen
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            <Gift size={16} className="inline mr-2 text-yellow-500" />
                                                            Referral Code <span className="text-gray-400">(Optional)</span>
                                                        </label>
                                                        <TextInput
                                                            placeholder="Enter a referral code to earn rewards"
                                                            type="text"
                                                            registerName="referralCode"
                                                            props={{
                                                                ...register('referralCode'),
                                                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light transition-all uppercase"
                                                            }}
                                                            errors={errors.referralCode}
                                                        />
                                                    </div>

                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDontShowAgain(!dontShowAgain)}
                                                            className="flex items-center gap-3 w-full text-left hover:bg-amber-100/50 p-2 rounded transition-colors"
                                                        >
                                                            {dontShowAgain ? (
                                                                <CheckSquare size={20} className="text-primary flex-shrink-0" />
                                                            ) : (
                                                                <Square size={20} className="text-gray-400 flex-shrink-0" />
                                                            )}
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Don't show this again
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Profile Completion Form
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* First Name */}
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                First Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <TextInput
                                                                placeholder="Enter first name"
                                                                type="text"
                                                                registerName="firstName"
                                                                props={{
                                                                    ...register('firstName', {
                                                                        required: "First name is required",
                                                                        validate: validateAlphabets,
                                                                        minLength: { value: 2, message: "Minimum 2 characters" }
                                                                    }),
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                                                                }}
                                                                errors={errors.firstName}
                                                            />
                                                        </div>

                                                        {/* Last Name */}
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Last Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <TextInput
                                                                placeholder="Enter last name"
                                                                type="text"
                                                                registerName="lastName"
                                                                props={{
                                                                    ...register('lastName', {
                                                                        required: "Last name is required",
                                                                        validate: validateAlphabets,
                                                                        minLength: { value: 2, message: "Minimum 2 characters" }
                                                                    }),
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                                                                }}
                                                                errors={errors.lastName}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Phone Number */}
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                <Phone size={16} className="inline mr-2" />
                                                                Phone Number <span className="text-red-500">*</span>
                                                            </label>
                                                            <TextInput
                                                                placeholder="10 digit phone number"
                                                                type="tel"
                                                                registerName="mobileNo"
                                                                props={{
                                                                    ...register('mobileNo', {
                                                                        validate: validatePhoneNumber,
                                                                        required: "Phone number is required"
                                                                    }),
                                                                    maxLength: 10,
                                                                    minLength: 10,
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                                                                }}
                                                                errors={errors.mobileNo}
                                                            />
                                                        </div>

                                                        {/* Gender */}
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                <Users size={16} className="inline mr-2" />
                                                                Gender <span className="text-red-500">*</span>
                                                            </label>
                                                            <div>
                                                                <SelectTextInput
                                                                    placeholder="Select Gender"
                                                                    registerName="gender"
                                                                    options={[
                                                                        { value: 'male', label: '👨 Male' },
                                                                        { value: 'female', label: '👩 Female' },
                                                                        { value: 'other', label: '🧑 Other' },
                                                                    ]}
                                                                    props={{
                                                                        ...register('gender', { required: "Gender is required" }),
                                                                        value: watch('gender') || ''
                                                                    }}
                                                                    errors={errors.gender}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Info Box */}
                                                    <div className="bg-primary-light border-l-4 border-primary p-4 rounded">
                                                        <p className="text-sm text-primary">
                                                            <CheckCircle size={16} className="inline mr-2 text-primary" />
                                                            Complete your profile to unlock exclusive referral rewards!
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3 pt-10">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (showOnlyReferral && dontShowAgain) {
                                                            localStorage.setItem(`dontShowReferralModal_${user?._id}`, 'true');
                                                        }
                                                        dispatch(setIsRegistered(false));
                                                        onModalClose?.();
                                                        toggle();
                                                    }}
                                                    className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                                                >
                                                    {showOnlyReferral ? 'Skip' : 'Cancel'}
                                                </button>
                                                {loader ? (
                                                    <div className="flex-1">
                                                        <LoadBox className="flex-1 w-full px-4 py-3 text-sm font-semibold text-white bg-button-gradient-orange rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer " />
                                                    </div>
                                                ) : (
                                                    <button
                                                        type='submit'
                                                        disabled={showOnlyReferral && !watch('referralCode')?.trim() && !isProfileComplete}
                                                        className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all shadow-md ${showOnlyReferral && !watch('referralCode')?.trim()
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'text-white bg-button-gradient-orange hover:opacity-90 hover:shadow-lg active:scale-95 cursor-pointer'
                                                            }`}
                                                    >
                                                        {showOnlyReferral ? 'Continue' : 'Complete Profile'}
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default ReferralPromptModal;