import { useState } from "react";
import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";

const MyAccount = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: "",
        profileImage: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    return (
        <div className="flex px-40 py-12">
            <ProfileSidebar />
            {/* Main Content */}
            <div className="flex-1 ml-6 bg-white p-6">
                <h2 className="font-semibold text-lg mb-6">My Account</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-sm">Fullname</label>
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Enter fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Enter last name"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Profile Image</label>
                        <input
                            type="file"
                            name="profileImage"
                            onChange={handleChange}
                            className="w-full text-sm bg-[#F8FAFC] h-12"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-12 space-x-4">
                    <button className="px-6 py-2 border border-black hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-button-vertical-gradient-orange text-white hover:opacity-90 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
