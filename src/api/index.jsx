import axios from "axios";
import { environment } from "../env";

axios.defaults.withCredentials = environment?.production;

// Cart APIs
export const removeCartItem = async (itemId) => {
    const token = localStorage.getItem('token');
    const url = `${environment.baseUrl}product-cart/remove-item`;
    try {
        const response = await axios.put(url, { itemId }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error removing cart item:', err);
        return err?.response?.data || { success: false, message: 'Failed to remove cart item' };
    }
};

export const updateCartItem = async (itemId, quantity) => {
    const token = localStorage.getItem('token');
    const url = `${environment.baseUrl}product-cart/update`;
    try {
        const response = await axios.put(url, { itemId, quantity }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error updating cart item:', err);
        return err?.response?.data || { success: false, message: 'Failed to update cart item' };
    }
};

export const getCartItems = async () => {
    const token = localStorage.getItem('token');
    const url = `${environment.baseUrl}product-cart/get`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error fetching cart items:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch cart items' };
    }
};


axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// ==================== Regiter Api===================

export const registerUser = async (data) => {
    const url = `${environment.baseUrl}user/add-user `;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in Register User api file", err);
        return err?.response?.data
    }
};

export const loginUser = async (data) => {
    const url = `${environment.baseUrl}user/login`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in login User api file", err);
        return err?.response?.data
    }
};
export const forgetUser = async (data) => {
    const url = `${environment.baseUrl}user/verification-code`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in forget User api file", err.response.data);
        return err?.response?.data
    }
};
export const resetPassword = async (data) => {
    const url = `${environment.baseUrl}user/forgot-password`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in forget User api file", err.response.data);
        return err?.response?.data
    }
};

// ==================== Customer Address APIs ===================

export const getAllCustomerAddresses = async () => {
    const token = localStorage.getItem("token");
    const url = `${environment.baseUrl}customer-address/get-all`;
    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    }
    catch (err) {
        console.log("==========error in getAllCustomerAddresses api file", err);
        return err?.response?.data;
    }
};

