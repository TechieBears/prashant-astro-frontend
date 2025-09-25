import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1, tableBtn } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import ImageUploadInput from '../../TextInput/ImageUploadInput';
import SelectTextInput from '../../TextInput/SelectTextInput';
import {
    addProduct,
    editProduct,
    getProductCategoriesDropdown,
    getProductSubCategoriesByCategory,
} from '../../../api';
import { TableTitle } from '../../../helper/Helper';
import CustomTextArea from '../../TextInput/CustomTextArea';
import { useDispatch, useSelector } from 'react-redux';
import { setProductCategories } from '../../../redux/Slices/rootSlice';

function CreateProductModal({ edit, userData, setRefreshTrigger }) {
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();
    const productCategories = useSelector(state => state.appRoot?.productCategories || []);
    const [productSubCategories, setProductSubCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const toggle = () => { setOpen(!open), reset() };
    const [loader, setLoader] = useState(false);


    const formSubmit = async (data) => {
        try {
            setLoader(true);
            if (edit) {
                await editProduct(userData?._id, data).then(res => {
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
                await addProduct(data).then(res => {
                    if (res?.success) {
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1);
                        toggle();
                        toast.success("Product Added Successfully");
                    } else {
                        setLoader(false);
                        toast.error(res?.message || "Something went wrong");
                    }
                })
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to add Product");
        }
    }

    useEffect(() => {
        if (edit && userData) {
            reset({
                name: userData?.name,
                category: userData?.category?._id,
                subcategory: userData?.subcategory?._id,
                description: userData?.description,
                highlights: userData?.highlights,
                additionalInfo: userData?.additionalInfo,
                stock: userData?.stock,
                sellingPrice: userData?.sellingPrice,
                image: userData?.image,
                mrpPrice: userData?.mrpPrice,
                ...userData?.specification
            });

            if (userData?.category?._id) {
                const loadSubcategories = async () => {
                    const response = await getProductSubCategoriesByCategory(userData?.category?._id);
                    setProductSubCategories(response?.data?.map(item => ({ value: item?._id, label: item?.name })));
                };
                loadSubcategories();
            }
        } else {
            reset({
                category: '',
                subcategory: '',
                name: '',
                description: '',
                highlights: '',
                additionalInfo: '',
                stock: '',
                sellingPrice: '',
                mrpPrice: '',
                image: '',
                Certification: '',
                Origin: '',
                Size: '',
                Type: ''
            });
        }
    }, [edit, userData, reset, setValue, open]);

    const watchCategory = watch('category');
    const dispatch = useDispatch();

    useEffect(() => {
        const apiCall = async () => {
            const response = await getProductCategoriesDropdown();
            dispatch(setProductCategories(response?.data?.map(item => ({ value: item?._id, label: item?.name }))));
        }
        apiCall();
    }, []);

    useEffect(() => {
        if (watchCategory) {
            setValue('subcategory', '');

            const apiCall = async () => {
                const response = await getProductSubCategoriesByCategory(watchCategory);
                setProductSubCategories(response?.data?.map(item => ({ value: item?._id, label: item?.name })));
            }
            apiCall();
        } else {
            setProductSubCategories([]);
            setValue('subcategory', '');
        }
    }, [watchCategory, setValue]);

    return (
        <>
            {
                edit ? <button onClick={toggle}>
                    <Edit className='text-yellow-500' size={20} />
                </button> : <button onClick={toggle} className={tableBtn}>
                    Create New Product
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
                                <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title={edit ? "Edit Product" : "Create New Product"}
                                        toggle={toggle}
                                    />
                                    <div className="">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className="bg-white px-4 pb-5 pt-5 sm:p-6 sm:pb-4">
                                                <div className='grid grid-cols-3 gap-x-3 gap-y-5' >
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product Category
                                                        </h4>
                                                        <div className="">
                                                            <SelectTextInput
                                                                label="Select Product Category"
                                                                registerName="category"
                                                                options={productCategories}
                                                                placeholder="Select Product Category"
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
                                                            Product Sub Category
                                                        </h4>
                                                        <div className="">
                                                            <SelectTextInput
                                                                label="Select Product Sub Category"
                                                                registerName="subcategory"
                                                                options={productSubCategories}
                                                                placeholder="Select Product Sub Category "
                                                                props={{
                                                                    ...register('subcategory', { required: true }),
                                                                    value: watch('subcategory') || '',
                                                                    onChange: (e) => {
                                                                        setValue('subcategory', e.target.value);
                                                                    }
                                                                }}
                                                                errors={errors.subcategory}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product Name
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Product Name"
                                                            placeholder="Enter Product Name"
                                                            type="text"
                                                            registerName="name"
                                                            props={{ ...register('name', { required: "Product is required" }) }}
                                                            errors={errors.name}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product Image (multiple)
                                                        </h4>
                                                        <ImageUploadInput
                                                            label="Upload Product Image"
                                                            multiple={true}
                                                            registerName="image"
                                                            errors={errors.image}
                                                            {...register("image", { required: "Product Image is required" })}
                                                            register={register}
                                                            setValue={setValue}
                                                            control={control}
                                                            defaultValue={userData?.images}
                                                        />

                                                    </div>

                                                    <div className="">

                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product MRP Price
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Product MRP Price"
                                                            placeholder="Enter Product MRP Price"
                                                            type="number"
                                                            registerName="mrpPrice"
                                                            props={{
                                                                ...register('mrpPrice', {
                                                                    required: "MRP Price is required",
                                                                    min: {
                                                                        value: 1,
                                                                        message: "MRP Price must be at least 1"
                                                                    }
                                                                })
                                                            }}
                                                            errors={errors.mrpPrice}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product Selling Price
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Product Selling Price"
                                                            placeholder="Enter Product Selling Price"
                                                            type="number"
                                                            registerName="sellingPrice"
                                                            props={{ ...register('sellingPrice', { required: "Selling Price is required", min: { value: 1, message: "Selling Price must be at least 1" } }) }}
                                                            errors={errors.sellingPrice}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product Quantity (Stock)
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Product Quantity"
                                                            placeholder="Enter Product Quantity"
                                                            type="number"
                                                            registerName="stock"
                                                            props={{ ...register('stock', { required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" } }) }}
                                                            errors={errors.stock}
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
                                                            Product highlights
                                                        </h4>
                                                        <CustomTextArea
                                                            label="Enter Product Highlights"
                                                            placeholder="Enter Product Highlights"
                                                            registerName="highlights"
                                                            props={{
                                                                ...register('highlights', {
                                                                    minLength: {
                                                                        value: 10,
                                                                        message: "Highlights must be at least 10 characters"
                                                                    }
                                                                })
                                                            }}
                                                            errors={errors.highlights}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product Additional Information
                                                        </h4>
                                                        <CustomTextArea
                                                            label="Enter Product Additional Information"
                                                            placeholder="Enter Product Additional Information"
                                                            registerName="additionalInfo"
                                                            props={{
                                                                ...register('additionalInfo', {
                                                                    minLength: {
                                                                        value: 10,
                                                                        message: "Additional Information must be at least 10 characters"
                                                                    }
                                                                })
                                                            }}
                                                            errors={errors.additionalInfo}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-4">
                                                    <h4
                                                        className="text-base font-tbLex font-normal text-black pb-2.5"
                                                    >
                                                        Product Specification
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                                                        <div className="">
                                                            <h4
                                                                className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                            >
                                                                Product Certification
                                                            </h4>
                                                            <TextInput
                                                                label="Enter Product Certification"
                                                                placeholder="Enter Product Certification"
                                                                type="text"
                                                                registerName="Certification"
                                                                props={{ ...register('Certification') }}
                                                                errors={errors.Certification}
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <h4
                                                                className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                            >
                                                                Product Origin (ex. India & Nepal)
                                                            </h4>
                                                            <TextInput
                                                                label="Enter Product Origin"
                                                                placeholder="Enter Product Origin"
                                                                type="text"
                                                                registerName="Origin"
                                                                props={{ ...register('Origin') }}
                                                                errors={errors.Origin}
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <h4
                                                                className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                            >
                                                                Product Size (ex. 10–20 mm)
                                                            </h4>
                                                            <TextInput
                                                                label="Enter Product Size"
                                                                placeholder="Enter Product Size"
                                                                type="text"
                                                                registerName="Size"
                                                                props={{ ...register('Size') }}
                                                                errors={errors.Size}
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <h4
                                                                className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                            >
                                                                Product Type
                                                            </h4>
                                                            <TextInput
                                                                label="Enter Product Type"
                                                                placeholder="Enter Product Type"
                                                                type="text"
                                                                registerName="Type"
                                                                props={{ ...register('Type') }}
                                                                errors={errors.Type}
                                                            />
                                                        </div>
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

export default CreateProductModal
