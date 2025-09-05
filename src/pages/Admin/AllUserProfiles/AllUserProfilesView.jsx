import { ArrowLeft } from 'iconsax-reactjs'
import { useState } from 'react';
import PathName from '../../../components/PathName/PathName'
import { useLocation } from 'react-router-dom'
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs'
import userImg from '../../../assets/user.webp';
import ImageGallery from '../../../components/Modals/LightBox/ImageGallery'


function AllUserProfilesView() {
    const location = useLocation();
    const data = location.state;
    const [selectedTab, setSelectedTab] = useState(0);

    // ==================== images array =======================
    const images = [
        {
            url: data?.fssai_url,
            title: data?.fssai
        },
        {
            url: data?.gst_url,
            title: data?.gst
        },
        {
            url: data?.odoc_url,
            title: data?.odoc
        },
        {
            url: data?.pan_url,
            title: data?.pan
        },
    ].filter(image => image?.url !== undefined && image?.url !== '' && image?.url !== 'No Document Uploaded');


    return (
        <>
            <div className="flex items-center justify-between px-6">
                <button className="flex items-center space-x-1 bg-transparent " onClick={() => window.history.back()}>
                    <ArrowLeft size={25} className='text-black' />
                    <span className='fs-3 base-font-600'>Back</span> </button>
                <div className="">
                    <PathName />
                </div>
            </div>
            <div className='grid xl:grid-cols-1 '>
                <div className="bg-white px-10 py-4 mx-5 my-2 mt-5 rounded-xl space-y-3 ">
                    <div className='flex flex-row gap-14 w-full'>
                        <div className='w-36 h-36'>
                            <img loading="lazy" src={data?.profile == null || data?.profile == '' || data?.profile == undefined ? userImg : data?.profile} alt='img' className='w-full h-full rounded-full object-cover' />
                        </div>
                        <div className='flex justify-evenly flex-col'>
                            <div>
                                <h5 className='text-lg font-semibold font-tbMon capitalize'>{data?.first_name} {data?.last_name}</h5>
                                <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.first_name} {data?.email}</h5>
                            </div>
                            <div>
                                <h5 className='font-tbPop text-slate-900 capitalize text-base'>{data?.phone_no}</h5>
                                <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.first_name} {data?.address1}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-white  py-4 mx-5 my-2 rounded-xl space-y-3'>
                    <Tabs selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)}>
                        <TabList className="flex space-x-4 border-b mx-6">
                            <Tab
                                className={`p-3 cursor-pointer font-tbPop font-medium   ${selectedTab === 0 ? 'text-blue-500  border-b-2 border-primary outline-0' : 'text-gray-500 border-b'
                                    }`}
                            >
                                All
                            </Tab>
                            <Tab
                                className={`p-3 cursor-pointer font-tbPop font-medium   ${selectedTab === 1 ? 'text-blue-500  border-b-2 border-primary outline-0' : 'text-gray-500 border-b'
                                    }`}
                            >
                                Documents <span className="inline-flex items-center justify-center w-6 h-6 font-tbPop text-sm font-semibold text-white bg-red-500  rounded-full  ">{images?.length}</span>
                            </Tab>
                        </TabList>

                        {/* ================= All Details component ============== */}
                        <TabPanel className="mx-8 my-2 py-4 ">
                            <h6 className='text-black font-tbMon text-lg font-bold pb-3'>All Details</h6>
                            <div className="grid grid-cols-5 gap-y-8 border-b border-slate-300 pb-5">
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>Company Name</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.comp_name == "" ? '--------' : data?.comp_name}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>Company Type</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.comp_type == "" ? '--------' : data?.comp_type}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>designation</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.designation == "" ? '--------' : data?.designation}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>address</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.address == "" ? '--------' : data?.address}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>address 2</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.address2 == "" ? '--------' : data?.address2}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>alternative phone no</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.alt_phone == "" ? '--------' : data?.alt_phone}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>city</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.city == "" ? '--------' : data?.city}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>state</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.state == "" ? '--------' : data?.state}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>pincode</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.pincode == 0 ? '--------' : data?.pincode}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>landmark</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.landmark == 0 ? '--------' : data?.landmark}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>active</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.isactive ? 'Active' : 'Deactive'}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>verify</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.isverify ? 'Verified' : 'Not Verified'}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>role</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.role == '' ? '--------' : data?.role}</h5>
                                </div>
                            </div>
                            <h6 className='text-black font-tbMon text-lg font-bold pt-3'>Kyc Details</h6>
                            <div className="grid grid-cols-5 gap-y-5 my-4">
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>pan</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.pan == '' ? '--------' : data?.pan}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>gst</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.gst == '' ? '--------' : data?.gst}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>fssai</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.fssai == '' ? '--------' : data?.fssai}</h5>
                                </div>
                                <div>
                                    <h5 className='font-tbPop text-slate-900 capitalize text-base'>odoc</h5>
                                    <h5 className='font-tbPop text-slate-500 capitalize text-sm'>{data?.odoc == '' ? '--------' : data?.odoc}</h5>
                                </div>
                            </div>
                        </TabPanel>
                        {/* ================= Image Gallery component ============== */}
                        <TabPanel className="mx-8 my-2">
                            <ImageGallery images={images} />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default AllUserProfilesView
