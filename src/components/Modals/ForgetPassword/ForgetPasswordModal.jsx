import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { ArrowPathIcon, EnvelopeIcon, ShieldCheckIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { validateEmail, validatePassword } from '../../../utils/validateFunction';
import TextInput from '../../TextInput/TextInput';
import { forgetUser, resetPassword } from '../../../api';

export default function ForgetPasswordModal({ open, setOpen }) {
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [serverOtp, setServerOtp] = useState(''); // Store the OTP received from server
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const otpInputs = useRef([]);


    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleOtpChange = (index, value) => {
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 3) {
                otpInputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').slice(0, 4);
        if (/^\d{4}$/.test(pasteData)) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            newOtp.forEach((digit, i) => {
                if (otpInputs.current[i]) {
                    otpInputs.current[i].value = digit;
                }
            });
            if (otpInputs.current[3]) {
                otpInputs.current[3].focus();
            }
        }
    };

    const submitEmail = async (data) => {
        setIsLoading(true);
        try {
            await forgetUser(data).then((res) => {
                console.log("⚡️🤯 ~ ForgetPasswordModal.jsx:64 ~ awaitforgetUser ~ res:", res)
                if (res?.message === "OTP sent to your email") {
                    toast.success("OTP sent successfully ✅");
                    setEmail(data.email);
                    setServerOtp(res.otp); // Store the OTP from server response
                    setStep(2);
                } else {
                    toast.error(res?.message || "Failed to send OTP");
                }
            });
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while sending OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const submitOtp = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            // Client-side verification (compare with server OTP)
            if (otpCode === serverOtp) {
                toast.success("OTP verified successfully");
                setStep(3);
            } else {
                toast.error("Invalid OTP. Please try again.");
            }

            // Or use API verification if available:
            // await verifyOtp({ email, otp: otpCode }).then((res) => {
            //     if (res?.success) {
            //         toast.success("OTP verified successfully");
            //         setStep(3);
            //     } else {
            //         toast.error(res?.message || "Invalid OTP");
            //     }
            // });
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while verifying OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const submitNewPassword = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({
                email,
                updatedPassword: data.newPassword,
            }).then((res) => {
                console.log("⚡️🤯 ~ ForgetPasswordModal.jsx:128 ~ submitNewPassword ~ res:", res)
                if (res?.message == "Password updated successfully") {
                    toast.success("Password updated successfully");
                    setOpen(false);
                    reset();
                    setStep(1);
                    setOtp(['', '', '', '']);
                } else {
                    toast.error(res?.message || "Failed to reset password");
                }
            });
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while resetting password");
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        setIsLoading(true);
        try {
            await forgetUser({ email }).then((res) => {
                if (res?.message === "OTP sent to your email") {
                    toast.success("New OTP sent successfully");
                    setServerOtp(res.otp);
                } else {
                    toast.error(res?.message || "Failed to resend OTP");
                }
            });
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while resending OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const cancelButtonRef = useRef(null);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setStep(1);
            setOtp(['', '', '', '']);
            reset();
        }, 300);
    };

    const StepIcon = ({ active, completed, icon }) => (
        <div className={`flex items-center justify-center w-10 h-10 rounded-full
            ${completed ? 'bg-green-100 text-green-600' :
                active ? 'bg-blue-100 text-primary' : 'bg-gray-100 text-gray-400'}`}>
            {icon}
        </div>
    );

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[99999] font-tbPop" initialFocus={cancelButtonRef} onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 z-[99] w-screen overflow-y-auto font-tbPop">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-md">
                                <div className="bg-white px-8 py-8">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-tbLex text-black font-bold mb-2 tracking-tight">
                                            {step === 1 ? 'Reset Your Password' :
                                                step === 2 ? 'Verify Your Identity' :
                                                    'Create New Password'}
                                        </h2>
                                        <p className="text-slate-500 mb-6 text-sm font-tbPop">
                                            {step === 1 ? 'Enter your email to receive a verification code' :
                                                step === 2 ? `We sent a code to ${email}` :
                                                    'Your new password must be different from previous used passwords'}
                                        </p>
                                    </div>

                                    {/* Progress Steps */}
                                    <div className="flex justify-between items-center mb-8 px-4">
                                        <div className="flex flex-col items-center">
                                            <StepIcon
                                                active={step === 1}
                                                completed={step > 1}
                                                icon={<EnvelopeIcon className="h-5 w-5" />}
                                            />
                                            <span className={`text-xs mt-2 ${step >= 1 ? 'text-primary font-medium' : 'text-gray-400'}`}>Email</span>
                                        </div>
                                        <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                                            <div className={`h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <StepIcon
                                                active={step === 2}
                                                completed={step > 2}
                                                icon={<ShieldCheckIcon className="h-5 w-5" />}
                                            />
                                            <span className={`text-xs mt-2 ${step >= 2 ? 'text-primary font-medium' : 'text-gray-400'}`}>Verify</span>
                                        </div>
                                        <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                                            <div className={`h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <StepIcon
                                                active={step === 3}
                                                completed={false}
                                                icon={<KeyIcon className="h-5 w-5" />}
                                            />
                                            <span className={`text-xs mt-2 ${step >= 3 ? 'text-primary font-medium' : 'text-gray-400'}`}>Password</span>
                                        </div>
                                    </div>

                                    <form onSubmit={
                                        step === 1 ? handleSubmit(submitEmail) :
                                            step === 2 ? (e) => { e.preventDefault(); submitOtp(); } :
                                                handleSubmit(submitNewPassword)
                                    }>
                                        <div className="space-y-4">
                                            {step === 1 && (
                                                <div className="relative">
                                                    <TextInput
                                                        label="Enter Your Email"
                                                        placeholder="Enter Your Email"
                                                        type="email"
                                                        registerName="email"
                                                        props={{ ...register('email'), validate: validateEmail, required: "Email is required" }}
                                                        errors={errors.email}
                                                    />
                                                </div>
                                            )}

                                            {step === 2 && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-center gap-3">
                                                            {[0, 1, 2, 3].map((index) => (
                                                                <input
                                                                    key={index}
                                                                    ref={(el) => (otpInputs.current[index] = el)}
                                                                    className={`w-14 h-14 border ${otp[index] ? 'border-blue-500' : 'border-gray-300'} rounded-lg text-center text-2xl font-tbPop focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                                                                    type="text"
                                                                    maxLength="1"
                                                                    value={otp[index]}
                                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                                    onPaste={handlePaste}
                                                                    autoFocus={index === 0}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-center text-sm text-gray-500">
                                                        Didn't receive code?{' '}
                                                        <button
                                                            type="button"
                                                            onClick={resendOtp}
                                                            disabled={isLoading}
                                                            className="text-primary hover:text-blue-800 font-medium disabled:text-gray-400"
                                                        >
                                                            {isLoading ? (
                                                                <span className="flex items-center justify-center">
                                                                    <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                                                                    Sending...
                                                                </span>
                                                            ) : (
                                                                'Resend code'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {step === 3 && (
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New password</label>
                                                        <div className="relative">
                                                            <input
                                                                id="newPassword"
                                                                type={showNewPassword ? "text" : "password"}
                                                                {...register('newPassword', {
                                                                    validate: validatePassword,
                                                                    required: "Password is required"
                                                                })}
                                                                className={`block w-full rounded-lg border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                                                                placeholder="••••••••"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                            >
                                                                {!showNewPassword ? (
                                                                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                                                ) : (
                                                                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {errors.newPassword && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm password</label>
                                                        <div className="relative">
                                                            <input
                                                                id="confirmPassword"
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                {...register('confirmPassword', {
                                                                    validate: validatePassword,
                                                                    required: "Please confirm your password"
                                                                })}
                                                                className={`block w-full rounded-lg border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                                                                placeholder="••••••••"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                                                ) : (
                                                                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {errors.confirmPassword && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="p-3 bg-blue-50 rounded-lg">
                                                        <p className="text-xs text-blue-800 font-medium">Password requirements:</p>
                                                        <ul className="text-xs text-blue-800 mt-1 space-y-1">
                                                            <li className="flex items-center">
                                                                <svg className={`h-3 w-3 mr-2 ${errors.newPassword?.type === 'minLength' ? 'text-red-500' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    {errors.newPassword?.type === 'minLength' ? (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    ) : (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    )}
                                                                </svg>
                                                                At least 8 characters
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                        <div className="mt-8 flex justify-between gap-3">
                                            {step > 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(step - 1)}
                                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    Back
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleClose}
                                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'bg-blue-400' :
                                                    step === 3 ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-blue-700'
                                                    }`}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center justify-center">
                                                        <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                                                        {step === 1 ? 'Sending...' : step === 2 ? 'Verifying...' : 'Resetting...'}
                                                    </span>
                                                ) : (
                                                    step === 1 ? 'Send Code' : step === 2 ? 'Verify Code' : 'Reset Password'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
