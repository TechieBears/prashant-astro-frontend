import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, CallCalling, Profile2User, SmsNotification, Edit2, Save2, CloseCircle } from 'iconsax-reactjs';
import toast from 'react-hot-toast';
import PathName from '../../../components/PathName/PathName';
import TextInput from '../../../components/TextInput/TextInput';
import SelectTextInput from '../../../components/TextInput/SelectTextInput';
import MultiSelectTextInput from '../../../components/TextInput/MultiSelectTextInput';
import ImageUploadInput from '../../../components/TextInput/ImageUploadInput';
import LoadBox from '../../../components/Loader/LoadBox';
import { editEmployee, getPublicServicesDropdown, updateAdminUserProfile } from '../../../api';
import { validateAlphabets, validateEmail, validatePhoneNumber, validateCommision } from '../../../utils/validateFunction';
import { formBtn1 } from '../../../utils/CustomClass';
import { setUserDetails } from '../../../redux/Slices/loginSlice';

const AdminProfile = () => {
    const user = useSelector(state => state.user.userDetails);
    console.log("⚡️🤯 ~ UserProfile.jsx:18 ~ AdminProfile ~ user:", user)
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serviceSkills, setServiceSkills] = useState([]);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const employeeType = watch('employeeType');

    useEffect(() => {
        if (user) {
            reset({
                employeeType: user?.role || '',
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                mobileNo: user?.mobileNo || '',
                skills: user?.skills || [],
                languages: user?.languages || [],
                experience: user?.experience || '',
                days: user?.days || [],
                startTime: user?.startTime || '',
                endTime: user?.endTime || '',
                profileImage: user?.profileImage || ''
            });
        }
    }, [user, reset]);

    useEffect(() => {
        fetchServiceSkills();
    }, []);

    const fetchServiceSkills = async () => {
        try {
            const response = await getPublicServicesDropdown();
            if (response?.success && response?.data) {
                const skills = response.data.map(service => ({
                    value: service.name,
                    label: service.name
                }));
                setServiceSkills(skills);
            }
        } catch (error) {
            console.error('Error fetching service skills:', error);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            reset({
                employeeType: user?.role || '',
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                mobileNo: user?.mobileNo || '',
                skills: user?.skills || [],
                languages: user?.languages || [],
                experience: user?.experience || '',
                days: user?.days || [],
                startTime: user?.startTime || '',
                endTime: user?.endTime || '',
                profileImage: user?.profileImage || ''
            });
        }
    };

    const onSubmit = async (data) => {
        try {
            if (user.role == "admin") {
                setLoading(true);
                const response = await updateAdminUserProfile(user?._id, data);
                if (response?.success) {
                    toast.success('Profile updated successfully!');
                    setIsEditing(false);
                    dispatch(setUserDetails(response?.data?.user))
                    setLoading(false);
                } else {
                    toast.error(response?.message || 'Failed to update profile');
                    setLoading(false);
                }
            } else {
                setLoading(true);
                const response = await editEmployee(user?._id, data);
                if (response?.success) {
                    toast.success('Profile updated successfully!');
                    setIsEditing(false);
                    dispatch(setUserDetails(response?.data?.user))
                    setLoading(false);
                } else {
                    toast.error(response?.message || 'Failed to update profile');
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const languageOptions = [
        { value: 'hindi', label: 'Hindi' },
        { value: 'bengali', label: 'Bengali' },
        { value: 'marathi', label: 'Marathi' },
        { value: 'telugu', label: 'Telugu' },
        { value: 'tamil', label: 'Tamil' },
        { value: 'gujarati', label: 'Gujarati' },
        { value: 'urdu', label: 'Urdu' },
        { value: 'kannada', label: 'Kannada' },
        { value: 'odia', label: 'Odia' },
        { value: 'malayalam', label: 'Malayalam' },
        { value: 'punjabi', label: 'Punjabi' },
        { value: 'assamese', label: 'Assamese' },
        { value: 'maithili', label: 'Maithili' },
        { value: 'santali', label: 'Santali' },
        { value: 'kashmiri', label: 'Kashmiri' },
        { value: 'english', label: 'English' },
    ];

    const dayOptions = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' },
    ];

    return (
        <div className='min-h-screen bg-slate-100'>
            <div className="flex items-center justify-between px-10 pt-5">
                <button className="flex items-center space-x-1 bg-transparent" onClick={() => window.history.back()}>
                    <ArrowLeft size={25} className='text-black' />
                    <span className='fs-3 base-font-600'>Back</span>
                </button>
                <div className="">
                    <PathName />
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white p-8 m-4 sm:m-8 rounded-xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-x-6">
                        <img
                            loading="lazy"
                            className="h-[120px] w-[120px] rounded-full border object-cover"
                            src={user?.profileImage || "https://cdn.tailgrids.com/assets/images/core-components/account-dropdowns/image-1.jpg"}
                            alt="User_Profile"
                        />
                        <div>
                            <h2 className="text-xl font-bold font-tb leading-7 text-gray-700 sm:truncate sm:text-2xl sm:tracking-tight capitalize">
                                {user?.firstName || "-----"} {user?.lastName || "-----"}
                            </h2>
                            <div className="flex items-center space-x-5">
                                <div className="mt-2 flex items-center text-base text-gray-500">
                                    <SmsNotification variant='TwoTone' size="22" className='text-gray-400 mr-1.5' />
                                    {user?.email || "-------------"}
                                </div>
                                <div className="mt-2 flex items-center text-base text-gray-500">
                                    <CallCalling variant='TwoTone' size="22" className='text-gray-400 mr-1.5' />
                                    {user?.mobileNo || "-------------"}
                                </div>
                            </div>
                            <div className="mt-2 flex items-center text-base text-gray-500 capitalize">
                                <Profile2User variant='TwoTone' size="22" className='text-gray-400 mr-1.5' />
                                {user?.role || user?.employeeType || "-------------"}
                            </div>
                        </div>
                    </div>

                    {/* Edit Toggle Button */}
                    <button
                        onClick={handleEditToggle}
                        className={`${formBtn1} text-nowrap !h-[52px] flex items-center `}
                    >
                        {isEditing ? (
                            <>
                                <CloseCircle size={20} className='mr-1' />
                                <span>Cancel</span>
                            </>
                        ) : (
                            <>
                                <Edit2 size={20} className='mr-1' />
                                <span>Edit Profile</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white p-8 m-4 sm:m-8 rounded-xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6'>

                        {/* Employee Type */}
                        <div className="">
                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                Employee Type
                            </h4>
                            {isEditing ? (
                                <SelectTextInput
                                    disabled={true}
                                    label="Select Employee Type"
                                    registerName="employeeType"
                                    options={[
                                        { value: 'astrologer', label: 'Astrologer' },
                                        { value: 'employee', label: 'Employee' },
                                        { value: 'admin', label: 'Admin' },
                                    ]}
                                    placeholder="Select Employee Type"
                                    props={{
                                        ...register('employeeType'),
                                        value: watch('employeeType') || ''
                                    }}
                                    errors={errors.employeeType}
                                />
                            ) : (
                                <div className="p-3 bg-slate-100 rounded-md capitalize">
                                    {user?.role || 'Not specified'}
                                </div>
                            )}
                        </div>

                        {/* First Name */}
                        <div className="">
                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                First Name
                            </h4>
                            {isEditing ? (
                                <TextInput
                                    label="Enter First Name*"
                                    placeholder="Enter First Name"
                                    type="text"
                                    registerName="firstName"
                                    props={{ ...register('firstName', { required: "First name is required", validate: validateAlphabets }), minLength: 3 }}
                                    errors={errors.firstName}
                                />
                            ) : (
                                <div className="p-3 bg-slate-100 rounded-md capitalize">
                                    {user?.firstName || 'Not specified'}
                                </div>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="">
                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                Last Name
                            </h4>
                            {isEditing ? (
                                <TextInput
                                    label="Enter Last Name*"
                                    placeholder="Enter Last Name"
                                    type="text"
                                    registerName="lastName"
                                    props={{ ...register('lastName', { required: "Last name is required", validate: validateAlphabets }), minLength: 3 }}
                                    errors={errors.lastName}
                                />
                            ) : (
                                <div className="p-3 bg-slate-100 rounded-md capitalize">
                                    {user?.lastName || 'Not specified'}
                                </div>
                            )}
                        </div>

                        {/* Profile Image */}
                        {isEditing && (
                            <div className=''>
                                <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                    Profile Image
                                </h4>
                                <ImageUploadInput
                                    label="Upload Profile Image"
                                    multiple={false}
                                    registerName="profileImage"
                                    errors={errors.profileImage}
                                    {...register("profileImage")}
                                    register={register}
                                    setValue={setValue}
                                    control={control}
                                    defaultValue={user?.profileImage}
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="">
                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                Email
                            </h4>
                            {isEditing ? (
                                <TextInput
                                    label="Enter Your Email"
                                    placeholder="Enter Your Email"
                                    type="email"
                                    disabled={true}
                                    registerName="email"
                                    props={{ ...register('email', { required: "Email is required", validate: validateEmail }) }}
                                    errors={errors.email}
                                />
                            ) : (
                                <div className="p-3 bg-slate-100 rounded-md capitalize">
                                    {user?.email || 'Not specified'}
                                </div>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                Phone Number
                            </h4>
                            {isEditing ? (
                                <TextInput
                                    label="Enter Your Phone Number"
                                    placeholder="Enter Your Phone Number"
                                    type="tel"
                                    registerName="mobileNo"
                                    props={{ ...register('mobileNo', { validate: validatePhoneNumber, required: true }), maxLength: 10, minLength: 10 }}
                                    errors={errors.mobileNo}
                                />
                            ) : (
                                <div className="p-3 bg-slate-100 rounded-md capitalize">
                                    {user?.mobileNo || 'Not specified'}
                                </div>
                            )}
                        </div>

                        {/* Astrologer-specific fields */}
                        {(employeeType === 'astrologer' || user?.employeeType === 'astrologer') && (
                            <>
                                {/* Skills */}
                                <div>
                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                        Skills (Multiple)
                                    </h4>
                                    {isEditing ? (
                                        <Controller
                                            name="skills"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <MultiSelectTextInput
                                                    label="Select Skills"
                                                    options={serviceSkills}
                                                    value={value || []}
                                                    onChange={onChange}
                                                    errors={errors.skills}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-100 rounded-md">
                                            {user?.skills?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {user?.skills.map((skill, index) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 font-tbLex capitalize rounded-full text-sm">
                                                            {typeof skill === 'object' ? skill.label : skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                'Not specified'
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Languages */}
                                <div>
                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                        Languages (Multiple)
                                    </h4>
                                    {isEditing ? (
                                        <Controller
                                            name="languages"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <MultiSelectTextInput
                                                    label="Select Languages"
                                                    options={languageOptions}
                                                    value={value || []}
                                                    onChange={onChange}
                                                    errors={errors.languages}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-100 rounded-md">
                                            {user?.languages?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {user?.languages.map((language, index) => (
                                                        <span key={index} className="px-2 py-1 bg-red-100 text-red-600 font-tbLex capitalize rounded-full text-sm">
                                                            {typeof language === 'object' ? language.label : language}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                'Not specified'
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Experience */}
                                <div>
                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                        Experience (Years)
                                    </h4>
                                    {isEditing ? (
                                        <TextInput
                                            label="Enter Your Experience"
                                            placeholder="Enter Your Experience"
                                            type="number"
                                            maxLength={2}
                                            minLength={1}
                                            registerName="experience"
                                            props={{ ...register('experience', { validate: validateCommision }), maxLength: 2, minLength: 1 }}
                                            errors={errors.experience}
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-100 rounded-md">
                                            {user?.experience ? `${user?.experience} years` : 'Not specified'}
                                        </div>
                                    )}
                                </div>

                                {/* Available Days */}
                                <div>
                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                        Available Days (Multiple)
                                    </h4>
                                    {isEditing ? (
                                        <Controller
                                            name="days"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <MultiSelectTextInput
                                                    label="Select Days"
                                                    options={dayOptions}
                                                    value={value || []}
                                                    onChange={onChange}
                                                    errors={errors.days}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-100 rounded-md">
                                            {user?.days?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {user?.days?.map((day, index) => (
                                                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 font-tbLex capitalize rounded-full text-sm">
                                                            {typeof day === 'object' ? day.label : day}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                'Not specified'
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Start Time */}
                                <div>
                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                        Start Time
                                    </h4>
                                    {isEditing ? (
                                        <TextInput
                                            label="Start Time*"
                                            placeholder="Start Time"
                                            type="time"
                                            registerName="startTime"
                                            props={{ ...register('startTime') }}
                                            errors={errors.startTime}
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-100 rounded-md">
                                            {user?.startTime || 'Not specified'}
                                        </div>
                                    )}
                                </div>

                                {/* End Time */}
                                <div>
                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                        End Time
                                    </h4>
                                    {isEditing ? (
                                        <TextInput
                                            label="End Time*"
                                            placeholder="End Time"
                                            type="time"
                                            registerName="endTime"
                                            props={{ ...register('endTime') }}
                                            errors={errors.endTime}
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-100 rounded-md">
                                            {user?.endTime || 'Not specified'}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Submit Button */}
                    {isEditing && (
                        <div className="flex justify-end mt-8 space-x-4">
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                className={`${formBtn1} text-nowrap bg-red-500`}
                            >
                                Cancel
                            </button>
                            {loading ? (
                                <LoadBox className={`${formBtn1} flex items-center space-x-2`} />
                            ) : (
                                <button
                                    type="submit"
                                    className={`${formBtn1} flex items-center space-x-2`}
                                >
                                    <Save2 size={20} />
                                    <span>Save Changes</span>
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
