import { NavLink } from "react-router-dom";
import { Power } from "lucide-react";

const ProfileSidebar = () => {
    const menuItems = [
        { name: "My Account", path: "/my-account" },
        { name: "My Orders", path: "/orders" },
        { name: "My Address", path: "/address" },
        { name: "Customer Support", path: "/customer-support" },
        { name: "Privacy Policy", path: "/privacy-policy" },
    ];

    return (
        <div className="w-64 bg-white rounded-xl py-4 border border-[#CAD5E2]">
            <h2 className="font-semibold text-lg mb-4 px-4">My Profile</h2>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `block px-4 py-4 border border-[#E2E8F0] cursor-pointer ${isActive
                                    ? "bg-button-vertical-gradient-orange text-white"
                                    : "hover:bg-gray-100"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="mt-14 flex flex-col space-y-4 px-4">
                <button className="rounded-lg py-2 hover:bg-gray-100 transition border border-black flex items-center justify-center gap-1">
                    Logout
                    <Power className="w-4 h-4" />
                </button>
                <button className="bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 transition">
                    Delete Account 🗑
                </button>
            </div>

        </div>
    );
};

export default ProfileSidebar;
