import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { validateAlphabets } from '../../../../utils/validateFunction';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import { editBanner } from '../../../../api';
import { addBanner } from '../../../../api/index';
import { formBtn1, tableBtn } from '../../../../utils/CustomClass';
import LoadBox from '../../../Loader/LoadBox';
import TextInput from '../../../TextInput/TextInput';
import SelectTextInput from '../../../TextInput/SelectTextInput';
import CustomTextArea from '../../../TextInput/CustomTextArea';
import { TableTitle } from '../../../../helper/Helper';
import ImageUploadInput from '../../../TextInput/ImageUploadInput';

function CreateBannersModal({ edit, userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            if (edit) {
                await editBanner(userData?._id, data).then(res => {
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
                await addBanner(data).then(res => {
                    if (res?.success) {
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1);
                        toggle();
                        toast.success("Banner Added Successfully");
                    } else {
                        setLoader(false);
                        toast.error(res?.message || "Something went wrong");
                    }
                })
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to add Banner");
        }
    }


    useEffect(() => {
        if (edit && userData && open) {
            setValue('title', userData?.title);
            setValue('description', userData?.description);
            setValue('type', userData?.type);
            setValue('position', userData?.position);
            setValue('startDate', userData?.startDate);
            setValue('endDate', userData?.endDate);
            setValue('isActive', userData?.isActive);
            setValue('image', userData?.image);
        }
    }, [edit, userData, reset, setValue, open]);

    return (
        <>
            {
                edit ? <button onClick={toggle}>
                    <Edit className='text-yellow-500' size={20} />
                </button> : <button onClick={toggle} className={tableBtn}>
                    Create New Banner
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
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title={edit ? "Edit Banner" : "Create New Banner"}
                                        toggle={toggle}
                                    />
                                    <div className=" bg-white">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className="md:py-5 md:pb-7 mx-4 md:mx-8 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2  gap-x-3 gap-y-5">
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Banner Image
                                                        </h4>
                                                        <ImageUploadInput
                                                            label="Upload Banner Image"
                                                            multiple={false}
                                                            registerName="image"
                                                            errors={errors.image}
                                                            {...register("image", { required: "Banner Image is required" })}
                                                            register={register}
                                                            setValue={setValue}
                                                            control={control}
                                                            defaultValue={userData?.image}
                                                        />

                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Title
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Title*"
                                                            placeholder="Enter Title"
                                                            type="text"
                                                            registerName="title"
                                                            props={{ ...register('title', { required: "Title is required" }) }}
                                                            errors={errors.title}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Description
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
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Banner Type
                                                        </h4>
                                                        <div className="">
                                                            <SelectTextInput
                                                                label="Select Banner Type"
                                                                registerName="type"
                                                                options={[
                                                                    { value: 'website', label: 'Website Banner' },
                                                                    { value: 'app', label: 'App Banner' },
                                                                ]}
                                                                placeholder="Select Banner Type"
                                                                props={{
                                                                    ...register('type', { required: true }),
                                                                    value: watch('type') || ''
                                                                }}
                                                                errors={errors.type}
                                                                defaultValue={userData?.type}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Position
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Position"
                                                            placeholder="Enter Position"
                                                            type="text"
                                                            registerName="position"
                                                            props={{ ...register('position', { required: true }) }}
                                                            errors={errors.position}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Start Date Time
                                                        </h4>
                                                        <TextInput
                                                            label="Start Date Time"
                                                            placeholder="Start Date Time"
                                                            type="date"
                                                            registerName="startDate"
                                                            props={{ ...register('startDate', { required: "Start Date Time is required" }) }}
                                                            errors={errors.startDate}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            End Date Time
                                                        </h4>
                                                        <TextInput
                                                            label="End Date Time"
                                                            placeholder="End Date Time"
                                                            type="date"
                                                            registerName="endDate"
                                                            props={{ ...register('endDate', { required: "End Date Time is required" }) }}
                                                            errors={errors.endDate}
                                                        />
                                                    </div>
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

export default CreateBannersModal
