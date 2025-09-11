import { useState } from "react";
import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";

const MyAccount = () => {
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // construct payload
        const payload = {
            title,
            firstName,
            lastName,
            email,
            phone,
            profileImage,
        };

        console.log("Saving account details:", payload);
        // TODO: dispatch update API here
    };

    return (
        <div className="flex px-40 py-12">
            <ProfileSidebar />
            <div className="flex-1 ml-6 bg-white p-6">
                <h2 className="font-semibold text-lg mb-6">My Account</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label>Title <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                            {["Mr", "Mrs", "Miss", "Baby", "Master"].map((opt, idx) => (
                                <label
                                    key={idx}
                                    className={`px-3 py-2 rounded-xl border text-sm cursor-pointer transition-all duration-150 ${title === opt
                                        ? "border-primary text-primary font-medium"
                                        : "bg-white text-black"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={opt}
                                        checked={title === opt}
                                        onChange={() => setTitle(opt)}
                                        className="hidden"
                                        required
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm">First Name</label>
                        <input
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm">Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm">Phone Number</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm">Profile Image</label>
                        <input
                            type="file"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            className="w-full text-sm bg-[#F8FAFC] h-12"
                        />
                    </div>
                    <div className="col-span-2 flex justify-end mt-12 space-x-4">
                        <button
                            type="button"
                            className="px-6 py-2 border border-black hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-button-vertical-gradient-orange text-white hover:opacity-90 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyAccount;
