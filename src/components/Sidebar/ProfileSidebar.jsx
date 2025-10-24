import { NavLink, useNavigate } from "react-router-dom";
import { Power } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess, deleteUserSuccess, setLoading, setError } from "../../redux/Slices/loginSlice";
import { logoutUser, deleteUser } from "../../api";
import { clearCart } from "../../redux/Slices/cartSlice";
import toast from "react-hot-toast";
import { useState } from "react";
import DeleteModal from "../Modals/DeleteModal/DeleteModal";
import { ArrowRight01Icon } from "hugeicons-react";

const ProfileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const menuItems = [
    { name: "My Account", path: "/profile" },
    { name: "My Orders", path: "/profile/orders" },
    { name: "Refer & Earn", path: "/profile/refer-and-earn" },
    { name: "My Address", path: "/profile/address" },
    { name: "Customer Support", path: "/profile/customer-support" },
    { name: "Privacy Policy", path: "/profile/privacy-policy" },
  ];

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));

      const response = await logoutUser();

      if (response.success) {
        dispatch(logoutSuccess());
        dispatch(clearCart());
        toast.success(response.message || "Logged out successfully!");
        navigate("/");
      } else {
        dispatch(setError(response.message || "Logout failed"));
        toast.error(response.message || "Logout failed");
      }
    } catch (error) {
      dispatch(setError(error.message || "Logout failed"));
      toast.error(error.message || "Logout failed");
      // Fallback: clear local storage and navigate
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(setLoading(true));

      const response = await deleteUser();

      if (response.success) {
        dispatch(logoutSuccess());
        dispatch(clearCart());
        navigate("/");
        toast.success(response.message || "Account deleted successfully!");
        setShowDeleteModal(false);
      } else {
        dispatch(setError(response.message || "Account deletion failed"));
        toast.error(response.message || "Account deletion failed");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.log("error", error);
      dispatch(setError(error.message || "Account deletion failed"));
      toast.error(error.message || "Account deletion failed");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="w-full sm:w-64  bg-white rounded-xl py-4 border border-[#CAD5E2]  hidden lg:flex flex-col justify-between">
      <div>
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
                <div className="flex flex-row items-center justify-between">
                  <span>{item.name} </span>
                  <ArrowRight01Icon size={20} />
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className=" mt-14  flex flex-col space-y-3 sm:space-y-4 px-4">
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
