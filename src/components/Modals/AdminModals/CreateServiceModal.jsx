import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1, formBtn3, tableBtn } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import ImageUploadInput from '../../TextInput/ImageUploadInput';
import SelectTextInput from '../../TextInput/SelectTextInput';
import { addService, editService } from '../../../api';
import { TableTitle } from '../../../helper/Helper';
import { useSelector } from 'react-redux';

function CreateServiceModal({ edit, userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();

    const serviceCategories = useSelector(state => state.appRoot?.serviceCategories || []);

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            if (edit) {
                await editService(userData?._id, data).then(res => {
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
                await addService(data).then(res => {
                    if (res?.success) {
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1);
                        toggle();
                        toast.success("Service Added Successfully");
                    } else {
                        setLoader(false);
                        toast.error(res?.message || "Something went wrong");
                    }
                })
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to add Service");
        }
    }


    useEffect(() => {
        if (edit && userData) {
            setValue('name', userData?.name);
            setValue('category', userData?.category?.name);
            setValue('image', userData?.image);
            setValue('title', userData?.title);
            setValue('subTitle', userData?.subTitle);
            setValue('description', userData?.description);
            setValue('price', userData?.price);
            setValue('durationInMinutes', userData?.durationInMinutes);
        }
    }, [edit, userData, reset, setValue]);

    return (
        <>
            {
                edit ? <button onClick={toggle}>
                    <Edit className='text-yellow-500' size={20} />
                </button> : <button onClick={toggle} className={tableBtn}>
                    Create New Service
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
                                        title={edit ? "Edit Service" : "Create New Service"}
                                        toggle={toggle}
                                    />
                                    <div className=" bg-slate1">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className="bg-white px-4 pb-5 pt-5 sm:p-6 sm:pb-4">
                                                <div className='grid grid-cols-2 gap-x-3 gap-y-5' >
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Category
                                                        </h4>
                                                        <div className="">
                                                            <SelectTextInput
                                                                label="Select Service Category"
                                                                registerName="category"
                                                                options={serviceCategories}
                                                                placeholder="Select Service Category"
                                                                props={{
                                                                    ...register('category', { required: true }),
                                                                    value: watch('category') || ''
                                                                }}
                                                                errors={errors.category}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Name
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Service Name"
                                                            placeholder="Enter Service Name"
                                                            type="text"
                                                            registerName="name"
                                                            props={{ ...register('name', { required: "Service is required", minLength: { value: 3, message: "Name must be at least 3 characters" } }) }}
                                                            errors={errors.name}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Title
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Service Title"
                                                            placeholder="Enter Service Title"
                                                            type="text"
                                                            registerName="title"
                                                            props={{ ...register('title', { required: "Service is required", minLength: { value: 3, message: "Title must be at least 3 characters" } }) }}
                                                            errors={errors.title}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Sub Title
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Service Sub Title"
                                                            placeholder="Enter Service Sub Title"
                                                            type="text"
                                                            registerName="subTitle"
                                                            props={{ ...register('subTitle', { required: "Service is required", minLength: { value: 3, message: "Sub Title must be at least 3 characters" } }) }}
                                                            minLength={3}
                                                            errors={errors.subTitle}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Description
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Service Description"
                                                            placeholder="Enter Service Description"
                                                            type="text"
                                                            registerName="description"
                                                            props={{ ...register('description', { required: "Service is required", minLength: { value: 10, message: "Description must be at least 10 characters" } }) }}
                                                            errors={errors.description}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Price
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Service Price"
                                                            placeholder="Enter Service Price"
                                                            type="number"
                                                            registerName="price"
                                                            props={{ ...register('price', { required: "Service is required", min: 0 }) }}
                                                            errors={errors.price}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Duration (30/60 Minutes)
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Service Duration"
                                                            placeholder="Enter Service Duration"
                                                            type="number"
                                                            registerName="durationInMinutes"
                                                            props={{ ...register('durationInMinutes', { required: "Service is required", min: 0 }) }}
                                                            errors={errors.durationInMinutes}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Image
                                                        </h4>
                                                        <ImageUploadInput
                                                            label="Upload Service Image"
                                                            multiple={false}
                                                            registerName="image"
                                                            errors={errors.image}
                                                            {...register("image", { required: "Service Image is required", minLength: { value: 10, message: "Image must be at least 10 characters" } })}
                                                            register={register}
                                                            setValue={setValue}
                                                            control={control}
                                                        // defaultValue={user?.user?.profilePicture}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <footer className="py-3 flex bg-primary/5 justify-end px-4 space-x-3">
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

export default CreateServiceModal
