import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { validateAlphabets } from '../../../../utils/validateFunction';
import toast from 'react-hot-toast';
import { sendNotificationToUser } from '../../../../api';
import { formBtn1, tableBtn } from '../../../../utils/CustomClass';
import LoadBox from '../../../Loader/LoadBox';
import TextInput from '../../../TextInput/TextInput';
import SelectTextInput from '../../../TextInput/SelectTextInput';
import CustomTextArea from '../../../TextInput/CustomTextArea';
import { TableTitle } from '../../../../helper/Helper';
import ImageUploadInput from '../../../TextInput/ImageUploadInput';

function SendNotificationModal({ userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();

    const watchUserType = watch('userType');

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const updatedData = {
                title: data?.title,
                description: data?.description,
                image: data?.image,
                notificationType: data?.notificationType,
                notificationFor: data?.notificationFor,
                userType: data?.userType,
            }

            if (data?.userType === 'specific-customer' && data?.userIds) {
                updatedData.userIds = data?.userIds;
            }

            await sendNotificationToUser(updatedData).then(res => {
                if (res?.status === 200) {
                    setLoader(false);
                    reset();
                    setRefreshTrigger(prev => prev + 1);
                    toggle();
                    toast.success("Notification Sent Successfully");
                } else {
                    setLoader(false);
                    toast.error(res?.message || "Something went wrong");
                }
            })
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to send Notification");
        }
    }


    useEffect(() => {
        if (userData) {
            setValue('title', userData?.title);
            setValue('description', userData?.description);
            setValue('image', userData?.image);
            setValue('notificationType', userData?.notificationType);
            setValue('notificationFor', userData?.notificationFor);
            setValue('userType', userData?.userType);
            setValue('userIds', userData?.userIds);
        }
    }, [userData, reset, setValue]);

    return (
        <>
            <button onClick={toggle} className={tableBtn}>
                Send Notification
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
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title="Send Notification"
                                        toggle={toggle}
                                    />
                                    <div className=" bg-white">
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className="md:py-5 md:pb-7 mx-4 md:mx-8 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2  gap-x-3 gap-y-5">
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Title <span className="text-red-500 text-xs font-tbLex">*</span>
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Title*"
                                                            placeholder="Enter Title"
                                                            type="text"
                                                            registerName="title"
                                                            props={{ ...register('title', { required: "Title is required", validate: validateAlphabets }), minLength: 3 }}
                                                            errors={errors.title}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Notification Type <span className="text-red-500 text-xs font-tbLex">*</span>
                                                        </h4>
                                                        <SelectTextInput
                                                            label="Select Notification Type"
                                                            registerName="notificationType"
                                                            options={[
                                                                { value: 'in-app', label: 'In-App' },
                                                                { value: 'push', label: 'Push' },
                                                            ]}
                                                            placeholder="Select Notification Type"
                                                            props={{ ...register('notificationType', { required: "Notification Type is required" }) }}
                                                            errors={errors.notificationType}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Description <span className="text-red-500 text-xs font-tbLex">*</span>
                                                        </h4>
                                                        <CustomTextArea
                                                            label="Enter Description"
                                                            placeholder="Enter Description"
                                                            registerName="description"
                                                            props={{
                                                                ...register('description', {
                                                                    required: "Description is required",
                                                                    minLength: {
                                                                        value: 10,
                                                                        message: "Description must be at least 10 characters"
                                                                    }
                                                                })
                                                            }}
                                                            errors={errors.description}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Notification Image
                                                        </h4>
                                                        <ImageUploadInput
                                                            label="Upload Image"
                                                            placeholder="Upload Image"
                                                            type="text"
                                                            registerName="image"
                                                            errors={errors.image}
                                                            {...register("image")}
                                                            defaultValue={userData?.image}
                                                            register={register}
                                                            setValue={setValue}
                                                            control={control}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Notification For <span className="text-red-500 text-xs font-tbLex">*</span>
                                                        </h4>
                                                        <div className="">
                                                            <SelectTextInput
                                                                label="Select Notification For"
                                                                registerName="notificationFor"
                                                                options={[
                                                                    { value: 'services', label: 'Services' },
                                                                    { value: 'products', label: 'Products' },
                                                                ]}
                                                                placeholder="Select Notification For"
                                                                props={{ ...register('notificationFor', { required: "Notification For is required" }) }}
                                                                errors={errors.notificationFor}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            User Type <span className="text-red-500 text-xs font-tbLex">*</span>
                                                        </h4>
                                                        <div className="">
                                                            <SelectTextInput
                                                                label="Select User Type"
                                                                registerName="userType"
                                                                options={[
                                                                    { value: 'all-customers', label: 'All Customers' },
                                                                    { value: 'specific-customer', label: 'Specific Customer' },
                                                                ]}
                                                                placeholder="Select User Type"
                                                                props={{ ...register('userType', { required: "User Type is required" }) }}
                                                                errors={errors.userType}
                                                            />
                                                        </div>
                                                    </div>

                                                    {watchUserType === 'specific-customer' && (
                                                        <div className="col-span-1">
                                                            <h4
                                                                className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                            >
                                                                Specific Customer IDs <span className="text-red-500 text-xs font-tbLex">*</span>
                                                            </h4>
                                                            <TextInput
                                                                label="Enter Specific Customer IDs (comma separated)"
                                                                placeholder="Enter Specific Customer IDs (comma separated)"
                                                                type="text"
                                                                registerName="userIds"
                                                                props={{ ...register('userIds', { required: watchUserType === 'specific-customer' ? "Specific Customer IDs are required" : false }) }}
                                                                errors={errors.userIds}
                                                            />
                                                        </div>
                                                    )}
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

export default SendNotificationModal
