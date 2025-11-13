import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { addNotification, getCustomerUsersDropdown } from '../../../../api';
import { formBtn1, tableBtn } from '../../../../utils/CustomClass';
import LoadBox from '../../../Loader/LoadBox';
import TextInput from '../../../TextInput/TextInput';
import SelectTextInput from '../../../TextInput/SelectTextInput';
import CustomTextArea from '../../../TextInput/CustomTextArea';
import { TableTitle } from '../../../../helper/Helper';
import ImageUploadInput from '../../../TextInput/ImageUploadInput';
import MultiSelectTextInput from '../../../TextInput/MultiSelectTextInput';

function SendNotificationModal({ setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();
    const [customerUsersDropdown, setCustomerUsersDropdown] = useState([]);
    const userType = watch('userType');

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const updatedData = {
                title: data?.title,
                description: data?.description,
                image: data?.image,
                notificationType: data?.notificationType,
                redirectionUrl: data?.redirectionUrl,
                redirectId: data?.redirectId,
                userType: data?.userType,
                userIds: data?.userType === 'specific-customer' ? customerUsersDropdown?.map(item => item?.value) : [],
                scheduledAt: data?.scheduledAt,
                expiryDate: data?.expiryDate
            }

            await addNotification(updatedData).then(res => {
                if (res?.success) {
                    setLoader(false);
                    reset();
                    setRefreshTrigger(prev => prev + 1);
                    toggle();
                    toast.success(res?.message);
                } else {
                    setLoader(false);
                    toast.error(res?.message || "Something went wrong");
                }
            })
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to add Notification");
        }
    }


    useEffect(() => {
        if (open && userType === 'specific-customer') {
            const apiCall = async () => {
                const res = await getCustomerUsersDropdown();
                if (res?.success) {
                    const mappedData = res?.data?.customers?.map(item => ({ value: item?._id, label: item?.name }));
                    setCustomerUsersDropdown(mappedData);
                } else {
                    setCustomerUsersDropdown([]);
                }
            }
            apiCall();
        } else {
            setCustomerUsersDropdown([]);
        }
    }, [open, userType]);

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
                                        title={"Send New Notification"}
                                        toggle={toggle}
                                    />
                                    <div className=" bg-white">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className="md:py-5 md:pb-7 mx-4 md:mx-8 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2  gap-x-3 gap-y-5">
                                                    {/* Title Field */}
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
                                                            props={{ ...register('title', { required: "Title is required" }), minLength: 3 }}
                                                            errors={errors.title}
                                                        />
                                                    </div>

                                                    {/* Description Field */}
                                                    <div className="">
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

                                                    {/* Image Field */}
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Notification Image
                                                        </h4>
                                                        <ImageUploadInput
                                                            label="Upload Notification Image"
                                                            multiple={false}
                                                            registerName="image"
                                                            errors={errors.image}
                                                            {...register("image")}
                                                            register={register}
                                                            setValue={setValue}
                                                            control={control}
                                                        />
                                                    </div>

                                                    {/* Notification Type Field */}
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
                                                                { value: 'in-app', label: 'In-App Notification' },
                                                                { value: 'web', label: 'Web Notification' },
                                                                { value: 'email', label: 'Email Notification' },
                                                                { value: 'all', label: 'All Types' },
                                                            ]}
                                                            placeholder="Select Notification Type"
                                                            props={{
                                                                ...register('notificationType', { required: "Notification Type is required" }),
                                                                value: watch('notificationType') || ''
                                                            }}
                                                            errors={errors.notificationType}
                                                        />
                                                    </div>

                                                    {/* Redirection URL Field */}
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Redirection URL
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Redirection URL"
                                                            placeholder="https://yourapp.com/offers"
                                                            type="url"
                                                            registerName="redirectionUrl"
                                                            props={{ ...register('redirectionUrl') }}
                                                            errors={errors.redirectionUrl}
                                                        />
                                                    </div>

                                                    {/* Redirect ID Field */}
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Redirect ID
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Redirect ID"
                                                            placeholder="offer_123"
                                                            type="text"
                                                            registerName="redirectId"
                                                            props={{ ...register('redirectId') }}
                                                            errors={errors.redirectId}
                                                        />
                                                    </div>

                                                    {/* User Type Field */}
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            User Type <span className="text-red-500 text-xs font-tbLex">*</span>
                                                        </h4>
                                                        <SelectTextInput
                                                            label="Select User Type"
                                                            registerName="userType"
                                                            options={[
                                                                { value: 'all-customers', label: 'All Customers' },
                                                                { value: 'specific-customer', label: 'Specific Customer' },
                                                            ]}
                                                            placeholder="Select User Type"
                                                            props={{
                                                                ...register('userType', { required: "User Type is required" }),
                                                                value: watch('userType') || ''
                                                            }}
                                                            errors={errors.userType}
                                                        />
                                                    </div>

                                                    {userType === 'specific-customer' && (
                                                        <div>
                                                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Applicable Users</h4>
                                                            <Controller
                                                                name="userIds"
                                                                control={control}
                                                                defaultValue={[]}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <MultiSelectTextInput
                                                                        label="Select Users"
                                                                        options={customerUsersDropdown}
                                                                        value={Array.isArray(value) ? value : []}
                                                                        onChange={onChange}
                                                                        errors={errors.userIds}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Scheduled At Field */}
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Scheduled At
                                                        </h4>
                                                        <TextInput
                                                            label="Scheduled Date Time"
                                                            placeholder=""
                                                            type="datetime-local"
                                                            registerName="scheduledAt"
                                                            props={{
                                                                ...register('scheduledAt'),
                                                                min: new Date().toISOString().slice(0, 16)
                                                            }}
                                                            errors={errors.scheduledAt}
                                                        />
                                                    </div>

                                                    {/* Expiry Date Field */}
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Expiry Date
                                                        </h4>
                                                        <TextInput
                                                            label="Expiry Date"
                                                            placeholder=""
                                                            type="date"
                                                            registerName="expiryDate"
                                                            props={{
                                                                ...register('expiryDate'),
                                                                min: new Date().toISOString().slice(0, 10)
                                                            }}
                                                            errors={errors.expiryDate}
                                                        />
                                                    </div>

                                                    {/* Status Field */}
                                                    {/* <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Status
                                                        </h4>
                                                        <SelectTextInput
                                                            label="Select Status"
                                                            registerName="status"
                                                            options={[
                                                                { value: 'active', label: 'Active' },
                                                                { value: 'inactive', label: 'Inactive' },
                                                            ]}
                                                            placeholder="Select Status"
                                                            props={{
                                                                ...register('status'),
                                                                value: watch('status') || 'active'
                                                            }}
                                                            errors={errors.status}
                                                        />
                                                    </div> */}
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
