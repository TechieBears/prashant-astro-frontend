import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react';
import { useForm } from "react-hook-form";
import { fileinput, formBtn1, formBtn2, labelClass, tableBtn } from '../../../../utils/CustomClass';
import { Edit } from 'iconsax-reactjs';
import { addHomeBanners, editHomeBanners, getHomeBanners } from '../../../../api';
import { useDispatch } from 'react-redux';
import { setBanner } from '../../../../redux/Slices/masterSlice';
import toast from 'react-hot-toast';
import LoadBox from '../../../Loader/LoadBox';
import Error from '../../../Errors/Error';
import { ImageUpload, bannerLink } from '../../../../env';


export default function BannerForm(props) {
    const [isOpen, setIsOpen] = useState(false)
    const [loader, setLoader] = useState(false)
    const dispatch = useDispatch()
    const toggle = () => setIsOpen(!isOpen);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();


    // ========================= fetch data from api ==============================
    const getAllBannerList = () => {
        try {
            getHomeBanners().then((res) => {
                dispatch(setBanner(res))
            })
        } catch (error) {
            console.log(error)
        }
    }

    // ============================ submit data  =====================================
    const onSubmit = async (data) => {
        if (props?.button !== 'edit') {
            try {
                if (data.image.length != 0) {
                    await ImageUpload(data.image[0], "banner", "banner", data.image[0].name)
                    data.image = `${bannerLink}${data.image[0].name}_banner_${data.image[0].name}`
                } else {
                    data.image = ''
                }
                setLoader(true)
                addHomeBanners(data).then((res) => {
                    if (res?.message === "Data added successfully") {
                        setTimeout(() => {
                            dispatch(setBanner(res));
                            reset();
                            toggle(),
                                setLoader(false),
                                getAllBannerList()
                            toast.success(res.message);
                        }, 1000)
                    }
                })
            } catch (error) {
                setLoader(false);
                console.log('error', error);
            }
        } else {
            try {
                if (data.image.length != 0) {
                    await ImageUpload(data.image[0], "banner", "banner", data.image[0].name)
                    data.image = `${bannerLink}${data.image[0].name}_banner_${data.image[0].name}`
                } else {
                    data.image = props.data.image
                }
                setLoader(true);
                editHomeBanners(props?.data?.id, data).then((res) => {
                    if (res?.message === "Data edited successfully") {
                        setTimeout(() => {
                            dispatch(setBanner(res));
                            reset();
                            toggle(),
                                setLoader(false),
                                getAllBannerList()
                            toast.success(res.message);
                        }, 1000)

                    }
                })
            } catch (error) {
                setLoader(false);
                console.log('error', error);
            }
        }

    }

    // ===================== close modals ===============================
    const closeBtn = () => {
        toggle();
        setLoader(false);
    }

    return (
        <>
            {props.button !== "edit" ? (
                <button onClick={toggle} className={tableBtn}>
                    Add New Banner
                </button>
            ) : (
                <button
                    onClick={toggle}
                    className="bg-yellow-100 px-1.5 py-2 rounded-sm"><Edit size="20" className='text-yellow-500' />
                </button>
            )}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100000]" onClose={() => toggle()}>
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

                                    <Dialog.Title
                                        as="h2"
                                        className="text-lg text-white w-full bg-primary font-tb leading-6 font-semibold py-4 px-3"
                                    >
                                        {props?.title}
                                    </Dialog.Title>
                                    <div className=" bg-slate1">
                                        {/* React Hook Form */}
                                        <form onSubmit={handleSubmit(onSubmit)} >
                                            <div className="py-4 mx-4 customBox">
                                                <div className="">
                                                    <label className={labelClass} htmlFor="main_input">Image*</label>
                                                    <input className={fileinput}
                                                        id="main_input"
                                                        type='file'
                                                        multiple
                                                        accept='image/jpeg,image/jpg,image/png'
                                                        placeholder='Upload Images...'
                                                        {...register("image", { required: props.button == 'edit' ? false : true })} />
                                                    {props?.button == 'edit' && props?.data.image != '' && props?.data.image != undefined && <label className='block mb-1 text-md font-tb font-medium text-blue-800'>
                                                        {props?.data?.image?.split('/').pop()}
                                                    </label>}
                                                    {errors.image && <Error title='Main Image is required*' />}
                                                </div>
                                            </div>

                                            <footer className="py-2 flex bg-white justify-end px-4 space-x-3">
                                                {loader ? <LoadBox className="relative block w-auto px-5 transition-colors font-tb tracking-wide duration-200 py-2.5 overflow-hidden text-base font-semibold text-center text-white rounded-lg bg-primary hover:bg-primary capitalize" /> : <button type='submit' className={formBtn1}>submit</button>}
                                                <button type='button' className={formBtn2} onClick={closeBtn}>close</button>
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
