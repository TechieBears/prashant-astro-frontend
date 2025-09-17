import { NavLink, useNavigate } from "react-router-dom";
import { Power } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, deleteUser } from "../../redux/Slices/loginSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import DeleteModal from "../Modals/DeleteModal/DeleteModal";

const ProfileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const menuItems = [
    { name: "My Account", path: "/my-account" },
    { name: "My Orders", path: "/orders" },
    { name: "My Address", path: "/address" },
    { name: "Customer Support", path: "/customer-support" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser()).unwrap();
      toast.success(res.message || "Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error || "Logout failed");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await dispatch(deleteUser()).unwrap();
      toast.success(res.message || "Account deleted successfully!");
      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast.error(error || "Account deletion failed");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="w-full sm:w-64 bg-white rounded-xl py-4 border border-[#CAD5E2] h-full">
      <h2 className="font-semibold text-lg mb-4 px-4">My Profile</h2>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `block px-4 py-3 sm:py-4 border-b border-[#E2E8F0] cursor-pointer ${isActive
                  ? "bg-button-vertical-gradient-orange text-white"
                  : "hover:bg-gray-50"
                }`
              }>
                {item.name}
              </NavLink>
            </li>
          ))}
      </ul>

      <div className="mt-8 sm:mt-14 flex flex-col space-y-3 sm:space-y-4 px-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="rounded-lg py-2 hover:bg-gray-100 transition border border-black flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? "Logging out..." : "Logout"}
          <Power className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 transition text-sm sm:text-base"
        >
          Delete Account 🗑
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        toggleModalBtn={() => setShowDeleteModal(false)}
        deleteBtn={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
      />
    </div>
  );
};

export default ProfileSidebar;
