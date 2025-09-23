import React from 'react';
import { useForm } from 'react-hook-form';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import TextInput from '../../components/TextInput/TextInput';
import CustomTextArea from '../../components/TextInput/CustomTextArea';
import { Mail01Icon, WhatsappIcon, UserMultiple02Icon } from 'hugeicons-react';
import { Facebook01Icon, InstagramIcon, TwitterIcon, Linkedin01Icon } from 'hugeicons-react'; // Importing social icons
import SectionHeader from '../../components/Titles/SectionHeader'; // Importing SectionHeader
import { postContactUs } from '../../api';
import toast from 'react-hot-toast';


const ContactPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
      
        try {
            const response = await postContactUs(data);
            console.log('response contact us', response)
            if(response.success) {
               toast.success(response?.message, {
                autoClose: 3000,  
                });
                reset();
            }else{
               toast.error(response?.message, {
                autoClose: 3000,  
                });
            }
        } catch (error) {
            console.log('Error posting contact us:', error);
        }
    };

    const contactData = [
        {
            name: "Email.ID",
            value: "Panditprashant@gmail.com",
            icon: <Mail01Icon size={20} className="text-white" />
        },
        {
            name: "WhatsApp",
            value: "+91 89453 24796",
            icon: <WhatsappIcon size={20} className="text-white" />
        },
        {
            name: "Availability",
            value: "Available for online and in-person sessions\nUsually responds within 24 hours",
            icon: <UserMultiple02Icon size={20} className="text-white" />
        },
    ];

    return (
        <div className='bg-slate1'>
            <BackgroundTitle
                title="Contact Us"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Contact Us", href: null }
                ]}
                backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                height="h-72"
            />
            <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16 md:py-20'>
                <div className="flex flex-col items-center md:flex-row justify-center py-8 md:py-12 md:gap-10">
                    {/* Image with gradient border */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <div className="absolute inset-0 rounded-full p-[3px]">
                            <img
                                src="/src/assets/user/contact/pandit_2.png"
                                alt="Pandit Prashant Shastri"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="max-w-lg text-center md:text-left mt-4 md:mt-0">
                        <div className="text-center md:text-left">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-procSans text-black">
                                Connect with
                            </h2>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-procSans bg-button-vertical-gradient-orange bg-clip-text text-transparent">
                                Pandit Prashant Suryavanshi
                            </h2>
                        </div>
                        <p className="text-slate-500 text-sm mt-3">
                            For personalized astrological guidance, consultation bookings, or media inquiries,
                            feel free to reach out.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Contact Information */}
                    <div className="flex flex-col w-full lg:w-1/2 rounded-xl bg-white p-6 shadow-sm">
                        <div className='md:px-10'>
                            <h2 className="text-lg mb-2 font-semibold text-slate-800 text-center">Get in Touch</h2>
                            <p className='text-slate-500 text-center text-base mb-6'>
                                Connect through the cosmic channels
                            </p>

                            {/* Loop through the contactData */}
                            <div>
                                {contactData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 mb-4">
                                        <div className="bg-gradient-orange rounded-full p-2">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-slate-800 text-md mb-1">{item.name}</p>
                                            <p className="text-slate-500 text-base">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 border-[1px] border-solid border-[#00000026]" />

                        {/* Social Media Section */}
                        <div className='px-4 md:px-10'>
                            <h3 className="text-md mt-6 mb-4 font-semibold text-slate-800">Follow & Connect</h3>
                            <div className="mt-6 flex flex-nowrap overflow-x-auto gap-4 w-full justify-center md:justify-start no-scrollbar">
                                {/* Instagram */}
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-3 rounded-full hover:bg-pink-600 transition-colors">
                                        <InstagramIcon size={25} className="text-white" />
                                    </div>
                                </a>

                                {/* Facebook */}
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors">
                                        <Facebook01Icon size={25} className="text-white" />
                                    </div>
                                </a>

                                {/* YouTube */}
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 rounded-xl shadow-sm lg:mt-0">
                        <h2 className="text-lg mb-2 font-semibold text-slate-800 text-center">Send a Message</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("fullName", { required: "Full Name is required" })}
                                        className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                                        placeholder="Enter your name"
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        {...register("mobileNumber", { required: "Mobile Number is required" })}
                                        className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${errors.mobileNumber ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                                        placeholder="Enter your mobile number"
                                    />
                                    {errors.mobileNumber && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/,
                                                message: "Please enter a valid email address"
                                            }
                                        })}
                                        className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register("subject", { required: "Subject is required" })}
                                        className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${errors.subject ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <option value="" disabled>Select a subject</option>
                                        <option value="Feedback">Feedback</option>
                                        <option value="Complaint">Complaint</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                                    )}
                                </div>

                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register("message", { required: "Message is required" })}
                                    rows="5"
                                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors ${errors.message ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                                    placeholder="Please share your questions, preferred consultation times, or any specific astrological concerns you'd like to discuss..."
                                ></textarea>
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                )}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-button-diagonal-gradient-orange hover:bg-orange-600 text-white font-medium py-2.5 px-8 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:shadow-md"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='py-8 md:py-12'>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d963630.5438557793!2d72.33098132816288!3d19.36127872923214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1757404179280!5m2!1sen!2sin"
                        width="100%"
                        height="400"
                        className='w-full rounded-xl shadow-sm'
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
