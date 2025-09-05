import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react';
import { formBtn1 } from '../../../utils/CustomClass';

const ImageView = ({ isOpen, toggle, files }) => {
    return (
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
                <div className="fixed inset-0 ">
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
                                <Dialog.Title
                                    as="h2"
                                    className="text-lg text-white w-full bg-primary font-tb leading-6 font-semibold py-4 px-3"
                                >
                                    Uploaded Image Preview
                                </Dialog.Title>
                                <div className=" bg-slate1 ">
                                    <div className="p-4 overflow-y-scroll scrollbars h-[24rem] lg:h-[30rem] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-wrap" >
                                        {files.map((file, index) => (
                                            <div key={index} className="bg-white rounded-xl p-1 h-[17.50rem] ">
                                                <img
                                                    src={file?.url || (file instanceof File ? URL.createObjectURL(file) : '')}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-[15rem] object-contain bg-slate1 rounded-xl"
                                                />
                                                <h6 className=" text-sm truncate p-2 font-tbPop">{file.name}</h6>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <footer className="py-2 flex bg-white justify-end px-4 space-x-3">
                                    <button type='button' className={`${formBtn1}  bg-gradient-to-tl to-transparent from-transparent !bg-transparent border border-primary !text-primary`} onClick={() => toggle()}>close</button>
                                </footer>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}

export default ImageView
