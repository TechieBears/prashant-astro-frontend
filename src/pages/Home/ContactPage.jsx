import React from 'react';
import { useForm } from 'react-hook-form';
import BackgroundTitle from '../../components/Titles/BackgroundTitle';
import TextInput from '../../components/TextInput/TextInput';
import CustomTextArea from '../../components/TextInput/CustomTextArea';
import { Mail01Icon, WhatsappIcon, UserMultiple02Icon } from 'hugeicons-react';
import { Facebook01Icon, InstagramIcon, TwitterIcon, Linkedin01Icon } from 'hugeicons-react'; // Importing social icons

const ContactPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
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
            <div className='w-full max-w-[1280px] mx-auto '>
                <div className="flex flex-col md:flex-row justify-center gap-10 p-6 md:p-12 bg-[#fffaf6]">
                    {/* Image with gradient border */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-[3px]">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="max-w-lg text-center md:text-left">
                        <h2 className="text-3xl font-semibold text-black leading-snug">
                            Connect with <span className="text-black">Pandit</span>
                        </h2>
                        <h2 className="text-3xl font-semibold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent leading-snug">
                            Prashant Suryavanshi
                        </h2>
                        <p className="text-slate-500 text-sm mt-3">
                            For personalized astrological guidance, consultation bookings, or media inquiries,
                            feel free to reach out.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 p-6 md:p-12">
                    {/* Left Side - Contact Information */}
                    <div className="flex flex-col w-full md:w-1/2 rounded-xl bg-white py-6 min-h-full">
                        <div className='px-10'>
                            <h2 className="text-lg mb-2 font-semibold text-slate-800 text-center">Get in Touch</h2>
                            <p className='text-slate-500 text-center text-xs mb-6'>
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
                                            <p className="text-slate-800 text-sm mb-1">{item.name}</p>
                                            <p className="text-slate-500 text-xs">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 border-[1px] border-solid border-[#00000026]" />

                        {/* Social Media Section */}
                        <div className='px-10'>
                            <h3 className="text-md mt-6 mb-4 font-semibold text-slate-800">Follow & Connect</h3>
                            <div className="mt-6 flex ml-4 gap-6 justify-center md:justify-start">
                                {/* Facebook */}
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors">
                                        <Facebook01Icon size={25} className="text-white" />
                                    </div>
                                </a>

                                {/* Instagram */}
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-3 rounded-full hover:bg-pink-600 transition-colors">
                                        <InstagramIcon size={25} className="text-white" />
                                    </div>
                                </a>

                                {/* Twitter */}
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-blue-400 p-3 rounded-full hover:bg-blue-500 transition-colors">
                                        <TwitterIcon size={25} className="text-white" />
                                    </div>
                                </a>

                                {/* LinkedIn */}
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition-colors">
                                        <Linkedin01Icon size={25} className="text-white" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="flex flex-col w-full md:w-1/2 rounded-xl bg-white p-5 py-6 min-h-full">
                        <h2 className="text-lg mb-6 font-semibold text-slate-800 text-center">Send a Message</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* First Group: Full Name & Mobile Number */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <TextInput
                                    label="Full Name"
                                    type="text"
                                    registerName="fullName"
                                    register={{ ...register("fullName", { required: "Full Name is required" }) }}
                                    errors={errors.fullName}
                                    style=""
                                />

                                <TextInput
                                    label="Mobile Number"
                                    type="tel"
                                    registerName="mobileNumber"
                                    register={{ ...register("mobileNumber", { required: "Mobile Number is required" }) }}
                                    errors={errors.mobileNumber}
                                    style=""
                                />
                            </div>

                            {/* Second Group: Email & Subject */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <TextInput
                                    label="Email"
                                    type="email"
                                    registerName="email"
                                    register={{ ...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } }) }}
                                    errors={errors.email}
                                    style=""
                                />

                                <TextInput
                                    label="Subject"
                                    type="text"
                                    registerName="subject"
                                    register={{ ...register("subject", { required: "Subject is required" }) }}
                                    errors={errors.subject}
                                    style=""
                                />
                            </div>

                            <CustomTextArea
                                label="Message"
                                registerName="message"
                                props={{
                                    placeholder: "Please share your questions, preferred consultation times, or any specific astrological concerns you'd like to discuss..."
                                }}
                                errors={null} 
                                style="mb-4"
                            />

                            {/* <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Submit</button> */}
                        </form>
                    </div>
                </div>

                <div className='p-6 md:p-12 rounded-xl'>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d963630.5438557793!2d72.33098132816288!3d19.36127872923214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1757404179280!5m2!1sen!2sin"
                        width="100%"
                        height="350"
                        className='rounded-xl'
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
