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
import { addProduct, editProduct } from '../../../api';
import { TableTitle } from '../../../helper/Helper';

function CreateProductModal({ edit, userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const updatedData = {
                name: data?.name,
                productCategoryId: data?.productCategoryId,
                image: data?.image
            }

            if (edit) {
                await editProduct(userData?._id, updatedData).then(res => {
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
                await addProduct(updatedData).then(res => {
                    if (res?.status === 200) {
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1); // Trigger refreshz
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
            setValue('name', userData?.name);
            setValue('productCategoryId', userData?.productCategoryId);
            setValue('image', userData?.image);
        }
    }, [edit, userData, reset, setValue]);

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
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                                    <TableTitle
                                        title={edit ? "Edit Product" : "Create New Product"}
                                        toggle={toggle}
                                    />
                                    <div className=" bg-slate1">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(formSubmit)} >
                                            <div className="bg-white px-4 pb-5 pt-5 sm:p-6 sm:pb-4">
                                                <div className='grid grid-cols-1 gap-x-3 gap-y-5' >
                                                    <div className="">
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Product Category
                                                        </h4>
                                                        <div className="">
                                                            <SelectTextInput
                                                                label="Select Product Category"
                                                                registerName="productCategoryId"
                                                                options={[
                                                                    { value: '', label: 'Select Product Category' },
                                                                    { value: 'productCategory1', label: 'Product Category 1' },
                                                                    { value: 'productCategory2', label: 'Product Category 2' },
                                                                    { value: 'productCategory3', label: 'Product Category 3' },
                                                                    { value: 'productCategory4', label: 'Product Category 4' },
                                                                    { value: 'category5', label: 'Category 5' },
                                                                ]}
                                                                placeholder="Select Product Category"
                                                                props={{
                                                                    ...register('productCategoryId', { required: true }),
                                                                    value: watch('productCategoryId') || ''
                                                                }}
                                                                errors={errors.productCategoryId}
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
                                                            Product Image
                                                        </h4>
                                                        <ImageUploadInput
                                                            label="Upload Product Image"
                                                            multiple={false}
                                                            registerName="image"
                                                            errors={errors.image}
                                                            {...register("image", { required: "Product Image is required" })}
                                                            register={register}
                                                            setValue={setValue}
                                                            control={control}
                                                        // defaultValue={user?.user?.profilePicture}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <footer className="py-3 flex bg-primary/5 justify-end px-4 space-x-3">
                                                {loader ? <LoadBox className="relative block w-auto px-5 transition-colors font-tb tracking-wide duration-200 py-2.5 overflow-hidden text-base font-semibold text-center text-white rounded-lg bg-sky-400 hover:bg-sky-400 capitalize" /> : <button type='submit' className={formBtn1}>submit</button>}
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
