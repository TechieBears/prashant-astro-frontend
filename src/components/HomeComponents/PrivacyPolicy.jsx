const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8  mt-20 md:mt-28 font-tbPop">
            {/* Animated background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-indigo-100 opacity-20 blur-3xl animate-float1"></div>
                <div className="absolute top-2/3 right-1/5 w-56 h-56 rounded-full bg-purple-100 opacity-20 blur-3xl animate-float2"></div>
                <div className="absolute bottom-1/4 left-1/3 w-52 h-52 rounded-full bg-blue-100 opacity-20 blur-3xl animate-float3"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Elegant header */}
                <div className=" mb-12">
                    <h1 className="text-3xl font-tbLex font-bold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-primary leading-tight tracking-tight mb-3">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-sm text-gray-600 max-w-xl  font-normal">
                        Your trust is important to us. This policy explains how we handle your personal information.
                    </p>
                </div>

                {/* Compact content container */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-xs relative">

                    <div className="px-5 py-6 sm:px-6">
                        <div className="space-y-8">
                            <Section
                                title="Consent"
                                icon="check-circle"
                                gradient="from-indigo-500 to-blue-500"
                            >
                                <p className="text-gray-700 leading-relaxed font-tbPop text-sm">
                                    By using our services, you acknowledge that you have read and understood this Privacy Policy
                                    and agree to how we collect, use, and disclose your information as described herein.
                                </p>
                            </Section>

                            <Section
                                title="Information Collection"
                                icon="database"
                                gradient="from-purple-500 to-fuchsia-500"
                            >
                                <div className="space-y-3 text-gray-700 leading-relaxed text-sm font-tbPop">
                                    <p>
                                        We collect various types of information to provide and improve our services:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-white/20">
                                            <h4 className="font-medium text-indigo-700 mb-1.5 flex items-center text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                                </svg>
                                                Direct Information
                                            </h4>
                                            <p className="text-xs text-gray-600 font-tbPop">Data you provide when registering or using our services</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 rounded-lg border border-white/20">
                                            <h4 className="font-medium text-purple-700 mb-1.5 flex items-center text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                </svg>
                                                Automatic Information
                                            </h4>
                                            <p className="text-xs text-gray-600 font-tbPop">Data collected via cookies and similar technologies</p>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            <Section
                                title="Data Usage"
                                icon="lightning-bolt"
                                gradient="from-amber-500 to-orange-500"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg blur opacity-10"></div>
                                    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100/50">
                                        <ul className="space-y-2 text-gray-700 text-sm">
                                            {[
                                                "Service provision and maintenance",
                                                "Personalization and improvements",
                                                "Understanding user behavior",
                                                "Feature development",
                                                "Professional connections",
                                                "Communication",
                                                "Security and fraud prevention"
                                            ].map((item, index) => (
                                                <li key={index} className="flex items-start group">
                                                    <span className="flex-shrink-0 mt-1 mr-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 group-hover:bg-orange-500 transition-colors"></div>
                                                    </span>
                                                    <span className="text-xs">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Section>

                            <Section
                                title="Your Rights"
                                icon="shield-check"
                                gradient="from-emerald-500 to-teal-500"
                            >
                                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                                    <p>
                                        Under GDPR, you have specific rights regarding your personal data:
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                                        {[
                                            {
                                                title: "Access",
                                                icon: "eye",
                                                desc: "Request copies of your data"
                                            },
                                            {
                                                title: "Rectification",
                                                icon: "pencil",
                                                desc: "Correct inaccurate information"
                                            },
                                            {
                                                title: "Erasure",
                                                icon: "trash",
                                                desc: "Request deletion under conditions"
                                            },
                                            {
                                                title: "Restriction",
                                                icon: "lock-closed",
                                                desc: "Limit data processing"
                                            },
                                            {
                                                title: "Objection",
                                                icon: "ban",
                                                desc: "Object to certain processing"
                                            },
                                            {
                                                title: "Portability",
                                                icon: "paper-airplane",
                                                desc: "Request data transfer"
                                            }
                                        ].map((right, index) => (
                                            <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-lg border border-white/20 group hover:border-emerald-200 transition-all duration-200">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-2.5">
                                                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white group-hover:from-emerald-500 group-hover:to-teal-500 transition-all">
                                                            <Icon name={right.icon} className="h-3 w-3" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-emerald-700 mb-0.5 text-xs">{right.title}</h4>
                                                        <p className="text-2xs text-gray-600">{right.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 bg-white p-3 rounded-lg border border-emerald-100 shadow-xs group hover:shadow-sm transition-all">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mr-2.5">
                                                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                                                    <Icon name="chat-alt" className="h-3 w-3" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-0.5 text-xs font-tbPop">Contact Us</h4>
                                                <p className="text-2xs text-gray-600 font-tbPop">
                                                    To exercise your rights, contact our DPO at{' '}
                                                    <a href="https://mail.google.com/mail/?view=cm&to=hamax.online@gmail.com" className="text-emerald-600 hover:underline" target="_blank">hamax.online@gmail.com</a>.
                                                    We respond within 30 days.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </div>
                    </div>
                </div>

                {/* Minimal footer */}
                <div className="mt-8 text-end relative">
                    <div className="inline-flex items-center text-xs text-gray-500 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-xs border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Last updated: {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Floating animation styles */}
            <style jsx>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(10px, 10px) rotate(1deg); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-10px, 10px) rotate(-1deg); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(5px, -5px) rotate(0.5deg); }
                }
                .animate-float1 { animation: float1 8s ease-in-out infinite; }
                .animate-float2 { animation: float2 10s ease-in-out infinite; }
                .animate-float3 { animation: float3 12s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

const Icon = ({ name, className }) => {
    const icons = {
        'check-circle': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        'database': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
            </svg>
        ),
        'lightning-bolt': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
        ),
        'shield-check': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        'eye': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
        ),
        'pencil': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
        ),
        'trash': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
        'lock-closed': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
        ),
        'ban': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
        ),
        'paper-airplane': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
        ),
        'chat-alt': (
            <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
        )
    };

    return icons[name] || null;
};

const Section = ({ title, children, icon, gradient }) => {
    return (
        <div className="group">
            <div className="flex items-start">
                <div className={`flex-shrink-0 mr-4 mt-0.5 p-2.5 rounded-lg bg-gradient-to-br ${gradient} shadow-sm group-hover:shadow transition-shadow duration-200`}>
                    <Icon name={icon} className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold font-tbLex text-gray-900 mb-3">
                        {title}
                    </h3>
                    <div className="text-sm font-tbPop">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
