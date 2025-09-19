// src/components/Profile/ProfileLayout.jsx
import { Outlet } from "react-router-dom";
import ProfileSidebar from "../Sidebar/ProfileSidebar";

const ProfileLayout = () => {
  return (
<div class="flex flex-col sm:flex-row px-4 sm:px-6 lg:px-16 pt-16 w-full max-w-[1280px] mx-auto gap-4 mt-10 sm:mt-0 mb-20">
      <aside  >
        <ProfileSidebar />
      </aside>
      <main className="flex-1 rounded-lg bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
