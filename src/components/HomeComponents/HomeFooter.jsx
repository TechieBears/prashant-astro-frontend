import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import footerBg from "../../assets/footer-bg.jpg";

const HomeFooter = () => {
    const navigate = useNavigate();

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
                        <h2 className="text-lg font-semibold">Pandit Prashant</h2>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Guiding lives through ancient Vedic wisdom with 16+ years of
                        experience in astrology, Vastu Shastra, and spiritual guidance.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-base font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><button onClick={() => navigate("/")} className="hover:text-white">Home</button></li>
                        <li><button onClick={() => navigate("/about")} className="hover:text-white">About Us</button></li>
                        <li><button onClick={() => navigate("/services")} className="hover:text-white">Services</button></li>
                        <li><button onClick={() => navigate("/testimonials")} className="hover:text-white">Testimonials</button></li>
                        <li><button onClick={() => navigate("/contact")} className="hover:text-white">Contact</button></li>
                    </ul>
                </div>

                {/* Our Services */}
                <div>
                    <h3 className="text-base font-semibold mb-4">Our Services</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>Kundli Analysis</li>
                        <li>Vastu Consultation</li>
                        <li>Marriage Compatibility</li>
                        <li>Numerology Reading</li>
                        <li>Gemstone Consultation</li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-base font-semibold mb-4">Contact Info</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                            <Phone size={16} /> +91 98765 43210
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={16} /> pandit.prashant@example.com
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} /> Online Consultations Available
                        </li>
                    </ul>
                    <button
                        onClick={() => navigate("/services")}
                        className="mt-4 w-full bg-white/20 text-white py-2.5 rounded-md font-medium border border-white/30 hover:bg-white/30 transition"
                    >
                        Book Consultation
                    </button>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 border-t border-white/20 mt-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© 2025 Pandit Prashant Suryavanshi. All rights reserved.</p>
                    <div className="flex gap-6 mt-2 md:mt-0">
                        <button className="hover:text-white">Privacy Policy</button>
                        <button className="hover:text-white">Terms of Service</button>
                        <button className="hover:text-white">Disclaimer</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;