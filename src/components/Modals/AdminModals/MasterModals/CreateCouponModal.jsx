import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Edit } from 'iconsax-reactjs';
import {
    addCoupon,
    editCoupon,
    getPublicServicesDropdown,
    getServiceCategoriesDropdown,
    getProductsDropdown,
    getProductCategoriesDropdown,
    getProductSubCategoriesDropdown
} from '../../../../api';
import { formBtn1, tableBtn } from '../../../../utils/CustomClass';
import LoadBox from '../../../Loader/LoadBox';
import TextInput from '../../../TextInput/TextInput';
import SelectTextInput from '../../../TextInput/SelectTextInput';
import MultiSelectTextInput from '../../../TextInput/MultiSelectTextInput';
import { TableTitle } from '../../../../helper/Helper';

function CreateCouponModal({ edit, userData, setRefreshTrigger }) {
    const [open, setOpen] = useState(false);
    const toggle = () => {
        setOpen(!open);
        reset({
            couponName: '',
            couponCode: '',
            couponType: '',
            applicableType: '',
            discountIn: '',
            discount: '',
            activationDate: '',
            expiryDate: '',
            redemptionPerUser: '',
            totalRedemptions: '',
            services: [],
            serviceCategories: [],
            products: [],
            productCategories: [],
            productSubcategories: []
        });
    };
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, control, watch, reset, formState: { errors }, setValue } = useForm();

    const [services, setServices] = useState([]);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [productSubcategories, setProductSubcategories] = useState([]);

    const couponType = watch('couponType');
    const applicableType = watch('applicableType');
    const selectedProductCategories = watch('productCategories');
    const selectedProductSubcategories = watch('productSubcategories');

    const formSubmit = async (data) => {
        try {
            setLoader(true);

            const formattedData = {
                couponName: data.couponName,
                couponCode: data.couponCode,
                couponType: data.couponType,
                applicableType: data.applicableType || '',
                discountIn: data.discountIn,
                discount: Number(data.discount),
                activationDate: data.activationDate,
                expiryDate: data.expiryDate,
                redemptionPerUser: Number(data.redemptionPerUser),
                totalRedemptions: Number(data.totalRedemptions),
                applicableServices: data.services || [],
                applicableServiceCategories: data.serviceCategories || [],
                applicableProducts: data.products || [],
                applicableProductCategories: data.productCategories || [],
                applicableProductSubcategories: data.productSubcategories || []
            };

            const apiCall = edit
                ? editCoupon(userData?._id, formattedData)
                : addCoupon(formattedData);

            const res = await apiCall;
            console.log("⚡️🤯 ~ CreateCouponModal.jsx:86 ~ formSubmit ~ res:", res)

            if (res?.success) {
                toast.success(edit ? "Coupon Updated" : "Coupon Created");
                setRefreshTrigger(prev => prev + 1);
                toggle();
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            toast.error("Something went wrong");
        } finally {
            setLoader(false);
        }
    };

    // Fetch dropdown data when modal opens
    useEffect(() => {
        if (open) {
            fetchDropdownData();
        }
    }, [open]);

    const fetchDropdownData = async () => {
        try {
            const [servicesRes, serviceCategoriesRes, productsRes, productCategoriesRes, productSubcategoriesRes] = await Promise.all([
                getPublicServicesDropdown(),
                getServiceCategoriesDropdown(),
                getProductsDropdown(),
                getProductCategoriesDropdown(),
                getProductSubCategoriesDropdown()
            ]);

            if (servicesRes?.success && servicesRes?.data) {
                setServices(servicesRes.data.map(item => ({ value: item._id, label: item.name })));
            }
            if (serviceCategoriesRes?.success && serviceCategoriesRes?.data) {
                setServiceCategories(serviceCategoriesRes.data.map(item => ({ value: item._id, label: item.name })));
            }
            if (productsRes?.success && productsRes?.data) {
                const formattedProducts = productsRes.data.map(item => ({
                    value: item._id,
                    label: item.name
                }));
                setAllProducts(formattedProducts);
                setProducts(formattedProducts);
            }
            if (productCategoriesRes?.success && productCategoriesRes?.data) {
                setProductCategories(productCategoriesRes.data.map(item => ({ value: item._id, label: item.name })));
            }
            if (productSubcategoriesRes?.success && productSubcategoriesRes?.data) {
                setProductSubcategories(productSubcategoriesRes.data.map(item => ({
                    value: item._id,
                    label: item.name
                })));
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };


    useEffect(() => {
        if (edit && userData && open && services.length > 0) {
            setValue('couponName', userData?.couponName);
            setValue('couponCode', userData?.couponCode);
            setValue('couponType', userData?.couponType);
            setValue('applicableType', userData?.applicableType || '');
            setValue('discountIn', userData?.discountIn);
            setValue('discount', userData?.discount);
            setValue('activationDate', userData?.activationDate?.split('T')[0]);
            setValue('expiryDate', userData?.expiryDate?.split('T')[0]);
            setValue('redemptionPerUser', userData?.redemptionPerUser);
            setValue('totalRedemptions', userData?.totalRedemptions);

            setValue('services', userData?.applicableServices || []);
            setValue('serviceCategories', userData?.applicableServiceCategories || []);
            setValue('products', userData?.applicableProducts || []);
            setValue('productCategories', userData?.applicableProductCategories || []);
            setValue('productSubcategories', userData?.applicableProductSubcategories || []);
        } else if (!edit) {
            reset();
        }
    }, [edit, userData, open, reset, setValue, services, serviceCategories, allProducts, productCategories, productSubcategories]);

    return (
        <>
            {
                edit ? <button onClick={toggle}>
                    <Edit className='text-yellow-500' size={20} />
                </button> : <button onClick={toggle} className={tableBtn}>
                    Create New Coupon
                </button>
            }

            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={toggle}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 backdrop-blur-[2.3px] bg-black/20" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                    <TableTitle
                                        title={edit ? "Edit Coupon" : "Create New Coupon"}
                                        toggle={toggle}
                                    />
                                    <div className="bg-white">
                                        <form onSubmit={handleSubmit(formSubmit)}>
                                            <div className="md:py-5 md:pb-7 mx-4 md:mx-8 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-5">

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Coupon title <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <TextInput
                                                            label="Enter Coupon Name"
                                                            placeholder="🎉 Use code SAVE20 — Get 20% OFF!"
                                                            registerName="couponName"
                                                            props={{ ...register('couponName', { required: "Required" }) }}
                                                            errors={errors.couponName}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Coupon Code <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <TextInput
                                                            label="Enter Coupon Code"
                                                            placeholder="Enter Coupon Code"
                                                            registerName="couponCode"
                                                            props={{
                                                                ...register('couponCode', {
                                                                    required: "Required",
                                                                    onChange: (e) => {
                                                                        e.target.value = e?.target?.value?.toUpperCase();
                                                                    }
                                                                }),
                                                                style: { textTransform: 'uppercase' }
                                                            }}
                                                            errors={errors.couponCode}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Coupon Type <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <SelectTextInput
                                                            label="Select Coupon Type"
                                                            registerName="couponType"
                                                            options={[
                                                                { value: 'products', label: 'Products' },
                                                                { value: 'services', label: 'Services' },
                                                            ]}
                                                            placeholder="Select Coupon Type"
                                                            props={{ ...register('couponType', { required: true }) }}
                                                            errors={errors.couponType}
                                                            defaultValue={userData?.couponType}
                                                        />
                                                    </div>

                                                    {(couponType === 'products' || couponType === 'services') && (
                                                        <div>
                                                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Applicable To <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                            <SelectTextInput
                                                                label="Select Applicable Type"
                                                                registerName="applicableType"
                                                                options={
                                                                    couponType === 'products'
                                                                        ? [
                                                                            { value: 'product', label: 'Select Product' },
                                                                            { value: 'category', label: 'Select Category' },
                                                                            { value: 'subcategory', label: 'Select Subcategory' },
                                                                        ]
                                                                        : [
                                                                            { value: 'service', label: 'Service' },
                                                                            { value: 'serviceCategory', label: 'Service Category' },
                                                                        ]
                                                                }
                                                                placeholder="Select Applicable Type"
                                                                props={{ ...register('applicableType', { required: true }) }}
                                                                errors={errors.applicableType}
                                                                defaultValue={userData?.applicableType}
                                                            />
                                                        </div>
                                                    )}
                                                    {couponType === 'services' && applicableType === 'service' && (
                                                        <div>
                                                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Applicable Services</h4>
                                                            <Controller
                                                                name="services"
                                                                control={control}
                                                                defaultValue={[]}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <MultiSelectTextInput
                                                                        label="Select Services"
                                                                        options={services}
                                                                        value={Array.isArray(value) ? value : []}
                                                                        onChange={onChange}
                                                                        errors={errors.services}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    {couponType === 'services' && applicableType === 'serviceCategory' && (
                                                        <div>
                                                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Applicable Service Categories</h4>
                                                            <Controller
                                                                name="serviceCategories"
                                                                control={control}
                                                                defaultValue={[]}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <MultiSelectTextInput
                                                                        label="Select Service Categories"
                                                                        options={serviceCategories}
                                                                        value={Array.isArray(value) ? value : []}
                                                                        onChange={onChange}
                                                                        errors={errors.serviceCategories}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    {couponType === 'products' && applicableType === 'category' && (
                                                        <div>
                                                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Applicable Product Categories</h4>
                                                            <Controller
                                                                name="productCategories"
                                                                control={control}
                                                                defaultValue={[]}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <MultiSelectTextInput
                                                                        label="Select Product Categories"
                                                                        options={productCategories}
                                                                        value={Array.isArray(value) ? value : []}
                                                                        onChange={onChange}
                                                                        errors={errors.productCategories}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    {couponType === 'products' && applicableType === 'subcategory' && (
                                                        <div>
                                                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Applicable Product Subcategories</h4>
                                                            <Controller
                                                                name="productSubcategories"
                                                                control={control}
                                                                defaultValue={[]}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <MultiSelectTextInput
                                                                        label="Select Product Subcategories"
                                                                        options={productSubcategories}
                                                                        value={Array.isArray(value) ? value : []}
                                                                        onChange={onChange}
                                                                        errors={errors.productSubcategories}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    )}

                                                    {couponType === 'products' && applicableType === 'product' && (
                                                        <div>
                                                            <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Applicable Products</h4>
                                                            <Controller
                                                                name="products"
                                                                control={control}
                                                                defaultValue={[]}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <MultiSelectTextInput
                                                                        label="Select Products"
                                                                        options={products}
                                                                        value={Array.isArray(value) ? value : []}
                                                                        onChange={onChange}
                                                                        errors={errors.products}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Discount In <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <SelectTextInput
                                                            label="Select Discount Type"
                                                            registerName="discountIn"
                                                            options={[
                                                                { value: 'percent', label: 'Percent' },
                                                                { value: 'amount', label: 'Amount' },
                                                            ]}
                                                            placeholder="Select Discount Type"
                                                            props={{ ...register('discountIn', { required: true }) }}
                                                            errors={errors.discountIn}
                                                            defaultValue={userData?.discountIn}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Discount in {watch('discountIn') === 'percent' ? '%' : '₹'} <span className="text-red-500 text-xs font-tbLex">*</span> <span className="text-red-500 text-xs font-tbLex">{edit ? '(Cannot be edited)' : ''}</span></h4>
                                                        <TextInput
                                                            disabled={edit}
                                                            label={`Enter Discount ${watch('discountIn') === 'percent' ? '%' : '₹'}`}
                                                            placeholder={`Enter Discount ${watch('discountIn') === 'percent' ? '%' : '₹'}`}
                                                            type="number"
                                                            registerName="discount"
                                                            props={{ ...register('discount', { required: "Required", min: 0, max: watch('discountIn') === 'percent' ? 100 : 1000000 }) }}
                                                            errors={errors.discount}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Activation Date <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <TextInput
                                                            label="Activation Date"
                                                            type="date"
                                                            registerName="activationDate"
                                                            props={{
                                                                ...register('activationDate', {
                                                                    required: "Required",
                                                                    validate: (value) => {
                                                                        const today = new Date();
                                                                        today.setHours(0, 0, 0, 0);
                                                                        const selectedDate = new Date(value);
                                                                        selectedDate.setHours(0, 0, 0, 0);
                                                                        return selectedDate >= today || "Cannot select a past date";
                                                                    }
                                                                })
                                                            }}
                                                            errors={errors.activationDate}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Expiry Date <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <TextInput
                                                            label="Expiry Date"
                                                            type="date"
                                                            registerName="expiryDate"
                                                            props={{
                                                                ...register('expiryDate', {
                                                                    required: "Required",
                                                                    validate: (value) => {
                                                                        const today = new Date();
                                                                        today.setHours(0, 0, 0, 0);
                                                                        const selectedDate = new Date(value);
                                                                        selectedDate.setHours(0, 0, 0, 0);

                                                                        if (selectedDate < today) {
                                                                            return "Cannot select a past date";
                                                                        }

                                                                        const activationDate = watch('activationDate');
                                                                        if (activationDate) {
                                                                            const activation = new Date(activationDate);
                                                                            activation.setHours(0, 0, 0, 0);
                                                                            if (selectedDate <= activation) {
                                                                                return "Expiry date must be after activation date";
                                                                            }
                                                                        }

                                                                        return true;
                                                                    }
                                                                })
                                                            }}
                                                            errors={errors.expiryDate}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Redemption Per User <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <TextInput
                                                            label="Enter Redemption Per User"
                                                            placeholder="Enter Redemption Per User"
                                                            type="number"
                                                            registerName="redemptionPerUser"
                                                            props={{ ...register('redemptionPerUser', { required: "Required" }) }}
                                                            errors={errors.redemptionPerUser}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-tbLex font-normal text-slate-400 pb-2.5">Total Redemptions <span className="text-red-500 text-xs font-tbLex">*</span></h4>
                                                        <TextInput
                                                            label="Enter Total Redemptions"
                                                            placeholder="Enter Total Redemptions"
                                                            type="number"
                                                            registerName="totalRedemptions"
                                                            props={{ ...register('totalRedemptions', { required: "Required" }) }}
                                                            errors={errors.totalRedemptions}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <footer className="py-3 flex bg-slate1 justify-end px-4 space-x-3">
                                                {loader
                                                    ? <LoadBox className={formBtn1} />
                                                    : <button type='submit' className={formBtn1}>Submit</button>}
                                            </footer>
                                        </form>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    );
}

export default CreateCouponModal;
