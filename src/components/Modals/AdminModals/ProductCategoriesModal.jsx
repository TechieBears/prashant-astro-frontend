import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formBtn1, tableBtn } from '../../../utils/CustomClass';
import LoadBox from '../../Loader/LoadBox';
import TextInput from '../../TextInput/TextInput';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import ImageUploadInput from '../../TextInput/ImageUploadInput';
import { addProductCategory, editProductCategory } from '../../../api';
import { TableTitle } from '../../../helper/Helper';

function ProductCategoriesModal({ edit, userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();

    const formSubmit = async (data) => {
        try {
            setLoader(true);
            const updatedData = {
                name: data?.name,
                image: data?.image
            }

            if (edit) {
                await editProductCategory(userData?._id, updatedData).then(res => {
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
                await addProductCategory(updatedData).then(res => {
                    if (res?.status === 200) {
                        setLoader(false);
                        reset();
                        setRefreshTrigger(prev => prev + 1); // Trigger refreshz
                        toggle();
                        toast.success("Product Category Added Successfully");
                    } else {
                        setLoader(false);
                        toast.error(res?.message || "Something went wrong");
                    }
                })
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setLoader(false);
            toast.error("Failed to add Product Category");
        }
    }


    useEffect(() => {
        if (edit && userData) {
            setValue('name', userData?.name);
            setValue('image', userData?.image);
        }
    }, [edit, userData, reset, setValue]);

    return (
        <>
            {
                edit ? <button onClick={toggle}>
                    <Edit className='text-yellow-500' size={20} />
                </button> : <button onClick={toggle} className={tableBtn}>
                    Create New Category
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
                                        title={edit ? "Edit Category" : "Create New Category"}
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
                                                            Category Name
                                                        </h4>
                                                        <TextInput
                                                            label="Enter Category Name"
                                                            placeholder="Enter Category Name"
                                                            type="text"
                                                            registerName="name"
                                                            props={{ ...register('name', { required: "Category is required" }) }}
                                                            errors={errors.name}
                                                        />
                                                    </div>
                                                    <div className=''>
                                                        <h4
                                                            className="text-sm font-tbLex font-normal text-slate-400 pb-2.5"
                                                        >
                                                            Category Image
                                                        </h4>
                                                        <ImageUploadInput
                                                            label="Upload Category Image"
                                                            multiple={false}
                                                            registerName="image"
                                                            errors={errors.image}
                                                            {...register("image", { required: "Category Image is required" })}
                                                            defaultValue={userData?.image}
                                                            register={register}
                                                            setValue={setValue}
                                                            control={control}
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

export default ProductCategoriesModal
