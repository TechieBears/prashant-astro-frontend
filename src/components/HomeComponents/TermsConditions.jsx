import { memo } from 'react';

const styles = {
    container: "min-h-screen bg-gradient-to-br from-orange-50 via-primary-light to-base-bg py-8 px-4 sm:px-6 lg:px-8 mt-20 md:mt-28 font-tbPop",
    contentWrapper: "max-w-5xl mx-auto relative z-10",
    header: "mb-12",
    title: "text-3xl font-bold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary-orange to-primary leading-tight mb-3 font-tbLex tracking-tight",
    subtitle: "mt-3 text-sm text-gray-600 max-w-xl font-normal font-tbPop",
    contentCard: "bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-orange-100/50 shadow-lg relative",
    contentInner: "px-5 py-6 sm:px-8",
    mainHeading: "font-semibold text-xl mb-4 text-gray-900",
    subHeading: "text-lg font-semibold mt-6 mb-3 text-gray-800",
    subSubHeading: "text-base font-semibold mt-4 mb-2 text-gray-800",
    paragraph: "text-gray-700 mb-4 text-base leading-relaxed",
    list: "list-disc pl-6 space-y-2 mb-4 text-gray-700 text-base",
    importantBox: "bg-primary-light border-l-4 border-primary p-4 my-4 rounded-r-lg",
    footer: "mt-8 text-end relative",
    footerBadge: "inline-flex items-center text-xs text-gray-500 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-xs border border-orange-100/50"
};

