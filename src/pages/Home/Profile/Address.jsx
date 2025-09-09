"use client";
import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";

export default function Address() {

    return (
        <>
            <div className="flex px-40 py-12">
                <ProfileSidebar />
                <div className="flex-1 ml-6 bg-white p-4">
                    <h2 className="font-semibold text-lg mb-6">Address</h2>

                    <div className="grid grid-cols-12 gap-4">
                        {/* Address card (6 cols → 2 per row) */}
                        <div className="col-span-6 bg-[#F1F5F9] p-4 rounded-lg inline-flex justify-between">
                            <div>
                                <h2 className="font-semibold text-lg">John Doe</h2>
                                <p>9879879877</p>
                                <p>Worli, Mumbai-18</p>
                            </div>
                            <div className="ml-4">
                                <button className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                                <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                            </div>
                        </div>
                    </div>

                </div>



            </div>
        </>
    );
}
