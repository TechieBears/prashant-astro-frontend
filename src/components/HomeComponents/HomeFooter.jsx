import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import footerBg from "../../assets/footer-bg.jpg";
import logo from "../../assets/astroguid logo.png";
import logoText from "../../assets/astroguid logo text.png";
import ClickableContact from "../Common/ClickableContact";

// Dynamic footer data
const footerData = {
    company: {
        name: "Pandit Prashant Suryavanshi",
        description: "Guiding lives through ancient Vedic wisdom with 16+ years of experience in astrology, Vastu Shastra, and spiritual guidance.",
        logo: logo,
        logoText: logoText
    },
    quickLinks: [
        { label: "Home", path: "/" },
        { label: "About Us", path: "/about" },
        { label: "Services", path: "/services" },
        { label: "Products", path: "/products" },
        { label: "Contact", path: "/contact" }
    ],
    contactInfo: {
        phone: "+91 86930 00900",
        email: "services@astroguid.com",
        location: "Online Consultations Available"
    },
    ctaButton: {
        text: "Book Consultation",
        path: "/services"
    },
    copyright: "© 2025 Pandit Prashant Suryavanshi. All rights reserved.",
    legalLinks: [
        { label: "Privacy Policy", path: "/profile/privacy-policy" },
        { label: "Terms of Service", path: "/terms-conditions" },
    ]
};

const HomeFooter = () => {
    const navigate = useNavigate();

    // Get service categories from Redux store (already fetched in HomePage)
    const serviceCategories = useSelector(state => state.appRoot.serviceCategories);

    return (
        <footer
            className="relative w-full text-white bg-cover bg-center"
            style={{
                backgroundImage: `url(${footerBg})`,
            }}
        >
            <div className="absolute inset-0 bg-black/70"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={() => {
                                navigate("/");
                                window.scrollTo(0, 0, { behavior: "smooth" });
                            }}
                            className="flex items-center gap-2"
                        >
                            <img src={footerData.company.logo} alt="logo" className="h-10 md:h-12" />
                            <img
                                src={footerData.company.logoText}
                                alt={footerData.company.name}
                                className="hidden sm:block h-6 md:h-7 mt-1"
                            />
                        </button>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {footerData.company.description}
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-base font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        {footerData.quickLinks.map((link, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => navigate(link.path)}
                                    className="hover:text-white"
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Our Services */}
                <div>
                    <h3 className="text-base font-semibold mb-4">Our Services</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        {serviceCategories && serviceCategories.length > 0 ? (
                            serviceCategories?.map((category) => (
                                <li key={category._id}>
                                    <button
                                        onClick={() => navigate(`/services?category=${encodeURIComponent(category.name)}`)}
                                        className="hover:text-white transition-colors text-left"
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))
                        ) : (
                            // Show nothing if Redux state is empty (data is loading)
                            <li className="text-gray-400 text-sm">Loading services...</li>
                        )}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-base font-semibold mb-4">Contact Info</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                            <Phone size={16} />
                            <ClickableContact
                                type="whatsapp"
                                value={footerData.contactInfo.phone}
                                hoverColor="hover:text-white"
                            />
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={16} />
                            <ClickableContact
                                type="email"
                                value={footerData.contactInfo.email}
                                hoverColor="hover:text-white"
                            />
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} /> {footerData.contactInfo.location}
                        </li>
                    </ul>
                    <button
                        onClick={() => navigate(footerData.ctaButton.path)}
                        className="mt-4 w-full bg-white/20 text-white py-2.5 rounded-md font-medium border border-white/30 hover:bg-white/30 transition"
                    >
                        {footerData.ctaButton.text}
                    </button>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 border-t border-white/20 mt-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>{footerData.copyright}</p>
                    <div className="flex gap-6 mt-2 md:mt-0">
                        {footerData.legalLinks.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(link.path)}
                                className="hover:text-white"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;