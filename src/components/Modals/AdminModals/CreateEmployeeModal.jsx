import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1, tableBtn } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import { validateAlphabets, validateEmail, validatePhoneNumber, validateCommision } from '../../../utils/validateFunction';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import { addEmployee, editEmployee, getPublicServicesDropdown } from '../../../api';
import { TableTitle } from '../../../helper/Helper';
import MultiSelectTextInput from '../../TextInput/MultiSelectTextInput';
import { Controller } from 'react-hook-form';
// import ImageUploadInput from '../../TextInput/ImageUploadInput';
import SelectTextInput from '../../TextInput/SelectTextInput';
import ImageCropUpload from '../../TextInput/ImageCropUpload';

function CreateEmployeeModal({ edit, userData, setRefreshTrigger }) {
    const { register, handleSubmit, control, watch, reset, setValue, formState: { errors } } = useForm();
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);

    const [serviceSkills, setServiceSkills] = useState([]);

    const employeeType = watch('employeeType');

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const payload = {
                ...data,
                "preBooking": true
            }
            if (edit) {
                await editEmployee(userData?._id, payload).then(res => {
                    if (res?.success) {
                        toast.success(res?.message)
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1);
                        toggle();
                    } else {
                        toast.error(res?.message || "Something went wrong")
                        setLoader(false);
                    }
                })
            } else {
                await addEmployee(payload).then(res => {
                    if (res?.success) {
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1);
                        toggle();
                        toast.success("Employee Added Successfully");
                    } else {
                        setLoader(false);
                        toast.error(res?.message || "Something went wrong");
                    }
                })
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to add Employee");
        }
    }


    useEffect(() => {
        if (edit && userData) {
            setValue('employeeType', userData?.profile?.employeeType);
            setValue('firstName', userData?.profile?.firstName);
            setValue('lastName', userData?.profile?.lastName);
            setValue('email', userData?.email);
            setValue('mobileNo', userData?.mobileNo);
            setValue('skills', userData?.profile?.skills);
            setValue('languages', userData?.profile?.languages);
            setValue('experience', userData?.profile?.experience);
            setValue('days', userData?.profile?.days);
            setValue('startTime', userData?.profile?.startTime);
            setValue('endTime', userData?.profile?.endTime);
            setValue('profileImage', userData?.profile?.profileImage);
        } else {
            reset({
                employeeType: '',
                firstName: '',
                lastName: '',
                email: '',
                mobileNo: '',
                skills: [],
                languages: [],
                experience: '',
                days: [],
                startTime: '',
                endTime: '',
                profileImage: '',
            });
        }
    }, [edit, userData, reset, setValue, open]);


    useEffect(() => {
        if (open) {
            const apiCall = async () => {
                const response = await getPublicServicesDropdown();
                setServiceSkills(response?.data?.map(item => ({ value: item?.name, label: item?.name })))
            }
            apiCall();
        }
    }, [open]);

    return (
        <>
            {
                edit ? <button onClick={toggle}>
                    <Edit className='text-yellow-500' size={20} />
                </button> : <button onClick={toggle} className={tableBtn}>
                    Create New Employee
                </button>
            }

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
                                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title={edit ? "Edit Employee" : "Create New Employee"}
                                        toggle={toggle}
                                    />
                                    <div className=" bg-white">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className='p-5 py-8  grid grid-cols-3 gap-x-3 gap-y-5 ' >
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Employee Type {edit ? "(Cannot be edited)" : ""}
                                                    </h4>
                                                    <div className="">
                                                        <SelectTextInput
                                                            label="Select Employee Type"
                                                            registerName="employeeType"
                                                            options={[
                                                                { value: 'astrologer', label: 'Astrologer' },
                                                                { value: 'employee', label: 'Employee' },
                                                            ]}
                                                            disabled={edit}
                                                            placeholder="Select Employee Type"
                                                            props={{
                                                                ...register('employeeType'),
                                                                value: watch('employeeType') || ''
                                                            }}
                                                            errors={errors.employeeType}
                                                            defaultValue={userData?.employeeType}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        First Name <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Enter First Name*"
                                                        placeholder="Enter First Name"
                                                        type="text"
                                                        registerName="firstName"
                                                        props={{ ...register('firstName', { required: "First name is required", validate: validateAlphabets }), minLength: 3 }}
                                                        errors={errors.firstName}
                                                    />
                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Last Name <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Last Name*"
                                                        placeholder="Enter Last Name"
                                                        type="text"
                                                        registerName="lastName"
                                                        props={{ ...register('lastName', { required: "Last name is required", validate: validateAlphabets }), minLength: 3 }}
                                                        errors={errors.lastName}
                                                    />
                                                </div>
                                                <div className=''>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Employee Image <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <ImageCropUpload
                                                        label="Upload Employee Image"
                                                        multiple={false}
                                                        registerName="profileImage"
                                                        errors={errors.profileImage}
                                                        {...register("profileImage", { required: "Employee Image is required" })}
                                                        register={register}
                                                        setValue={setValue}
                                                        control={control}
                                                        defaultValue={userData?.profileImage}
                                                        cropAspectRatio={1}
                                                        cropHeight={400}
                                                        cropWidth={400}
                                                    />
                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Email <span className="text-red-500 text-xs font-tbLex">*</span> {edit ? "(Cannot be edited)" : ""}
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Your Email"
                                                        placeholder="Enter Your Email"
                                                        type="text"
                                                        disabled={edit}
                                                        registerName="email"
                                                        props={{ ...register('email'), valdate: validateEmail, required: "Email is required" }}
                                                        errors={errors.email}
                                                    />
                                                </div>
                                                <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Phone Number <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Your Phone Number"
                                                        placeholder="Enter Your Phone Number"
                                                        type="tel"
                                                        registerName="mobileNo"
                                                        props={{ ...register('mobileNo', { validate: validatePhoneNumber, required: true }), maxLength: 10, minLength: 10 }}
                                                        errors={errors.mobileNo}
                                                    />
                                                </div>

                                                {employeeType === 'astrologer' && <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Skills (Multiple)
                                                    </h4>
                                                    <div className="">
                                                        <Controller
                                                            name="skills"
                                                            control={control}
                                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                                <MultiSelectTextInput
                                                                    label="Select Skills"
                                                                    options={serviceSkills}
                                                                    key={'skills'}
                                                                    value={value || []}
                                                                    onChange={onChange}
                                                                    errors={errors.skills}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>}
                                                {employeeType === 'astrologer' && <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Languages (Multiple)
                                                    </h4>
                                                    <div className="">
                                                        <Controller
                                                            name="languages"
                                                            control={control}
                                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                                <MultiSelectTextInput
                                                                    label="Select Languages"
                                                                    options={
                                                                        [
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
                                                                        ]
                                                                    }
                                                                    key={'languages'}
                                                                    value={value || []}
                                                                    onChange={onChange}
                                                                    errors={errors.languages}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>}
                                                {employeeType === 'astrologer' && <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Experience
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Your Experience"
                                                        placeholder="Enter Your Experience"
                                                        type="tel"
                                                        maxLength={2}
                                                        minLength={1}
                                                        registerName="experience"
                                                        props={{ ...register('experience', { validate: validateCommision }), maxLength: 2, minLength: 1 }}
                                                        errors={errors.experience}
                                                    />
                                                </div>}
                                                {employeeType === 'astrologer' && <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Days (Multiple)
                                                    </h4>
                                                    <div className="">
                                                        <Controller
                                                            name="days"
                                                            control={control}
                                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                                <MultiSelectTextInput
                                                                    label="Select Days"
                                                                    options={
                                                                        [
                                                                            { value: 'Monday', label: 'Monday' },
                                                                            { value: 'Tuesday', label: 'Tuesday' },
                                                                            { value: 'Wednesday', label: 'Wednesday' },
                                                                            { value: 'Thursday', label: 'Thursday' },
                                                                            { value: 'Friday', label: 'Friday' },
                                                                            { value: 'Saturday', label: 'Saturday' },
                                                                            { value: 'Sunday', label: 'Sunday' },
                                                                        ]
                                                                    }
                                                                    key={'days'}
                                                                    value={value || []}
                                                                    onChange={onChange}
                                                                    errors={errors.days}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>}
                                                {employeeType === 'astrologer' && <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Start Time <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Start Time*"
                                                        type="time"
                                                        registerName="startTime"
                                                        props={{
                                                            ...register("startTime", {
                                                                required: "Start time is required",
                                                                validate: (value) => {
                                                                    const minutes = new Date(`1970-01-01T${value}:00`).getMinutes();
                                                                    return [0, 30].includes(minutes) || "Only 00 or 30 minutes allowed";
                                                                },
                                                            }),
                                                        }}
                                                        errors={errors.startTime}
                                                    />
                                                </div>}
                                                {employeeType === 'astrologer' && <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        End Time <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <div className="">
                                                        <TextInput
                                                            label="End Time*"
                                                            type="time"
                                                            registerName="endTime"
                                                            props={{
                                                                ...register("endTime", {
                                                                    required: "End time is required",
                                                                    validate: (value) => {
                                                                        const minutes = new Date(`1970-01-01T${value}:00`).getMinutes();
                                                                        return [0, 30].includes(minutes) || "Only 00 or 30 minutes allowed";
                                                                    },
                                                                }),
                                                            }}
                                                            errors={errors.endTime}
                                                        />
                                                    </div>
                                                </div>}

                                            </div>
                                            <footer className="py-3 flex bg-slate1 justify-end px-4 space-x-3">
                                                {loader ? <LoadBox className={formBtn1} /> : <button type='submit' className={formBtn1}>submit</button>}
                                            </footer>

                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}

export default CreateEmployeeModal
