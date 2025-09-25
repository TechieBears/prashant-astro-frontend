import { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Sidebar from '../components/Sidebar/Sidebar';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import HomePage from '../pages/Home/HomePage';
import ServicesPage from '../pages/Home/ServicesPage';
import ServiceDetail from '../pages/Home/ServiceDetail';
import BookingCalendar from '../pages/Home/BookingCalendar';
import ProductsPage from '../pages/Home/ProductsPage';
import HomeNavbar from '../components/HomeComponents/HomeNavbar';
import ErrorPage from './ErrorPage';
import HomeFooter from '../components/HomeComponents/HomeFooter';
import AboutPage from '../pages/Home/AboutPage';
import ContactPage from '../pages/Home/ContactPage';
import LoginPage from '../pages/Login';
import ForgetPassword from '../pages/ForgetPassword';
import ResetPassword from '../pages/ResetPassword';
import Register from '../pages/Register';
import MyAccount from '../pages/Home/Profile/MyAccount';
import CustomerSupport from '../pages/Home/Profile/CustomerSupport';
import Policy from '../pages/Home/Profile/Policy';
import Address from '../pages/Home/Profile/Address';
import Preloaders from '../components/Loader/Preloaders';
import TermsConditions from '../components/HomeComponents/TermsConditions';
// import Bookings from '../pages/Admin/Bookings/Bookings';
import BookingCalender from '../pages/Admin/Bookings/BookingCalender';
import ProductCategories from '../pages/Admin/AllProducts/ProductCategories';
import AllServices from '../pages/Admin/Services/AllServices';
import Employees from '../pages/Admin/UserManagement/Employees';
import UserTransactios from '../pages/Admin/Transactios/UserTransactios';
import Banner from '../pages/Admin/Master/Banner';
import Notifications from '../pages/Admin/Master/Notifications';
import OffersCoupons from '../pages/Admin/Master/OffersCoupons';
import ReferEarn from '../pages/Admin/Master/ReferEarn';
import Testimonials from '../pages/Admin/Master/Testimonials';
import AllUserProfiles from '../pages/Admin/UserManagement/AllUserProfiles';
import AllProducts from '../pages/Admin/AllProducts/AllProducts';
import ProductDetail from '../pages/Home/ProductDetail';
import CartPage from '../pages/Home/CartPage';
import BuyNowPage from '../pages/Home/BuyNowPage';
import { AddressProvider } from '../context/AddressContext';
import PaymentSuccess from '../pages/Home/PaymentSuccess';
import ProductBookings from '../pages/Admin/Bookings/ProductBookings';
import ServiceBookings from '../pages/Admin/Bookings/ServiceBookings';
import ServicesCategories from '../pages/Admin/Services/ServicesCategories';
import { WhatsappIcon } from 'hugeicons-react';
import ProfileLayout from '../components/Profile/ProfileLayout';
import Orders from '../pages/Home/Profile/Orders';
import CustomerFeedback from '../pages/Admin/CustomerFeedback/CustomerFeedback';
import AdminProfile from '../pages/Admin/UserProfile/UserProfile';


const ProjectRoutes = () => {
    const [loading, setLoading] = useState(true);
    const login = useSelector(state => state.user.isLogged);
    const userDetails = useSelector(state => state.user.userDetails);
    const role = userDetails?.user?.role;

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

    // ====== Derived booleans & shared UI blocks ======
    const isAdminOrEmployee = !!(login && role && (role === "admin" || role === "employee"));

    const PublicSite = () => (
        <main className="flex flex-col min-h-screen">
            <HomeNavbar />
            <div className="flex-1 pt-0 lg:pt-28">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={
                        <AddressProvider>
                            <CartPage />
                        </AddressProvider>
                    } />
                    <Route path="/buy-now" element={
                        <AddressProvider>
                            <BuyNowPage />
                        </AddressProvider>
                    } />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                    <Route path="/booking-calendar/:id" element={<BookingCalendar />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route path="/password/reset/:token" element={<ResetPassword />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<ProfileLayout />}>
                        <Route index element={<MyAccount />} />
                        <Route path="address" element={<Address />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="customer-support" element={<CustomerSupport />} />
                        <Route path="privacy-policy" element={<Policy />} />
                    </Route>
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path='*' element={<ErrorPage />} />
                </Routes>
            </div>
            <HomeFooter />
            <a
                href={`https://wa.me/${7890123465}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
            >
                <WhatsappIcon size={30} />
            </a>
        </main>
    );

    return (
        <div className='min-h-screen transition-all duration-300'>
            {loading ? (
                <div className="relative">
                    <HomeNavbar />
                    <Preloaders />
                </div>
            ) : isAdminOrEmployee ? (
                <Sidebar>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/calender" element={<BookingCalender />} />
                        <Route path="/product-bookings" element={<ProductBookings />} />
                        <Route path="/service-bookings" element={<ServiceBookings />} />
                        <Route path="/all-products" element={<AllProducts />} />
                        <Route path="/product-categories" element={<ProductCategories />} />
                        <Route path="/all-services" element={<AllServices />} />
                        <Route
                            path="/service-categories"
                            element={<ServicesCategories />}
                        />
                        <Route path="/all-employees" element={<Employees />} />
                        <Route path="/all-users" element={<AllUserProfiles />} />
                        <Route path="/user-transaction" element={<UserTransactios />} />
                        <Route path="/banner" element={<Banner />} />
                        <Route path="/customerFeedback" element={<CustomerFeedback />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/offersCoupons" element={<OffersCoupons />} />
                        <Route path="/referEarn" element={<ReferEarn />} />
                        <Route path="/testimonials" element={<Testimonials />} />
                        <Route path="/admin-profile" element={<AdminProfile />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </Sidebar>
            ) : (
                <PublicSite />
            )}


            <Toaster position="top-right" reverseOrder={false} />
        </div>
    )
}

export default ProjectRoutes