export const createCustomerAddress = async (addressData) => {
    const token = localStorage.getItem("token");
    const url = `${environment.baseUrl}customer-address/create`;
    try {
        const response = await axios.post(url, addressData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    }
    catch (err) {
        console.log("==========error in createCustomerAddress api file", err);
        return err?.response?.data;
    }
};

export const updateCustomerAddress = async (addressId, addressData) => {
    const token = localStorage.getItem("token");
    const url = `${environment.baseUrl}customer-address/update?id=${addressId}`;
    try {
        const response = await axios.put(url, addressData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    }
    catch (err) {
        console.log("==========error in updateCustomerAddress api file", err);
        return err?.response?.data;
    }
};

export const deleteCustomerAddress = async (addressId) => {
    const token = localStorage.getItem("token");
    const url = `${environment.baseUrl}customer-address/delete?id=${addressId}`;
    try {
        const response = await axios.delete(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    }
    catch (err) {
        console.log("==========error in deleteCustomerAddress api file", err);
        return err?.response?.data;
    }
};

export const registerUserEdit = async (id, data) => {
    try {
        const url = `${environment.baseUrl}user/add-user/${id}`
        const response = await axios.put(url, data)
        return response.data
    } catch (err) {
        console.log('error black listing user api file', err)
        return err?.response?.data
    }
}


export const login = async (data) => {
    const url = `${environment.baseUrl}admin-login`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
};

// ====================Get All User Api===================
export const getAllUser = async (data) => {
    try {
        const url = `${environment.baseUrl}admin/get-all-user`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

// ====================== BlackList User =====================
export const blacklistUser = async (id, status) => {
    try {
        const url = `${environment.baseUrl}admin/blacklist-user?id=${id}`
        const response = await axios.put(url, status)
        return response.data
    } catch (err) {
        console.log('error black listing user api file', err)
        return err?.response?.data

    }
}

export const premiumUser = async (id, status) => {
    try {
        const url = `${environment.baseUrl}admin/premium-user?id=${id}`
        const response = await axios.put(url, status)
        return response.data
    } catch (err) {
        console.log('error premium user api file', err)
        return err?.response?.data
    }
}

// ====================== Block User =====================
export const blockUser = async (id, status) => {
    try {
        const url = `${environment.baseUrl}admin/block-user?id=${id}`
        const response = await axios.put(url, status)
        return response.data
    } catch (err) {
        console.log('error blocking user api file', err)
        return err?.response?.data
    }
}

// ====================== Verify User =====================
export const verifyUser = async (id, status) => {
    try {
        const url = `${environment.baseUrl}admin/verify-user?id=${id}`
        const response = await axios.put(url, status)
        return response.data
    } catch (err) {
        console.log('error blocking user api file', err)
        return err?.response?.data
    }
}

// ====================Get All User Api===================
export const getAllBlockedUser = async (data) => {
    try {
        const url = `${environment.baseUrl}admin/get-all-blacklist-user?name=${data?.name}&role=${data?.role == 'castingDirector' || data?.role == 'castingAgency' ? 'castingTeam' : data?.role}&subRole=${data?.role == 'castingDirector' || data?.role == 'castingAgency' ? data?.role : ''}&email=${data?.email}&page=${data?.p}&limit=${data?.records}&skip=${data?.skip}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

// ================== Reject User api ==========
export const rejectUser = async (id, data) => {
    try {
        const url = `${environment.baseUrl}admin/reject-user?id=${id}`
        const response = await axios.put(url, data)
        return response
    } catch (err) {
        console.log('error====', err)
        return err?.response?.data
    }
}

export const getDashboardInsight = async () => {
    try {
        const url = `${environment.baseUrl}admin/get-insight`
        const response = await axios.get(url)
        return response
    } catch (err) {
        console.log('error in getDashboardInsight api file', err)
        return err?.response?.data
    }
}

// ====================Get All User Api===================
export const getAllEqnuires = async (data) => {
    try {
        const url = `${environment.baseUrl}admin/contact-us?status=${data?.status}&email=${data?.email}&phoneNumber=${data?.phoneNumber}&name=${data?.name}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

export const deleteStorage = async (id) => {
    const url = `${environment.baseUrl}edit-storage/${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
};

/* =============== User API ================= */

export const createUser = async (data) => {
    const url = `${environment.baseUrl}registration/`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
};

export const getUser = async () => {
    const url = `${environment.baseUrl}registration/`;
    try {
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
};

export const editUser = async (id, data) => {
    const url = `${environment.baseUrl}edit-user/${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
};

export const delUser = async (id) => {
    const url = `${environment.baseUrl}edit-user/${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
};


// ====================User Contact Us Api===================

export const userContactUs = async (data) => {
    const url = `${environment.baseUrl}user/contact-us`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in userContactUs api file", err);
        return err?.response?.data
    }
};

// ==================== Upload to Cloudinary Api===================


export const uploadToCloudinary = async (file) => {
    const cloudName = 'astroguid';
    const apiKey = import.meta.env.VITE_CLOUDINARY_KEY;
    const uploadPreset = 'ml_default';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('api_key', apiKey);

    if (environment?.production) {
        formData.append('folder', 'prod_uploads');
    } else {
        formData.append('folder', 'dev_uploads');
    }

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();

        if (!data.secure_url) {
            console.warn('Upload succeeded but no secure_url:', data);
            throw new Error('Upload succeeded but no URL returned');
        }

        return data.secure_url;
    } catch (err) {
        console.error('Upload failed:', err);
        throw err; // Re-throw to let calling code handle it
    }
};


// ========================== After Login User actors page apis ===================

export const getLatestLeadActors = async () => {
    try {
        const url = `${environment.baseUrl}user/latest-lead-actors`
        const response = await axios.get(url)
        return response.data.data
    } catch (err) {
        console.log('error in get Latest Lead Actors api file', err)
        return err?.response?.data
    }
}

export const getProfileDetails = async (id) => {
    try {
        const url = `${environment.baseUrl}user/user-details/${id}`
        const response = await axios.get(url)
        return response.data.data
    } catch (err) {
        console.log('error in get Profile Details api file', err)
        return err?.response?.data
    }
}
export const getRandomActors = async () => {
    try {
        const url = `${environment.baseUrl}user/random-actors`
        const response = await axios.get(url)
        return response.data.data
    } catch (err) {
        console.log('error in get Random Actors api file', err)
        return err?.response?.data
    }
}
export const getFilterLeadActors = async (data, page) => {
    try {
        const url = `${environment.baseUrl}user/filtered-leadActors?age=${data?.age || ""}&role=${data?.role || ""}&gender=${data?.gender || ""}&page=${page || 1}`
        const response = await axios.get(url)
        return response?.data
    } catch (err) {
        console.log('error in get Filtered Lead Actors api file', err)
        return err?.response?.data
    }
}
export const getblacklistedActors = async (data, page) => {
    try {
        const url = `${environment.baseUrl}user/blacklisted-user?role=${data?.role || ""}&page=${page || 1}`
        const response = await axios.get(url)
        return response?.data
    } catch (err) {
        console.log('error in get Filtered Lead Actors api file', err)
        return err?.response?.data
    }
}


// ============================== casting page apis =========================


export const getLetestCasting = async () => {
    try {
        const url = `${environment.baseUrl}user/lastest-casting`
        const response = await axios.get(url)
        return response.data.data
    } catch (err) {
        console.log('error in get latest casting api file', err)
        return err?.response?.data
    }
}

export const getFilterCasting = async (role) => {
    try {
        const url = `${environment.baseUrl}user/filtered-casting?role=${role || ""}`
        const response = await axios.get(url)
        return response.data.data
    } catch (err) {
        console.log('error in get Filtered casting api file', err)
        return err?.response?.data
    }
}


// ============================== production page apis =========================


export const getLetestProduction = async () => {
    try {
        const url = `${environment.baseUrl}user/lastest-production`
        const response = await axios.get(url)
        return response.data.data
    } catch (err) {
        console.log('error in get latest production api file', err)
        return err?.response?.data
    }
}

export const getFilterProduction = async (data, page) => {
    try {
        const url = `${environment.baseUrl}user/production-pagination?subRole=${data?.subRole || ""}&page=${page || 1}`
        const response = await axios.get(url)
        console.log("⚡️🤯 ~ index.jsx:384 ~ getFilterProduction ~ response:", response)
        return response.data
    } catch (err) {
        console.log('error in get Filtered production api file', err)
        return err?.response?.data
    }
}
export const getDubbingProductionActors = async (data, page) => {
    try {
        const url = `${environment.baseUrl}user/getdubbing-actors?gender=${data?.gender || ""}&page=${page || 1}`
        const response = await axios.get(url)
        return response.data
    } catch (err) {
        console.log('error in get Filtered production api file', err)
        return err?.response?.data
    }
}
export const getAllActors = async (data, page) => {
    console.log("⚡️🤯 ~ index.jsx:413 ~ getAllActors ~ data:", data)
    const url = `${environment.baseUrl}user/actors-pagination?role=${data?.role || ""}&actorType=${data?.actorType || ""}&page=${page || 1}`;
    try {
        const response = await axios.get(url)
        console.log("⚡️🤯 ~ index.jsx:416 ~ getAllActors ~ response:", response)
        return response?.data
    }
    catch (err) {
        console.log('error in get all Actors  api file', err)
        return err?.response?.data
    }
};



/* =============== Payment API ================= */

export const paymentOrderId = async (id, data) => {
    const url = `${environment.baseUrl}user/create-orderId/${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("⚡️🤯 ~ index.jsx:415 ~ paymentOrderId ~ err:", err)
        return err?.response?.data
    }
};


export const verifyPayment = async (id) => {
    const url = `${environment.baseUrl}payment/payment-status/${id}`;
    try {
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("Api file error get Orders Details ===========>", err);
    }
};


// ==================== get filtered actors api ====================
export const adminGetFilteredActors = async (data) => {
    try {
        const url = `${environment.baseUrl}admin/filtered-actors?role=${data?.role || ""}&email=${data?.email || ""}&page=${data?.p || 1}&limit=${data?.records || 10}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in adminGetFilteredActors api file", err);
        return err?.response?.data
    }
}

// ==================== get filtered casting api ====================
export const adminGetFilteredCasting = async (data) => {
    try {
        const url = `${environment.baseUrl}admin/filtered-casting-production?role=castingTeam&subRole=${data?.subRole || ""}&email=${data?.email || ""}&page=${data?.p || 1}&limit=${data?.records || 10}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in adminGetFilteredActors api file", err);
        return err?.response?.data
    }
}

// ==================== get filtered production api ====================
export const adminGetFilteredProduction = async (data) => {
    try {
        const url = `${environment.baseUrl}admin/filtered-casting-production?role=productionTeam&subRole=${data?.subRole || ""}&email=${data?.email || ""}&page=${data?.p || 1}&limit=${data?.records || 10}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in adminGetFilteredActors api file", err);
        return err?.response?.data
    }
}

export const adminTransactionPagination = async (data) => {
    const url = `${environment.baseUrl}admin/transaction-pagination?status=${data?.status}&email=${data?.email}&orderId=${data?.orderId}&page=${data?.p || 1}&limit=${data?.records || 10}`;
    try {
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in adminTransactionPagination api file", err);
        return err?.response?.data
    }
}

// ====================Get All User Api===================
export const getAllRejectedUser = async (data) => {
    try {
        const url = `${environment.baseUrl}admin/rejected-pagination?&role=${data?.role == 'castingDirector' || data?.role == 'castingAgency' ? 'castingTeam' : data?.role}&subRole=${data?.role == 'castingDirector' || data?.role == 'castingAgency' ? data?.role : ''}&email=${data?.email}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

export const createRefund = async (id, data) => {
    const url = `${environment.baseUrl}admin/create-refund?id=${id}`;
    try {
        const response = await axios.post(url, data)
        return response
    }
    catch (err) {
        console.log("==========error in createRefund api file", err);
        return err?.response?.data
    }
}

export const addAdminUser = async (data) => {
    const url = `${environment.baseUrl}admin/admin-add-actor`;
    try {
        const response = await axios.post(url, data)
        return response
    }
    catch (err) {
        console.log("==========error in addAdminUser api file", err);
        return err?.response?.data
    }
}

export const deleteUser = async (id) => {
    try {
        const url = `${environment.baseUrl}admin/delete-user?id=${id}`
        const response = await axios.delete(url)
        return response
    } catch (error) {
        console.log('error in delete user api file ', error)
    }
}

export const permanentDeleteUser = async (id, data) => {
    try {
        const url = `${environment.baseUrl}admin/permanent-delete-user?id=${id}`
        const response = await axios.post(url, data)
        return response
    } catch (error) {
        console.log('error in permanent delete user api file ', error)
    }
}

export const editProfile = async (id, data) => {
    try {
        const url = `${environment.baseUrl}admin/admin-edit-actor/${id}`
        const response = await axios.put(url, data)
        return response
    } catch (error) {
        console.log('error in edit profile api file', error)
    }
}


// =============================== Api Binding Start ==============================

// ====================== Product Categories Api ======================
export const getProductCategories = async (data) => {
    try {
        const url = `${environment.baseUrl}product-categories/get-all?page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}
export const getProductCategoriesDropdown = async () => {
    try {
        const url = `${environment.baseUrl}product-categories/dropdown`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

export const addProductCategory = async (data) => {
    const url = `${environment.baseUrl}product-categories/create`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addProductCategory api file", err);
        return err?.response?.data
    }
};

export const editProductCategory = async (id, data) => {
    const url = `${environment.baseUrl}product-categories/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editProductCategory api file", err);
        return err?.response?.data
    }
};



// ======================= Product Sub Categories Api ======================
export const getProductSubCategories = async (data) => {
    try {
        const url = `${environment.baseUrl}product-subcategories/get-all?page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

export const addProductSubCategory = async (data) => {
    const url = `${environment.baseUrl}product-subcategories/create`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addProductSubCategory api file", err);
        return err?.response?.data
    }
}

export const editProductSubCategory = async (id, data) => {
    const url = `${environment.baseUrl}product-subcategories/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editProductSubCategory api file", err);
        return err?.response?.data
    }
}

export const deleteProductSubCategory = async (id) => {
    const url = `${environment.baseUrl}product-subcategories/delete?id=${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in deleteProductSubCategory api file", err);
        return err?.response?.data
    }
}

// ====================== Service Categories Api ======================
export const getServiceCategories = async (data) => {
    try {
        const url = `${environment.baseUrl}service-categories/get-all?page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}
export const getServiceCategoriesDropdown = async () => {
    try {
        const url = `${environment.baseUrl}service-categories/dropdown`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

export const addServiceCategory = async (data) => {
    const url = `${environment.baseUrl}service-categories/create`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addServiceCategory api file", err);
        return err?.response?.data
    }
};

export const editServiceCategory = async (id, data) => {
    const url = `${environment.baseUrl}service-categories/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editServiceCategory api file", err);
        return err?.response?.data
    }
};

// ======================= Service Api ======================
export const getServices = async (data) => {
    try {
        const url = `${environment.baseUrl}service/get-all?page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getServices api file", err);
        return err?.response?.data
    }
}

export const addService = async (data) => {
    const url = `${environment.baseUrl}service/create`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addService api file", err);
        return err?.response?.data
    }
}

export const editService = async (id, data) => {
    const url = `${environment.baseUrl}service/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editService api file", err);
        return err?.response?.data
    }
}


// ======================= Products Api ======================
export const getProducts = async (data) => {
    console.log('data', data)
    try {
        const url = `${environment.baseUrl}product/get-all?name=${data?.name}&categoryName=${data?.categoryName}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getProducts api file", err);
        return err?.response?.data
    }
}

export const addProduct = async (data) => {
    const url = `${environment.baseUrl}product/create`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addProduct api file", err);
        return err?.response?.data
    }
}

export const editProduct = async (id, data) => {
    const url = `${environment.baseUrl}product/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editProduct api file", err);
        return err?.response?.data
    }
}

export const deleteProduct = async (id) => {
    const url = `${environment.baseUrl}product/delete?id=${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in deleteProduct api file", err);
        return err?.response?.data
    }
}

// ==================== Employee Api ====================

export const getAllEmployees = async (data) => {
    try {
        const url = `${environment.baseUrl}employee-users/get-all?name=${data?.name}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAllEmployees api file", err);
        return err?.response?.data
    }
}

export const addEmployee = async (data) => {
    const url = `${environment.baseUrl}employee-users/register`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addEmployee api file", err);
        return err?.response?.data
    }
}

export const editEmployee = async (id, data) => {
    const url = `${environment.baseUrl}employee-users/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editEmployee api file", err);
        return err?.response?.data
    }
}

// ==================== Customer Api ====================
export const updateCustomerProfile = async (data) => {
    const token = localStorage.getItem("token");
    const url = `${environment.baseUrl}customer-users/update`;

    // Determine content type based on whether data is FormData
    const isFormData = data instanceof FormData;
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    // Only set Content-Type if not FormData (browser will set it automatically for FormData with boundary)
    if (!isFormData) {
        config.headers["Content-Type"] = "application/json";
    }

    try {
        const response = await axios.put(url, data, config);
        return response.data;
    } catch (err) {
        console.error("Error in updateCustomerProfile API call:", err);
        throw err; // Re-throw to be caught by the component
    }
};

export const getAllCustomers = async (data) => {
    try {
        const url = `${environment.baseUrl}customer-users/get-all?name=${data?.name}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAllCustomers api file", err);
        return err?.response?.data
    }
}
export const editCustomer = async (id, data) => {
    const url = `${environment.baseUrl}customer-users/admin-update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in edit Customer api file", err);
        return err?.response?.data
    }
}


// ================== Banner Api ==================

export const getAllBanners = async (data) => {
    try {
        const url = `${environment.baseUrl}banners/get-all?page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAllBanners api file", err);
        return err?.response?.data
    }
}


export const addBanner = async (data) => {
    const url = `${environment.baseUrl}banners/create`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addBanner api file", err);
        return err?.response?.data
    }
}

export const editBanner = async (id, data) => {
    const url = `${environment.baseUrl}banners/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editBanner api file", err);
        return err?.response?.data
    }
}

export const deleteBanner = async (id) => {
    const url = `${environment.baseUrl}banners/delete?id=${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in deleteBanner api file", err);
        return err?.response?.data
    }
}


// ==================== Website APi Binding ====================


// ==================== Authendication Api===================
// export const registerUser = async (data) => {
//     const url = `${environment.baseUrl}customer-users/register`;
//     try {
//         console.log('Register Data:', data);
//         const response = await axios.post(url, data)
//         return response.data

//     }
//     catch (err) {
//         console.log("==========error in Register User api file", err);
//         return err?.response?.data
//     }
// };

// export const loginUser = async (data) => {
//     const url = `${environment.baseUrl}auth/login`;
//     console.log('Login URL:', url);
//     console.log('Login Data:', data);
//     try {
//         const response = await axios.post(url, data)
//         return response.data
//     }
//     catch (err) {
//         console.log("==========error in login User api file", err);
//         console.log('Error response:', err?.response?.data);
//         return err?.response?.data
//     }
// };

// export const forgetUser = async (data) => {
//     const url = `${environment.baseUrl}customer-users/forgot-password`;
//     try {
//         const response = await axios.post(url, data)
//         return response.data
//     }
//     catch (err) {
//         console.log("==========error in forget User api file", err.response.data);
//         return err?.response?.data
//     }
// };
// export const resetPassword = async (data) => {
//     const url = `${environment.baseUrl}customer-users/reset-password`;
//     console.log('Reset password data:', data);
//     try {
//         const response = await axios.post(url, data)
//         return response.data
//     }
//     catch (err) {
//         console.log("==========error in reset password api file", err);
//         console.log('Reset password error response:', err?.response?.data);
//         return err?.response?.data
//     }
// };


// ==================== Website APi Binding ====================


// ==================== Authendication Api===================
// export const registerUser = async (data) => {
//     const url = `${environment.baseUrl}/api/customer-users/register`;
//     try {
//         console.log('Register Data:', data);
//         const response = await axios.post(url, data)
//         return response.data

//     }
//     catch (err) {
//         console.log("==========error in Register User api file", err);
//         return err?.response?.data
//     }
// };

// export const loginUser = async (data) => {
//     const url = `${environment.baseUrl}/api/auth/login`;
//     console.log('Login URL:', url);
//     console.log('Login Data:', data);
//     try {
//         const response = await axios.post(url, data)
//         return response.data
//     }
//     catch (err) {
//         console.log("==========error in login User api file", err);
//         console.log('Error response:', err?.response?.data);
//         return err?.response?.data
//     }
// };

// export const forgetUser = async (data) => {
//     const url = `${environment.baseUrl}/api/customer-users/forgot-password`;
//     try {
//         const response = await axios.post(url, data)
//         return response.data
//     }
//     catch (err) {
//         console.log("==========error in forget User api file", err.response.data);
//         return err?.response?.data
//     }
// };
// export const resetPassword = async (data) => {
//     const url = `${environment.baseUrl}/api/customer-users/reset-password`;
//     console.log('Reset password data:', data);
//     try {
//         const response = await axios.post(url, data)
//         return response.data
//     }
//     catch (err) {
//         console.log("==========error in reset password api file", err);
//         console.log('Reset password error response:', err?.response?.data);
//         return err?.response?.data
//     }
// };

// ====================CUstomer(User) Banner  Api===================
export const getCustomerBanners = async (data) => {
    try {
        const url = `${environment.baseUrl}banners/active?type=website`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

export const getActiveBanners = async (type = "website") => {
    try {
        const res = await axios.get(`${environment.baseUrl}banners/active?type=${type}`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching banners:", err);
        return [];
    }
};


// ====================CUstomer(User) Services  Api===================
export const getServicesList = async (data) => {
    try {
        const url = `${environment.baseUrl}service/public/get-all`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}

export const getSelectedService = async (id) => {
    try {
        const url = `${environment.baseUrl}service/public/get-single?id=${id}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}


export const getCategoriesList = async (data) => {
    try {
        const url = `${environment.baseUrl}service-categories/public/our-service-categories`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log(err);
        return err?.response?.data
    }
}
// ==================== Our Products Api ====================
export const getOurProducts = async (categoryId = "68c930ffd155766186f7f03c") => {
    try {
        const url = `${environment.baseUrl}product/public/our-products?categoryId=${categoryId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error("Error fetching our products:", err);
        return err?.response?.data || { success: false, data: [] };
    }
};

// ==================== Our Service Categories Api ====================
export const getOurServiceCategories = async () => {
    try {
        const url = `${environment.baseUrl}service-categories/public/our-service-categories`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error("Error fetching our service categories:", err);
        return err?.response?.data || { success: false, data: [] };
    }
};

// ==================== Active Products Api ====================
export const getActiveProducts = async () => {
    const url = `${environment.baseUrl}product/public/active`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching active products:', error);
        throw error;
    }
};

// ==================== Add to Cart Api ====================
export const addToCart = async (productId, quantity = 1) => {
    const url = `${environment.baseUrl}product-cart/add`;
    const token = localStorage.getItem('token');

    if (!token) {
        return Promise.reject({
            success: false,
            message: 'Please login to add items to cart',
            status: 401
        });
    }

    try {
        const response = await axios.post(
            url,
            { productId, quantity },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return {
            success: response.data?.success || false,
            message: response.data?.message || 'Product added to cart',
            data: response.data?.data,
            status: response.status
        };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data?.message || 'Failed to add to cart',
                status: error.response.status,
                data: error.response.data
            };
        }

        return {
            success: false,
            message: error.message || 'Failed to add to cart',
            status: 0
        };
    }
};

// ==================== Single Active Product Api ====================
export const getActiveProduct = async (id) => {
    if (!id) {
        console.error('No product ID provided to getActiveProduct');
        return { success: false, message: 'No product ID provided' };
    }

    const url = `${environment.baseUrl}product/public/active-single?id=${id}`;
    console.log('Making API request to:', url);

    try {
        const response = await axios.get(url);
        console.log('API Response for product', id, ':', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', {
            id,
            error: error.response?.data || error.message,
            status: error.response?.status,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                params: error.config?.params
            }
        });

        // Return a consistent error response structure
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch product',
            status: error.response?.status
        };
    }
};

// ==================== Product Filters Api ====================
export const getProductFilters = async () => {
    const url = `${environment.baseUrl}product/public/filter`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching product filters:', error);
        throw error;
    }
};
