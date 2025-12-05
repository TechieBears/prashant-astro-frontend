import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { Eye, Tag, Calendar, Percent, Package, ShoppingCart } from 'lucide-react';
import { TableTitle } from '../../../../helper/Helper';
import { getSingleCoupon } from '../../../../api';
import toast from 'react-hot-toast';
import moment from 'moment';

function ViewCouponModal({ couponId }) {
    const [open, setOpen] = useState(false);
    const [couponData, setCouponData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && couponId) {
            setLoading(true);
            getSingleCoupon(couponId).then(res => {
                if (res.success) setCouponData(res.data);
                else toast.error('Failed to fetch coupon details');
            }).catch(() => toast.error('Error loading coupon details'))
            .finally(() => setLoading(false));
        }
    }, [open, couponId]);

    const getStatus = (isActive, isExpired, isUpcoming) => {
        if (isExpired) return { text: 'Expired', color: 'bg-red-100 text-red-600' };
        if (isUpcoming) return { text: 'Upcoming', color: 'bg-yellow-100 text-yellow-600' };
        if (isActive) return { text: 'Active', color: 'bg-green-100 text-green-600' };
        return { text: 'Inactive', color: 'bg-gray-100 text-gray-600' };
    };

    const InfoRow = ({ label, value, valueClass = "text-gray-800" }) => (
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 font-tbLex">{label}:</span>
            <span className={`text-sm font-semibold font-tbPop ${valueClass}`}>{value}</span>
        </div>
    );

    const Section = ({ icon: Icon, title, bgColor, iconColor, children }) => (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${bgColor} rounded-lg`}>
                    <Icon className={iconColor} size={20} />
                </div>
                <h3 className="text-base font-medium font-tbLex text-black">{title}</h3>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">{children}</div>
        </div>
    );

    const ItemList = ({ items, label, bgColor, borderColor, textColor }) => items?.length > 0 && (
        <div>
            <span className="text-sm font-medium text-gray-600 font-tbLex mb-2 block">{label}:</span>
            <div className="grid grid-cols-1 gap-2">
                {items.map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-2 ${bgColor} p-2 rounded-lg border ${borderColor}`}>
                        {item?.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />}
                        <span className={`text-sm font-medium ${textColor}`}>
                            {typeof item === 'string' ? item : item?.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const status = couponData && getStatus(couponData.isActive, couponData.isExpired, couponData.isUpcoming);

    return (
        <>
            <button onClick={() => setOpen(!open)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="View Coupon Details">
                <Eye size={16} />
            </button>

            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={() => setOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 backdrop-blur-[2.3px] bg-black/20" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                                    <TableTitle title={`Coupon Details - ${couponData?.couponCode || ''}`} toggle={() => setOpen(false)} />

                                    <div className="bg-white p-6 max-h-[80vh] overflow-y-auto">
                                        {loading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                            </div>
                                        ) : couponData ? (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="space-y-6">
                                                    <Section icon={Tag} title="Coupon Information" bgColor="bg-blue-50" iconColor="text-blue-600">
                                                        <InfoRow label="Coupon Name" value={couponData.couponName} valueClass="capitalize" />
                                                        <InfoRow label="Coupon Code" value={<span className="text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-200">{couponData.couponCode}</span>} />
                                                        <InfoRow label="Coupon Type" value={couponData.couponType} valueClass="capitalize" />
                                                        <InfoRow label="Status" value={<span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.text}</span>} />
                                                    </Section>

                                                    <Section icon={Percent} title="Discount Details" bgColor="bg-green-50" iconColor="text-green-600">
                                                        <InfoRow label="Discount Type" value={couponData.discountIn === 'percent' ? 'Percentage' : 'Fixed Amount'} valueClass="capitalize" />
                                                        <InfoRow label="Discount Value" value={couponData.discountIn === 'percent' ? `${couponData.discount}%` : `₹${couponData.discount}`} valueClass="text-lg text-green-600 font-bold" />
                                                    </Section>

                                                    <Section icon={Calendar} title="Validity Period" bgColor="bg-orange-50" iconColor="text-orange-600">
                                                        <InfoRow label="Activation Date" value={moment(couponData.activationDate).format('DD-MM-YYYY')} valueClass="text-green-600" />
                                                        <InfoRow label="Expiry Date" value={moment(couponData.expiryDate).format('DD-MM-YYYY')} valueClass="text-red-600" />
                                                    </Section>
                                                </div>

                                                <div className="space-y-6">
                                                    <Section icon={Package} title="Redemption Limits" bgColor="bg-purple-50" iconColor="text-purple-600">
                                                        <InfoRow label="Per User" value={couponData.redemptionPerUser} valueClass="text-blue-600" />
                                                        <InfoRow label="Total Redemptions" value={couponData.totalRedemptions} valueClass="text-purple-600" />
                                                    </Section>

                                                    {couponData.applicability?.services && (
                                                        <Section icon={ShoppingCart} title="Service Applicability" bgColor="bg-indigo-50" iconColor="text-indigo-600">
                                                            <InfoRow label="Apply to All Services" value={<span className={`px-2 py-1 rounded text-xs font-medium ${couponData.applicability.services.applyAllServices ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{couponData.applicability.services.applyAllServices ? 'Yes' : 'No'}</span>} />
                                                            <ItemList items={couponData.applicability.services.applicableServices} label="Applicable Services" bgColor="bg-purple-50" borderColor="border-purple-200" textColor="text-purple-700" />
                                                            <ItemList items={couponData.applicability.services.applicableServiceCategories} label="Service Categories" bgColor="bg-purple-50" borderColor="border-purple-200" textColor="text-purple-700" />
                                                        </Section>
                                                    )}

                                                    {couponData.applicability?.products && (
                                                        <Section icon={Package} title="Product Applicability" bgColor="bg-teal-50" iconColor="text-teal-600">
                                                            <InfoRow label="Apply to All Products" value={<span className={`px-2 py-1 rounded text-xs font-medium ${couponData.applicability.products.applyAllProducts ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{couponData.applicability.products.applyAllProducts ? 'Yes' : 'No'}</span>} />
                                                            <ItemList items={couponData.applicability.products.applicableProducts} label="Applicable Products" bgColor="bg-blue-50" borderColor="border-blue-200" textColor="text-blue-700" />
                                                            <ItemList items={couponData.applicability.products.applicableProductCategories} label="Product Categories" bgColor="bg-blue-50" borderColor="border-blue-200" textColor="text-blue-700" />
                                                        </Section>
                                                    )}

                                                    {couponData.createdBy && (
                                                        <div className="text-center pt-4">
                                                            <div className="text-xs text-gray-500 font-tbLex">
                                                                Created by {couponData.createdBy.email} on {moment(couponData.createdAt).format('DD-MM-YYYY')}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">No coupon data available</div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default ViewCouponModal;
