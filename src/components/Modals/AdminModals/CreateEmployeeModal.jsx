import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1, tableBtn } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import { validateAlphabets, validateEmail, validatePhoneNumber } from '../../../utils/validateFunction';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import { addEmployee, editEmployee } from '../../../api';
import { TableTitle } from '../../../helper/Helper';

function CreateEmployeeModal({ edit, userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const updatedData = {
                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.email,
                mobileNo: data?.mobileNo,
            }

            if (edit) {
                await editEmployee(userData?._id, updatedData).then(res => {
                    if (res?.status == 200) {
                        toast.success(res?.data?.message)
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1); // Trigger refreshz
                        toggle();
                    } else {
                        toast.error(res?.data?.message || "Something went wrong")
                        setLoader(false);
                    }
                })
            } else {
                await addEmployee(updatedData).then(res => {
                    if (res?.status === 200) {
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1); // Trigger refreshz
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
            setValue('firstName', userData?.firstName);
            setValue('lastName', userData?.lastName);
            setValue('email', userData?.email);
            setValue('mobileNo', userData?.mobileNo);
        }
    }, [edit, userData, reset, setValue]);

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
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title={edit ? "Edit Employee" : "Create New Employee"}
                                        toggle={toggle}
                                    />
                                    <div className=" bg-white">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className='p-5 py-8 flex flex-col  gap-x-3 gap-y-5' >
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        First Name
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
                                                        Last Name
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
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Email
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Your Email"
                                                        placeholder="Enter Your Email"
                                                        type="text"
                                                        registerName="email"
                                                        props={{ ...register('email'), valdate: validateEmail, required: "Email is required" }}
                                                        errors={errors.email}
                                                    />
                                                </div>
                                                <div>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Phone Number
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
                                            </div>

                                            <footer className="py-3 flex bg-slate-100 justify-end px-4 space-x-3">
                                                {loader ? <LoadBox className="relative block w-auto px-5 transition-colors font-tb tracking-wide duration-200 py-2.5 overflow-hidden text-base font-semibold text-center text-white rounded-lg bg-primary hover:bg-primary capitalize" /> : <button type='submit' className={formBtn1}>submit</button>}
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
