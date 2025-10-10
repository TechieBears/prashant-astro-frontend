import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1 } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import toast from 'react-hot-toast';
import { adminBlockSlots } from '../../../api';
import { TableTitle } from '../../../helper/Helper';
import CustomTextArea from '../../TextInput/CustomTextArea';
import { useSelector } from 'react-redux';

function BlockCalenderSlotsModal({ slotData, setRefreshTrigger }) {
    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm();
    const user = useSelector(state => state.user.userDetails);
    const [open, setOpen] = useState(false);
    const toggle = () => {
        setOpen(false);
        reset();
    };
    const [loader, setLoader] = useState(false);

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const payload = {
                astrologer_id: data.astrologer_id,
                blocked_by: user?._id,
                date: data.date,
                start_time: data.start_time,
                end_time: data.end_time,
                total: 0,
                snapshot: {
                    price: 0,
                    durationInMinutes: (t => t[0] * 60 + t[1])(data.end_time.split(':').map(Number)) - (t => t[0] * 60 + t[1])(data.start_time.split(':').map(Number)),
                },
                cust: {
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    phone: user?.mobileNo
                },
                rejectReason: data.rejectReason
            };

            await adminBlockSlots(payload).then(res => {
                if (res?.success) {
                    setLoader(false);
                    reset();
                    toast.success("Slot blocked successfully");
                    toggle();
                    setRefreshTrigger();
                } else {
                    setLoader(false);
                    toast.error(res?.message || "Failed to block slot");
                }
            });
        } catch (error) {
            console.log('Error blocking slot:', error);
            setLoader(false);
            toast.error("Failed to block slot");
        }
    }

    useEffect(() => {
        console.log('BlockCalenderSlotsModal received slotData:', slotData);
        if (slotData) {
            console.log('Opening modal with slot data');
            setOpen(true);
            setTimeout(() => {
                setValue('date', slotData.date);
                setValue('start_time', slotData.start_time);
                setValue('end_time', slotData.end_time);
                setValue('astrologer_id', slotData.astrologer_id || '');
            }, 100);
        } else {
            setOpen(false);
        }
    }, [slotData, setValue]);

    useEffect(() => {
        if (!open) {
            reset({
                astrologer_id: '',
                date: '',
                start_time: '',
                end_time: '',
            });
        }
    }, [open, reset]);


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
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title="Block Calendar Slot"
                                        toggle={toggle}
                                    />
                                    <div className="bg-white">
                                        <form onSubmit={handleSubmit(formSubmit)}>
                                            <div className='p-5 py-8 grid grid-cols-2 gap-x-3 gap-y-5'>
                                                <div className="col-span-2">
                                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                                        Date <span className="text-blue-500 text-xs font-tbLex">(Read Only)</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Select Date"
                                                        disabled
                                                        placeholder="Select Date"
                                                        type="date"
                                                        registerName="date"
                                                        props={{
                                                            ...register('date', { required: "Date is required" }),
                                                            min: new Date().toISOString().split('T')[0]
                                                        }}
                                                        errors={errors.date}
                                                    />
                                                </div>

                                                <div className="">
                                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                                        Start Time <span className="text-blue-500 text-xs font-tbLex">(Read Only)</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Start Time"
                                                        disabled
                                                        type="time"
                                                        registerName="start_time"
                                                        props={{
                                                            ...register("start_time", {
                                                                required: "Start time is required",
                                                                validate: (value) => {
                                                                    const minutes = new Date(`1970-01-01T${value}:00`).getMinutes();
                                                                    return [0, 30].includes(minutes) || "Only 00 or 30 minutes allowed";
                                                                },
                                                            }),
                                                        }}
                                                        errors={errors.start_time}
                                                    />
                                                </div>

                                                <div className="">
                                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                                        End Time <span className="text-blue-500 text-xs font-tbLex">(Read Only)</span>
                                                    </h4>
                                                    <TextInput
                                                        label="End Time"
                                                        disabled
                                                        type="time"
                                                        registerName="end_time"
                                                        props={{
                                                            ...register("end_time", {
                                                                required: "End time is required",
                                                                validate: (value) => {
                                                                    const startTime = watch('start_time');
                                                                    if (!startTime) return true;

                                                                    const minutes = new Date(`1970-01-01T${value}:00`).getMinutes();
                                                                    if (![0, 30].includes(minutes)) {
                                                                        return "Only 00 or 30 minutes allowed";
                                                                    }

                                                                    const start = new Date(`1970-01-01T${startTime}:00`);
                                                                    const end = new Date(`1970-01-01T${value}:00`);
                                                                    return end > start || "End time must be after start time";
                                                                },
                                                            }),
                                                        }}
                                                        errors={errors.end_time}
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                                        Blocking Reason
                                                    </h4>
                                                    <CustomTextArea
                                                        label="Enter Blocking Reason"
                                                        placeholder="Enter Blocking Reason"
                                                        registerName="rejectReason"
                                                        props={{
                                                            ...register("rejectReason", {
                                                                required: "Blocking Reason is required",
                                                                min: { value: 10, message: "Blocking Reason must be at least 10 characters" },
                                                                max: { value: 10000, message: "Blocking Reason cannot exceed 150 characters" },
                                                                minLength: {
                                                                    value: 10,
                                                                    message: "Blocking Reason must be at least 10 characters",
                                                                },
                                                                maxLength: {
                                                                    value: 20000,
                                                                    message: "Blocking Reason cannot exceed 150 characters",
                                                                },
                                                            }),
                                                        }}
                                                        errors={errors.rejectReason}
                                                    />
                                                </div>

                                            </div>

                                            <footer className="py-3 flex bg-slate-50 justify-end px-4 space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={toggle}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Cancel
                                                </button>
                                                {loader ? (
                                                    <LoadBox className={formBtn1} />
                                                ) : (
                                                    <button type='submit' className={formBtn1}>
                                                        Block Slot
                                                    </button>
                                                )}
                                            </footer>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default BlockCalenderSlotsModal
