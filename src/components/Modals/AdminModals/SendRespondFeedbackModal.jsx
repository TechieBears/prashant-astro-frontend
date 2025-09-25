import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1, tableBtn, formBtn3 } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import { validateAlphabets, validateEmail, validatePhoneNumber } from '../../../utils/validateFunction';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import { addEmployee, editEmployee, respondFeedback } from '../../../api';
import { TableTitle } from '../../../helper/Helper';

function SendRespondFeedbackModal({ edit, userData, setRefreshTrigger }) {
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const updatedData = {
                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.email,
                mobileNo: data?.mobileNo,
            }
            await respondFeedback(updatedData).then(res => {
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
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to add Employee");
        }
    }
    useEffect(() => {
        if (edit && userData) {
            reset({
                firstName: userData?.firstName,
                lastName: userData?.lastName,
                email: userData?.email,
                mobileNo: userData?.mobileNo,
            });
        } else {
            reset();
        }
    }, [edit, userData, reset, setValue, open]);

    return (
        <>
            <button onClick={toggle}>
                <Edit className='text-yellow-500' size={20} />
            </button>
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
                                                        // label="Enter First Name*"
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

export default SendRespondFeedbackModal
