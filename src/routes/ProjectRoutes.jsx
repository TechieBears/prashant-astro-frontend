import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from '../components/Sidebar/Sidebar';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import HomePage from '../pages/Home/HomePage';
import ServicesPage from '../pages/Home/ServicesPage';
import ServiceDetail from '../pages/Home/ServiceDetail';
import BookingCalendarUser from '../pages/Home/BookingCalendar';
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
import Reviews from '../pages/Admin/Master/Reviews';
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
import ProtectedRoute from '../components/ProtectedRoute'
import VenueCalendar from '../pages/Admin/Bookings/AdminBookingsCalender';
import ReferAndEarn from '../pages/Home/Profile/ReferAndEarn';
import ZoomMeeting from '../pages/Meeting/ZoomMeeting';
import TalkWithAstrologer from '../pages/Home/TalkWithAstrologer';
import AstrologerDetail from '../pages/Home/AstrologerDetail';
import Wallet from '../pages/Wallet/Wallet';
import CallHistory from '../pages/Home/Profile/CallHistory';

const ProjectRoutes = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user.userDetails);
    const location = useLocation();
    const isMeetingPage = location.pathname === '/meeting';

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
                <div className="relative">
                    <Preloaders />
                </div>
            ) : user?.role == "admin" || user?.role == "employee" || user?.role == "astrologer" ? (
                <Sidebar>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Dashboard />
                            }
                        />
                        <Route
                            path="/calender"
                            element={
                                <ProtectedRoute>
                                    <BookingCalender />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin-calender"
                            element={
                                <ProtectedRoute>
                                    <VenueCalendar />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/product-bookings"
                            element={
                                <ProtectedRoute>
                                    <ProductBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/service-bookings"
                            element={
                                <ProtectedRoute>
                                    <ServiceBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/all-products"
                            element={
                                <ProtectedRoute>
                                    <AllProducts />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/product-categories"
                            element={
                                <ProtectedRoute>
                                    <ProductCategories />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/all-services"
                            element={
                                <ProtectedRoute>
                                    <AllServices />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/service-categories"
                            element={
                                <ProtectedRoute>
                                    <ServicesCategories />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/all-employees"
                            element={
                                <ProtectedRoute>
                                    <Employees />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/all-users"
                            element={
                                <ProtectedRoute>
                                    <AllUserProfiles />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user-transaction"
                            element={
                                <ProtectedRoute>
                                    <UserTransactios />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/banner"
                            element={
                                <ProtectedRoute>
                                    <Banner />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customerFeedback"
                            element={
                                <ProtectedRoute>
                                    <CustomerFeedback />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notifications"
                            element={
                                <ProtectedRoute>
                                    <Notifications />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/offersCoupons"
                            element={
                                <ProtectedRoute>
                                    <OffersCoupons />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/referEarn"
                            element={
                                <ProtectedRoute>
                                    <ReferEarn />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/testimonials"
                            element={
                                <ProtectedRoute>
                                    <Testimonials />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reviews"
                            element={
                                <ProtectedRoute>
                                    <Reviews />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin-profile"
                            element={
                                <ProtectedRoute>
                                    <AdminProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/meeting" element={<ZoomMeeting />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </Sidebar>

            ) : (
                <main className="flex flex-col min-h-screen">
                    <HomeNavbar />
                    <div className={`flex-1 ${isMeetingPage ? 'pt-16' : 'pt-0 lg:pt-28'}`}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/talk-with-astrologer" element={<TalkWithAstrologer />} />
                            <Route path="/astrologer/:id" element={<AstrologerDetail />} />
                            <Route path="/wallet" element={<Wallet />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route
                                path="/cart"
                                element={
                                    <ProtectedRoute>
                                        <AddressProvider>
                                            <CartPage />
                                        </AddressProvider>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/buy-now"
                                element={
                                    <ProtectedRoute>
                                        <AddressProvider>
                                            <BuyNowPage />
                                        </AddressProvider>
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/services/:id" element={<ServiceDetail />} />
                            <Route path="/booking-calendar/:id" element={
                                <ProtectedRoute>
                                    <AddressProvider>
                                        <BookingCalendarUser />
                                    </AddressProvider>
                                </ProtectedRoute>
                            } />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/forget-password" element={<ForgetPassword />} />
                            <Route path="/password/reset/:token" element={<ResetPassword />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <AddressProvider>
                                        <ProfileLayout />
                                    </AddressProvider>
                                </ProtectedRoute>
                            }>
                                <Route index element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                                <Route path="address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
                                <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                                <Route path="call-history" element={<ProtectedRoute><CallHistory /></ProtectedRoute>} />
                                <Route path="refer-and-earn" element={<ProtectedRoute><ReferAndEarn /></ProtectedRoute>} />
                                <Route path="customer-support" element={<ProtectedRoute><CustomerSupport /></ProtectedRoute>} />
                            </Route>
                            <Route path="/privacy-policy" element={<Policy />} />
                            <Route path="/terms-conditions" element={<TermsConditions />} />
                            <Route
                                path="/payment-success"
                                element={
                                    <ProtectedRoute>
                                        <PaymentSuccess />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/meeting" element={<ZoomMeeting />} />

                            <Route path='*' element={<ErrorPage />} />
                        </Routes>
                    </div>
                    <HomeFooter />
                    <a
                        href={`https://wa.me/${8693000900}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                    >
                        <WhatsappIcon size={30} />
                    </a>
                </main>
            )}

        </div>
    )
}

export default ProjectRoutes