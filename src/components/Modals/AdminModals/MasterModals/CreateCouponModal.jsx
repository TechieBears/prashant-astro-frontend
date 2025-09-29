import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import { addCoupon, editCoupon } from '../../../../api';
import { formBtn1, tableBtn } from '../../../../utils/CustomClass';
import LoadBox from '../../../Loader/LoadBox';
import TextInput from '../../../TextInput/TextInput';
import SelectTextInput from '../../../TextInput/SelectTextInput';
import { TableTitle } from '../../../../helper/Helper';

function CreateCouponModal({ edit, userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm();

    const formSubmit = async (data) => {
        try {
            setLoader(true);

            const formattedData = {
                ...data,
                discount: Number(data.discount),
                redemptionPerUser: Number(data.redemptionPerUser),
                totalRedemptions: Number(data.totalRedemptions)
            };

            const apiCall = edit
                ? editCoupon(userData?._id, formattedData)
                : addCoupon(formattedData);

            const res = await apiCall;

            if (res?.success) {
                toast.success(edit ? "Coupon Updated" : "Coupon Created");
                setRefreshTrigger(prev => prev + 1);
                toggle();
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            toast.error("Something went wrong");
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (edit && userData && open) {
            setValue('couponName', userData?.couponName);
            setValue('couponCode', userData?.couponCode);
            setValue('couponType', userData?.couponType);
            setValue('discountIn', userData?.discountIn);
            setValue('discount', userData?.discount);
            setValue('activationDate', userData?.activationDate?.split('T')[0]);
            setValue('expiryDate', userData?.expiryDate?.split('T')[0]);
            setValue('redemptionPerUser', userData?.redemptionPerUser);
            setValue('totalRedemptions', userData?.totalRedemptions);
        } else {
            reset();
        }
    }, [edit, userData, open, reset, setValue]);

    return (
        <>
            {
                edit ? <button onClick={toggle}>
                    <Edit className='text-yellow-500' size={20} />
                </button> : <button onClick={toggle} className={tableBtn}>
                    Create New Coupon
                </button>
            }

            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={toggle}>
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

                    <div className="fixed inset-0 overflow-y-auto">
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
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                    <TableTitle
                                        title={edit ? "Edit Coupon" : "Create New Coupon"}
                                        toggle={toggle}
                                    />
                                    <div className="bg-white">
                                        <form onSubmit={handleSubmit(formSubmit)}>
                                            <div className="md:py-5 md:pb-7 mx-4 md:mx-8 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Coupon Name</h4>
                                                        <TextInput
                                                            label="Enter Coupon Name"
                                                            placeholder="Enter Coupon Name"
                                                            registerName="couponName"
                                                            props={{ ...register('couponName', { required: "Required" }) }}
                                                            errors={errors.couponName}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Coupon Code</h4>
                                                        <TextInput
                                                            label="Enter Coupon Code"
                                                            placeholder="Enter Coupon Code"
                                                            registerName="couponCode"
                                                            props={{ ...register('couponCode', { required: "Required" }) }}
                                                            errors={errors.couponCode}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Coupon Type</h4>
                                                        <SelectTextInput
                                                            label="Select Coupon Type"
                                                            registerName="couponType"
                                                            options={[
                                                                { value: 'products', label: 'Products' },
                                                                { value: 'services', label: 'Services' },
                                                                { value: 'both', label: 'Both' },
                                                            ]}
                                                            placeholder="Select Coupon Type"
                                                            props={{ ...register('couponType', { required: true }) }}
                                                            errors={errors.couponType}
                                                            defaultValue={userData?.couponType}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Discount In</h4>
                                                        <SelectTextInput
                                                            label="Select Discount Type"
                                                            registerName="discountIn"
                                                            options={[
                                                                { value: 'percent', label: 'Percent' },
                                                                { value: 'amount', label: 'Amount' },
                                                            ]}
                                                            placeholder="Select Discount Type"
                                                            props={{ ...register('discountIn', { required: true }) }}
                                                            errors={errors.discountIn}
                                                            defaultValue={userData?.discountIn}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Discount</h4>
                                                        <TextInput
                                                            label="Enter Discount"
                                                            placeholder="Enter Discount"
                                                            type="number"
                                                            registerName="discount"
                                                            props={{ ...register('discount', { required: "Required" }) }}
                                                            errors={errors.discount}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Activation Date</h4>
                                                        <TextInput
                                                            label="Activation Date"
                                                            type="date"
                                                            registerName="activationDate"
                                                            props={{ ...register('activationDate', { required: "Required" }) }}
                                                            errors={errors.activationDate}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Expiry Date</h4>
                                                        <TextInput
                                                            label="Expiry Date"
                                                            type="date"
                                                            registerName="expiryDate"
                                                            props={{ ...register('expiryDate', { required: "Required" }) }}
                                                            errors={errors.expiryDate}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Redemption Per User</h4>
                                                        <TextInput
                                                            label="Enter Redemption Per User"
                                                            placeholder="Enter Redemption Per User"
                                                            type="number"
                                                            registerName="redemptionPerUser"
                                                            props={{ ...register('redemptionPerUser', { required: "Required" }) }}
                                                            errors={errors.redemptionPerUser}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Total Redemptions</h4>
                                                        <TextInput
                                                            label="Enter Total Redemptions"
                                                            placeholder="Enter Total Redemptions"
                                                            type="number"
                                                            registerName="totalRedemptions"
                                                            props={{ ...register('totalRedemptions', { required: "Required" }) }}
                                                            errors={errors.totalRedemptions}
                                                        />
                                                    </div>

                                                </div>
                                            </div>

                                            <footer className="py-3 flex bg-slate1 justify-end px-4 space-x-3">
                                                {loader
                                                    ? <LoadBox className={formBtn1} />
                                                    : <button type='submit' className={formBtn1}>Submit</button>}
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
    );
}

export default CreateCouponModal;