const TermsConditions = () => {
    return (
        <div className={styles.container}>
            {/* Animated background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-orange-200 opacity-20 blur-3xl animate-float1"></div>
                <div className="absolute top-2/3 right-1/5 w-56 h-56 rounded-full bg-primary-light opacity-25 blur-3xl animate-float2"></div>
                <div className="absolute bottom-1/4 left-1/3 w-52 h-52 rounded-full bg-orange-300 opacity-20 blur-3xl animate-float3"></div>
            </div>

            <div className={styles.contentWrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        Terms of Service
                    </h1>
                    <p className={styles.subtitle}>
                        Please read these Terms of Service carefully before using our services
                    </p>
                </div>

                {/* Main Content */}
                <div className={styles.contentCard}>
                    <div className={styles.contentInner}>
                        <div className="space-y-6">
                            {/* Introduction */}
                            <div className={styles.importantBox}>
                                <p className={styles.paragraph}>
                                    Please read these Terms of Service before using the Services provided by Astroguid.com via our Website (which is currently located at www.Astroguid.com). By clicking the "I Agree" button, you agree to these Terms of Service.
                                </p>
                                <p className={styles.paragraph}>
                                    These terms may be amended by Astroguid.com at any time with posted changes on our website. If you become a member before the posted changes, the changes will take effect 30 days after they are initially posted on our website. You agree that your continued use of this website after such amendments indicates your acceptance of the change. This Agreement may not be otherwise amended except by a written agreement signed by both you and Astroguid.com.
                                </p>
                            </div>

                            {/* Definition */}
                            <section>
                                <h2 className={styles.mainHeading}>Definition of Astroguid.com</h2>
                                <p className={styles.paragraph}>
                                    Using Astroguid.com, you can receive astrological content, reports, data, telephone and email consultations ("Content") via the World Wide Web, and electronic mail. However, some Content may be accessed simply by visiting the Astroguid.com site (the "Free Services" and "Paid Service"). In order to get access to the personalised astrological zone and/or receive additional Content and services from Astroguid.com (the "Paid Services"), you will have to register as a member of Astroguid.com to receive certain Paid Services. The Free Services and the Paid Services are referred to collectively in these Terms of Service as the "Services."
                                </p>
                            </section>

                            {/* Paid Services */}
                            <section>
                                <h3 className={styles.subHeading}>Considering the Paid Services, Member agrees to the following:</h3>
                                <ul className={styles.list}>
                                    <li>Provide particular current, complete, and correct personal and other necessary information about member as prompted to do so by Astroguid.com.</li>
                                    <li>Keep the information updated as required to keep it current, complete and correct. All information that We request and You provide on original sign-up, and all updates thereto, are referred to in these Terms of Service as "Registration Data." Many of the Services and Content are provided by third-party suppliers and not by Astroguid.com.</li>
                                </ul>
                            </section>

                            {/* Eligibility */}
                            <section>
                                <h2 className={styles.mainHeading}>Eligibility of Members</h2>
                                <p className={styles.paragraph}>
                                    The Services are available only to individuals who can form legally binding contracts under applicable law. Without limiting the aforementioned, the Services are not permitted to be consumed by minors (who, in most jurisdictions, are individuals under the age of 18) or members of the website (Astroguid.com) who are temporarily or indefinitely suspended. In addition, Astroguid.com does not permit the use of the Services by residents (a.) of any jurisdiction that may prohibit our Services or (b.) of any country that is prohibited by law, regulation, treaty or administrative act from entering into trade relations. Please do not use the Services if you do not qualify.
                                </p>
                            </section>

                            {/* Registration */}
                            <section>
                                <h2 className={styles.mainHeading}>Member Registration Information</h2>
                                <p className={styles.paragraph}>
                                    Once you register with us, including your provision of Registration Data, you will receive a Astroguid.com identification ("YOUR EMAIL ID") and a password. You are entirely responsible if you do not maintain the confidentiality of your Astroguid.com Email ID and password. You are responsible for any use of your account, whether or not you authorised it. You can change Your password by following the instructions on the Website. You agree not to sell or transfer your account, email, or password to another party. You agree to let Astroguid.com know if someone uses your account without permission or if there is another security breach.
                                </p>
                            </section>

                            {/* Access */}
                            <section>
                                <h2 className={styles.mainHeading}>Our Access to Your Account</h2>
                                <p className={styles.paragraph}>
                                    To keep Astroguid.com services good and responding to customer needs, You agree to let Astroguid.com employees and agents see Your account and records when there's a complaint or suspected abuse.
                                </p>
                            </section>

                            {/* Modification */}
                            <section>
                                <h2 className={styles.mainHeading}>Modification to Services; Violation; Termination</h2>
                                <p className={styles.paragraph}>
                                    Astroguid.com may make modifications or discontinue (in whole or in part) the Services or Your account with us, with or without notice, for any reason without liability to You, any other user, or any third party. Without limiting the foregoing, We reserve the right to terminate Your account immediately (a) if We are unable to verify or authenticate Your Registration Data or other information provided by You, (b) if We believe that Your actions may cause legal liability for You, Astroguid.com, or all or some of Our other users, or (c) if We believe You have (i) provided us with false or misleading Registration Data or other information, (ii) interfered with other users or the administration of the Services, or (iii) violated these Terms of Service or our Privacy Policy.
                                </p>
                            </section>

                            {/* Privacy Policy */}
                            <section>
                                <h2 className={styles.mainHeading}>Privacy Policy</h2>
                                <p className={styles.paragraph}>
                                    Privacy is very important to us, and as such, Our Privacy Policy, as it may be updated from time to time, available on the Website, is incorporated into these Terms of Service by this reference. We may change Our Privacy Policy if we make changes to these Terms of Service (as described in the Preamble above).
                                </p>
                            </section>

                            {/* Delivery, Cancellation and Refund Policy */}
                            <section>
                                <h2 className={styles.mainHeading}>Delivery, Cancellation and Refund Policy</h2>
                                <ul className={styles.list}>
                                    <li><strong>(A)</strong> If any order has reached the "processing" (assigned to an astrologer) stage, no refund shall be processed on the order or any reports under any circumstances. The user will remain accountable for the act of placing an order hastily and carelessly. The website will not be responsible or liable for any refund once the processing of an order has started.</li>
                                    <li><strong>(B)</strong> Once the order has been placed and completed, no refund will be processed. However, if the user plans to cancel a successfully placed order before the completion of the order process, the user will need to contact the customer care team within an hour (1 hour) of making the transaction. After this, it will be at the sole discretion of the website whether or not to provide a refund.</li>
                                    <li><strong>(C)</strong> If there is any technical delay or glitch notified on the website during the order processing request, including reports generated by the service provider, i.e., the user shall not be eligible to claim refunds, the user acknowledges that the timelines are approximate and all necessary steps will be taken to comply with the timelines as demonstrated.</li>
                                    <li><strong>(D)</strong> No refund shall be processed if inaccurate or incorrect information or data has been provided by the user. The user consents to be cautious while providing any information to the website and must re-assess the information given before clicking on "Submit." The user can request a correction of the incorrect information or data provided. The request for such corrections must be made with customer care within 1 hour of the service rendered by the service provider.</li>
                                    <li><strong>(E)</strong> Any delay in the activation of the subscription services may result in a prorated refund.</li>
                                    <li><strong>(F)</strong> No refund shall be issued if users provide the wrong contact number to avail of the "Call with Astrologer" feature. The user who opts for this feature is advised to keep the contact number in the full coverage area and must be available to receive and answer the call when received. No refund will be issued for any call that gets connected.</li>
                                    <li><strong>(H)</strong> If any refund is processed, it will be done following the deduction of the transaction charges levied by the bank and/or the payment gateway, to and fro the cost of the shipping and/or courier charges (concerning the purchase of a product listed on the website), customs duty (if levied), and/or any other charges that may have been incurred by the website during processing and/or delivering the service, as applicable.</li>
                                    <li><strong>(I)</strong> In case the website or payment gateway's webpage that is linked to the website is experiencing any server-related issues (like - slowing down/failure/session timeout), the user shall check whether his/her bank account has been debited or not before initiating the second payment and then resort to one of the following options: In case the bank account appears to be debited, ensure that you do not make the payment twice, and immediately thereafter, contact the website via customer care to confirm the payment. If the bank account is not debited, the user may initiate a fresh transaction to make a payment. However, if more than one payment is made, even after the above precautions against the same order, they shall be refunded fully without any deduction of the transaction charges as mentioned above. The cost of one single payment for the service, as intended to be placed by the user, shall be retained by the website.</li>
                                </ul>
                                <p className={styles.paragraph}>
                                    The website reserves the right to refuse or cancel any order for any reason at its sole discretion, including orders that it is unable to accept and must be cancelled. Some of the situations that may result in the order being cancelled include, without limitation, the non-availability of the service, inaccuracies, errors in pricing information or other identified problems. The amount paid for the booking will be refunded if the user's order is cancelled after charges have been made against the said service.
                                </p>
                            </section>

                            {/* Member Conduct */}
                            <section>
                                <h2 className={styles.mainHeading}>Member Conduct and Restrictions; Compliance with Laws</h2>
                                <p className={styles.paragraph}>
                                    Your right to use the Services is personal to You. You represent that You are an individual and that You are not a corporation or other business entity. You agree not to sell or use the Services for commercial purposes without Astroguid.com's written consent. You are solely responsible for the content of Your transmissions through Our Website. Your use of the Services is subject to all applicable local, state, national and international laws and regulations. You agree:
                                </p>
                                <ul className={styles.list}>
                                    <li>to comply with all Indian laws regarding the transmission of technical data exported from India through the Service;</li>
                                    <li>not to use the Website or the Services for illegal purposes;</li>
                                    <li>not to interfere or disrupt networks connected to Astroguid.com;</li>
                                    <li>to comply with all applicable regulations, policies and procedures of networks connected to the Astroguid.com Website; and</li>
                                    <li>to comply with all applicable domestic and international laws, statutes, ordinances and regulations regarding Your use of the Services. Astroguid.com makes use of the Internet to send and receive certain messages; therefore, Your conduct is subject to Internet regulations, policies, and procedures. You will not use Astroguid.com for chain letters, junk mail, spamming, or any use of distribution lists to any person who has not been given specific permission to be included in such a process.</li>
                                </ul>
                                <p className={styles.paragraph}>
                                    You agree not to transmit through Astroguid.com any unlawful, harassing, libellous, abusive, threatening, harmful, vulgar, obscene or otherwise objectionable material of any kind or nature. You further agree not to transmit any material that encourages conduct that could constitute a criminal offence, give rise to civil liability, or otherwise violate any applicable local, state, national or international law or regulation. Attempts to gain unauthorised access to other computer systems are prohibited. You shall not interfere with any other Astroguid.com members' use or enjoyment of the Website or Services.
                                </p>
                            </section>

                            {/* No Warranty */}
                            <section>
                                <h2 className={styles.mainHeading}>No Warranty. You Understand and Agree That:</h2>
                                <ul className={styles.list}>
                                    <li><strong>(A)</strong> The services are provided "as-is" with all faults. Astroguid.com assumes no responsibility for availability (or lack thereof), timeliness (or lack thereof), deletions, misdeliveries, or failures to store member communications or personalization settings.</li>
                                    <li><strong>(B)</strong> In particular, but not by way of limitations, Astroguid.com may delete e-mail or other accounts if they are inactive for more than 90 days.</li>
                                    <li><strong>(C)</strong> Use of the services is at your sole risk, and you will be solely responsible for any damage to your computer system or loss of data that results from the download of such material and/or data;</li>
                                    <li><strong>(D)</strong> The accuracy or reliability of any content obtained through the Services, any goods or services purchased or obtained through Astroguid.com's website, or any transactions entered into through Astroguid.com's site, makes no warranty that the services will meet your requirements, be uninterrupted, timely, secure or error-free. No advice or information, whether oral or written, obtained by you from Astroguid.com or through the services shall create any warranty.</li>
                                </ul>
                            </section>

                            {/* Limitations of Liability */}
                            <section>
                                <h2 className={styles.mainHeading}>Limitations of Liability</h2>
                                <p className={styles.paragraph}>
                                    In no event will Astroguid.com or its suppliers be liable for any indirect, incidental, special, consequential or punitive damages of any kind, including but not limited to damages for loss of profits and the cost of procurement of substitute goods and services (collectively, "indirect damages") arising out of or in connection with our website, the services, our privacy policy, or these terms of service (however arising, including negligence), even if Astroguid.com had been advised of the possibility of such damages.
                                </p>
                                <p className={styles.paragraph}>
                                    Without limiting the foregoing, Astroguid.com and its suppliers will not be liable for indirect damages arising out of or in connection with:
                                </p>
                                <ul className={styles.list}>
                                    <li><strong>(A)</strong> The use of or the inability to use the services;</li>
                                    <li><strong>(B)</strong> Any goods or services purchased or obtained through Astroguid.com's site, or messages received or transactions entered into through Astroguid.com's services; OR</li>
                                    <li><strong>(C)</strong> Loss of, unauthorised access to, or alteration of, a user's transmissions or data.</li>
                                </ul>
                                <p className={styles.paragraph}>
                                    The liability of Astroguid.com and its suppliers to you or any third parties arising out of or in connection with our website, the services, our privacy policy, or these terms of service (however arising, including negligence) is limited to the greater of (a) the amount of fees you pay to us in the twelve (12) months prior to the action giving rise to liability.
                                </p>
                            </section>

                            {/* Indemnification */}
                            <section>
                                <h2 className={styles.mainHeading}>Indemnification</h2>
                                <p className={styles.paragraph}>
                                    You agree to indemnify, defend and hold harmless Astroguid.com and its parent, subsidiaries, affiliates, officers, directors, employees, suppliers, consultants and agents from any and all third-party claims, liability, damages and/or costs (including, but not limited to, attorneys fees) arising from Your use of the Services, Your violation of the Privacy Policy or these Terms of Service, or Your violation of any third party's rights, including without limitation, an infringement by You or any other user of Your account of any intellectual property or other rights of any person or entity. These Terms of Service will inure to the benefit of Astroguid.com's successors, assigns, and licensees.
                                </p>
                            </section>

                            {/* Proprietary Rights */}
                            <section>
                                <h2 className={styles.mainHeading}>Proprietary Rights to Content</h2>
                                <p className={styles.paragraph}>
                                    You acknowledge that the Content, including but not limited to text, software, music, sound, photographs, video, graphics or other material contained in either sponsor advertisements or distributed via email, commercially produced information presented to Member by Astroguid.com, its suppliers, and/or advertisers, is protected by copyrights, trademarks, service marks, patents and/or other proprietary rights and laws. You are not permitted to copy, use, reproduce, distribute, perform, display, or create derivative works from the Content unless expressly authorised by Astroguid.com, its suppliers, or advertisers.
                                </p>
                            </section>

                            {/* Arbitration */}
                            <section>
                                <h2 className={styles.mainHeading}>Arbitration; Injunctive Relief</h2>
                                <p className={styles.paragraph}>
                                    Any dispute, controversy, or claim arising out of, relating to, or in connection with this Agreement shall be settled by binding arbitration in accordance with the commercial arbitration rules of Indian Law. The arbitration shall be conducted by a single arbitrator, selected in accordance with the rules of Indian Law, and the arbitration award may be entered in any court having jurisdiction thereof. Notwithstanding the foregoing, either party has the right to seek any interim or preliminary relief from a court of competent jurisdiction in Mumbai in order to protect the rights of the such party pending the completion of any arbitration hereunder, and both parties agree to submit to the exclusive jurisdiction of the courts of India and venue in Mumbai, Maharashtra for any such proceeding. If either party files an action contrary to this provision, the other party may recover lawyers' fees and costs.
                                </p>
                            </section>

                            {/* General Provisions */}
                            <section>
                                <h2 className={styles.mainHeading}>General Provisions</h2>
                                <p className={styles.paragraph}>
                                    These Terms of Service will be governed by and construed in accordance with the laws of India without giving effect to any choice of law principles that would require the application of the laws of a different state. If for any reason a court of competent jurisdiction finds any provision or portion of these Terms of Service or Privacy Policy to be unenforceable or invalid, such provision shall be changed and interpreted so as to best accomplish the objectives of such unenforceable or invalid provision within the limits of applicable law, and the remainder of the Terms of Service or Privacy Policy, as applicable, will continue in full force and effect. Headings are for reference purposes only and in no way define, limit, construe, or describe the scope or extent of such section. Any waiver of any provision of the Terms of Service will be effective only if in writing and signed by Astroguid.com. These Terms of Service constitute the entire agreement between the parties with respect to the subject matter hereof and supersedes and replaces all prior or contemporaneous understandings or agreements, written or oral, regarding the subject matter.
                                </p>
                            </section>

                            {/* Usage of Information */}
                            <section>
                                <h2 className={styles.mainHeading}>Usage of the Information</h2>
                                <p className={styles.paragraph}>
                                    The data collected by the Website may be used for any purpose as may be permissible under the applicable law and shall include but not be limited to the following:
                                </p>
                                <ul className={styles.list}>
                                    <li><strong>a.</strong> For providing a personalised browsing experience. While guaranteeing the anonymity of the user, the personal information collected in Clause "Personal Identifiable Information" may be used for research purposes, for improving the marketing and promotional efforts, to analyse usage, improve the content of the Website, product offering and for customising the Website's layout for suiting the needs of its Users.</li>
                                    <li><strong>b.</strong> You authorise us to contact you via email or phone or SMS.</li>
                                    <li><strong>c.</strong> With IP tracking details and Cookies data, the Website will use it only for facilitating the usage of the website and providing a personalised experience and any information which is sensitive in nature will not be provided to any third party without the consent of the User.</li>
                                    <li><strong>d.</strong> All information (and copies thereof) collected by Website, including without limitation Personal Information, User Data, and other information related to your access and use of the services offered by Website, may be retained by Website for such period as necessary, including but not limited to, for purposes such as compliance with statutory or legal obligations, tax laws and potential evidentiary purposes and for other reasonable purposes such as to implement, administer, and manage your access and use of our services, or the resolution of any disputes.</li>
                                    <li><strong>e.</strong> To ensure a seamless experience at the Website for you and to ensure your maximum benefit and comfort, the Website may use the data collected through cookies, log files, device identifiers, location data and clear gifs information to:
                                        <ul className="list-disc pl-6 space-y-1 mt-2 text-gray-700">
                                            <li>(a) remember information so that you will not have to re-enter it during your visit or the next time you visit the site;</li>
                                            <li>(b) provide custom, personalised content and information, including advertising;</li>
                                            <li>(c) provide and monitor the effectiveness of Services offered by Website;</li>
                                            <li>(d) monitor aggregate metrics such as a total number of visitors, traffic, usage, and demographic patterns on the Website and its Services;</li>
                                            <li>(e) diagnose or fix technology problems; and (f) otherwise to plan for and enhance the service.</li>
                                        </ul>
                                    </li>
                                    <li><strong>f.</strong> The website uses certain third-party analytics tools to measure traffic and usage trends for the Services. These tools collect information, which is not personal or sensitive in nature sent by the User's device, including the web pages visited, add-ons, and other information that assists the Website in improving the Services. Such information is collected from Users in the form of anonymized logs so that it cannot reasonably be used to identify any particular individual User.</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.footerBadge}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default memo(TermsConditions);
