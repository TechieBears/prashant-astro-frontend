import React from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoggedUser,
  setLoggedUserDetails,
} from "../../redux/Slices/loginSlice";
import toast from "react-hot-toast";
import { Profile } from "iconsax-reactjs";

const ProfileSidebar = ({ children }) => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = user?.isLogged;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Utility to check if a link is active
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "My Account", path: "/profile/account" },
    { label: "My Orders", path: "/profile/my-orders" },
    { label: "My Address", path: "/profile/address" },
    { label: "Customer Support", path: "/profile/customer-support" },
    { label: "Privacy Policy", path: "/profile/privacy-policy" },
  ];

  const handleLogout = async () => {
    try {
      // TODO: Implement actual logout API call
      localStorage.removeItem("token");
      dispatch(setLoggedUser(false));
      dispatch(setLoggedUserDetails({}));
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="bg-gray-100 py-12 mt-12 px-4">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 bg-white border rounded-2xl p-4 flex flex-col justify-between h-full min-h-[600px]">
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-[#1d2e36] mb-6">
                My Profile
              </h2>

              <nav className="flex flex-col gap-y-2">
                {navItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    {item.path.startsWith("/") ? (
                      <Link
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-3 rounded-lg font-medium transition ${
                          isActive(item.path)
                            ? "bg-purple-100 text-purple-600 border-b"
                            : "hover:bg-gray-100 text-[#1d2e36]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon icon={item.icon} width={22} height={22} />
                          {item.label}
                        </span>
                        <Icon
                          icon="material-symbols-light:keyboard-arrow-right"
                          width={24}
                          height={24}
                        />
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center justify-between px-3 py-3 rounded-lg font-medium transition ${
                          isActive(item.path)
                            ? "bg-purple-100 text-purple-600 border-b"
                            : "hover:bg-gray-100 text-[#1d2e36]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon icon={item.icon} width={22} height={22} />
                          {item.label}
                        </span>
                        <Icon
                          icon="material-symbols-light:keyboard-arrow-right"
                          width={24}
                          height={24}
                        />
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Bottom Action Buttons */}
            {/* {isLoggedIn && ( */}
            <div className="mt-12 space-y-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center py-3 bg-red-100 text-red-600 border border-black font-semibold rounded-lg hover:bg-red-200 transition"
              >
                Logout
                <Icon
                  icon="uiw:poweroff"
                  className="ml-2"
                  width={18}
                  height={18}
                />
              </button>

              <button
                disabled
                className="w-full flex items-center justify-center py-3 bg-red-600 text-white font-semibold rounded-lg 
                        transition opacity-50 cursor-not-allowed"
              >
                Delete Account
                <Icon
                  icon="material-symbols:delete-outline"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </button>
            </div>
            {/* )} */}
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-2xl p-4 lg:p-6 border border-[#CAD5E2]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
