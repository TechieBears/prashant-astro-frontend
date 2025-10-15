import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { formBtn1, tableBtn } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import ImageUploadInput from '../../TextInput/ImageUploadInput';
import SelectTextInput from '../../TextInput/SelectTextInput';
import { addService, editService, getServiceCategoriesDropdown } from '../../../api';
import { configTextEditor, TableTitle } from '../../../helper/Helper';
import { useDispatch, useSelector } from 'react-redux';
import JoditEditor from 'jodit-react';
import { validateYoutubeUrl } from '../../../utils/validateFunction';
import Error from '../../Errors/Error';
import CustomTextArea from '../../TextInput/CustomTextArea';
import { setServiceCategories } from '../../../redux/Slices/rootSlice';

function CreateServiceModal({ edit, userData, setRefreshTrigger }) {
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);
    const editorRef = useRef(null);
    const serviceCategories = useSelector(state => state.appRoot?.serviceCategories || []);
    const dispatch = useDispatch();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "videoUrl"
    });

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
            reset({
                name: userData?.name,
                image: userData?.image,
                serviceType: userData?.serviceType,
                title: userData?.title,
                subTitle: userData?.subTitle,
                price: userData?.price,
                description: userData?.description,
                durationInMinutes: userData?.durationInMinutes,
                htmlContent: userData?.htmlContent,
                ...userData
            });
            setValue('category', userData?.category?._id);
        } else {
            reset({
                category: '',
                serviceType: '',
                name: '',
                title: '',
                subTitle: '',
                price: '',
                description: '',
                durationInMinutes: 30,
                htmlContent: '',
                image: '',
                videoUrl: []
            });
        }
    }, [edit, userData, reset, setValue, open]);


    useEffect(() => {
        const apiCall = async () => {
            const response = await getServiceCategoriesDropdown();
            dispatch(setServiceCategories(response?.data?.map(item => ({ value: item?._id, label: item?.name }))));
        }
        apiCall();
    }, []);

    return <>
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
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                                <TableTitle
                                    title={edit ? "Edit Service" : "Create New Service"}
                                    toggle={toggle}
                                />
                                <div className=" bg-slate1">
                                    {/* React Hook Form */}
                                    <form onSubmit={handleSubmit(formSubmit)} >
                                        <div className="bg-white px-4 pb-5 pt-5 sm:p-6 sm:pb-4">
                                            <div className='grid grid-cols-3 gap-x-3 gap-y-5' >
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Category <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <div className="">
                                                        <SelectTextInput
                                                            label="Select Service Category"
                                                            registerName="category"
                                                            options={serviceCategories}
                                                            placeholder="Select Service Category"
                                                            props={{
                                                                ...register('category', { required: true }),
                                                                value: watch('category') || '',
                                                                onChange: (e) => {
                                                                    setValue('category', e.target.value);
                                                                }
                                                            }}
                                                            errors={errors.category}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Mode <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <div className="">
                                                        <SelectTextInput
                                                            label="Select Service Mode"
                                                            registerName="serviceType"
                                                            options={[
                                                                { value: 'online', label: 'Online' },
                                                                { value: 'pandit_center', label: `Pandit's Center` },
                                                                { value: 'pooja_at_home', label: 'Pooja at Home' },
                                                            ]}
                                                            placeholder="Select Service Mode"
                                                            props={{
                                                                ...register('serviceType', { required: true }),
                                                                value: watch('serviceType') || ''
                                                            }}
                                                            errors={errors.serviceType}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Name <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Service Name"
                                                        placeholder="Enter Service Name"
                                                        type="text"
                                                        registerName="name"
                                                        maxLength={100}
                                                        props={{ ...register('name', { required: "Service is required", minLength: { value: 3, message: "Name must be at least 3 characters" }, maxLength: { value: 100, message: "Name must be less than 100 characters" } }) }}
                                                        errors={errors.name}
                                                    />
                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Title <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Service Title"
                                                        placeholder="Enter Service Title"
                                                        type="text"
                                                        registerName="title"
                                                        maxLength={100}
                                                        props={{ ...register('title', { required: "Service is required", minLength: { value: 3, message: "Title must be at least 3 characters" }, maxLength: { value: 100, message: "Title must be less than 100 characters" } }) }}
                                                        errors={errors.title}
                                                    />
                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Sub Title <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Service Sub Title"
                                                        placeholder="Enter Service Sub Title"
                                                        type="text"
                                                        registerName="subTitle"
                                                        maxLength={100}
                                                        props={{ ...register('subTitle', { required: "Service is required", minLength: { value: 3, message: "Sub Title must be at least 3 characters" }, maxLength: { value: 100, message: "Sub Title must be less than 100 characters" } }) }}
                                                        errors={errors.subTitle}
                                                    />
                                                </div>
                                                {/* <div className="">

                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Description
                                                    </h4>
                                                    <CustomTextArea
                                                        label="Enter Service Description"
                                                        placeholder="Enter Service Description"
                                                        registerName="description"
                                                        props={{
                                                            ...register('description', {
                                                                minLength: {
                                                                    value: 10,
                                                                    message: "description must be at least 10 characters"
                                                                }
                                                            })
                                                        }}
                                                        errors={errors.description}
                                                    />
                                                </div> */}
                                                <div className=''>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Price <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <TextInput
                                                        label="Enter Service Price"
                                                        placeholder="Enter Service Price"
                                                        type="number"
                                                        registerName="price"
                                                        maxLength={10}
                                                        props={{ ...register('price', { required: "Service is required", min: 0 }) }}
                                                        errors={errors.price}
                                                    />
                                                </div>
                                                <div className=''>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Duration (Minutes) <span className="text-red-500 text-xs font-tbLex">*</span>
                                                    </h4>
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const currentValue = watch('durationInMinutes') || 30;
                                                                const newValue = Math.max(30, currentValue - 30);
                                                                setValue('durationInMinutes', newValue);
                                                            }}
                                                            className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xl transition-colors duration-200"
                                                        >
                                                            -
                                                        </button>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="h-12 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                                                                <span className="text-lg font-semibold text-gray-700">
                                                                    {watch('durationInMinutes') || 30} min
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const currentValue = watch('durationInMinutes') || 30;
                                                                const newValue = currentValue + 30;
                                                                setValue('durationInMinutes', newValue);
                                                            }}
                                                            className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xl transition-colors duration-200"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="hidden"
                                                        {...register('durationInMinutes', {
                                                            required: "Service duration is required",
                                                            min: { value: 30, message: "Minimum duration is 30 minutes" }
                                                        })}
                                                    />
                                                    {errors.durationInMinutes && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.durationInMinutes.message}</p>
                                                    )}
                                                </div>
                                                <div className=''>
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Image <span className="text-red-500 text-xs font-tbLex">*</span>
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
                                                        defaultValue={userData?.image}
                                                    />

                                                </div>
                                                <div className="">
                                                    <h4
                                                        className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                    >
                                                        Service Video
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => append({ videoUrl: '' })}
                                                        className={`${formBtn1} text-nowrap !h-[52px] w-full`}
                                                    >
                                                        Add Service Video
                                                    </button>
                                                </div>
                                                {fields.map((field, index) => (
                                                    <div className="" key={field.id}>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Service Video ({index + 1})
                                                        </h4>
                                                        <div className="flex items-center space-x-2">
                                                            <TextInput
                                                                label={`Enter youtube service video (${index + 1})`}
                                                                placeholder={`Enter youtube service video (${index + 1})`}
                                                                type="url"
                                                                registerName={`videoUrl.${index}.videoUrl`}
                                                                props={{
                                                                    ...register(`videoUrl.${index}.videoUrl`, {
                                                                        validate: validateYoutubeUrl
                                                                    })
                                                                }}
                                                            />
                                                            <div className='' >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => remove(index)}
                                                                    className={`${formBtn1} text-nowrap !h-[52px] bg-red-500 !px-4`}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {errors.videoUrl?.[index]?.videoUrl && (
                                                            <Error message={errors.videoUrl[index].videoUrl.message} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-4">
                                                <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">
                                                    Service Description <span className="text-red-500 text-xs font-tbLex">*</span>
                                                </h4>
                                                <Controller
                                                    name="htmlContent"
                                                    control={control}
                                                    rules={{
                                                        required: "Description is required",
                                                        validate: (value) =>
                                                            value.replace(/<[^>]*>/g, '').length >= 10 ||
                                                            "Description must be at least 10 characters (excluding HTML)"
                                                    }}
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <>
                                                            <JoditEditor
                                                                ref={editorRef}
                                                                value={value || ''}
                                                                config={configTextEditor}
                                                                tabIndex={1}
                                                                onBlur={(newContent) => onChange(newContent)}
                                                                onChange={(newContent) => onChange(newContent)}
                                                            />
                                                            {error && (
                                                                <p className="text-red-500 text-sm mt-1">{error.message}</p>
                                                            )}
                                                        </>
                                                    )}
                                                />
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
    </>;
}

export default CreateServiceModal
