import { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Sidebar from '../components/Sidebar/Sidebar';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import { useSelector } from 'react-redux';
import UserProfile from '../pages/Admin/UserProfile/UserProfile';
import toast, { Toaster } from 'react-hot-toast';
import HomePage from '../pages/Home/HomePage';
import ServicesPage from '../pages/Home/ServicesPage';
import ProductsPage from '../pages/Home/ProductsPage';
import RegisterPage from '../pages/Home/RegisterPage';
import HomeNavbar from '../components/HomeComponents/HomeNavbar';
import ErrorPage from './ErrorPage';
import HomeFooter from '../components/HomeComponents/HomeFooter';
import AllUserProfiles from '../pages/Admin/AllUserProfiles/AllUserProfiles';
import AboutPage from '../pages/Home/AboutPage';
import ContactPage from '../pages/Home/ContactPage';
import LoginPage from '../pages/Login';
import ForgetPassword from '../pages/ForgetPassword';
import ResetPassword from '../pages/ResetPassword';
import Register from '../pages/Register';
import MyAccount from '../pages/Home/Profile/MyAccount';
import PrivacyPolicy from '../pages/Home/Profile/PrivacyPolicy';
import CustomerSupport from '../pages/Home/Profile/CustomerSupport';
import Address from '../pages/Home/Profile/Address';
import AdminContactUs from '../pages/Admin/ContactUs/AdminContactUs';
import Preloaders from '../components/Loader/Preloaders';
import TermsConditions from '../components/HomeComponents/TermsConditions';
// import PrivacyPolicy from '../components/HomeComponents/PrivacyPolicy';
import DeepLinkRedirect from '../pages/DeepLinkRedirect';
import EmployeeDashboard from '../pages/Employee/Dashboard/EmployeeDashboard';

const ProjectRoutes = () => {
    const [loading, setLoading] = useState(true);
    const login = useSelector(state => state.user.isLogged);
    const user = useSelector(state => state.user.userDetails);
    const role = user?.user?.role;
    // const login = true;
    // const user = { user: { role: "admin" } };

    // ================ loading ================
    useEffect(() => {
        setTimeout(() => setLoading(false), 2800);
    }, []);

    useEffect(() => {
        const updateNetworkStatus = () => {
            navigator.onLine ? toast.success('You are Online') : toast.error('You are Offline')
        };

        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);
        };
    }, []);

    return (
        <div className='min-h-screen transition-all duration-300'>
            {loading ? (
                <Preloaders />
            ) : login && role ? (
                // === Dashboard routes for logged-in admin/employee ===
                <Sidebar>
                    <Routes>
                        <Route path="/" element={role === "admin" ? <Dashboard /> : <EmployeeDashboard />} />
                        {role === "admin" && (
                            <>
                                <Route path="/admin-actors" element={<AllUserProfiles />} />
                                <Route path="/enquiries" element={<AdminContactUs />} />
                                <Route path="/profile" element={<UserProfile />} />
                                <Route path='*' element={<ErrorPage />} />
                            </>
                        )}
                        <Route path='*' element={<ErrorPage />} />
                    </Routes>
                </Sidebar>
            ) : (
                // === Public website routes ===
                <main className="flex flex-col min-h-screen">
                    <HomeNavbar />
                    <div className="flex-1 pt-28">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/forget-password" element={<ForgetPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/my-account" element={<MyAccount />} />
                            <Route path="/customer-support" element={<CustomerSupport />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-conditions" element={<TermsConditions />} />
                            <Route path="/address" element={<Address />} />
                            {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
                            <Route path='*' element={<ErrorPage />} />
                        </Routes>
                    </div>
                    <HomeFooter />
                </main>
            )}

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    )
}

export default ProjectRoutes
