import axios from "axios";
import { environment } from "../env";
import toast from "react-hot-toast";

axios.defaults.withCredentials = environment?.production;

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("persist:root");
    localStorage.removeItem('rememberedCredentials');
    toast.error('Your session has expired. Please login again.');
    window.location.href = '/login';
};

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            if (isTokenExpired(token)) {
                handleLogout();
                return Promise.reject(new Error('Token expired'));
            }
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Endpoints that should not trigger auto-logout on 401
const AUTH_ENDPOINTS = ['/auth/login', '/customer-users/register', '/customer-users/forgot-password', '/reviews/filter', '/service/public/get-single'];

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => error.config?.url?.includes(endpoint));
        if (error.response?.status === 401 && !isAuthEndpoint) {
            handleLogout();
        }
        return Promise.reject(error);
    }
);

export const removeCartItem = async (itemId) => {
    const token = localStorage.getItem('token');
    const url = `${environment.baseUrl}product-cart/public/remove-item`;
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
    const url = `${environment.baseUrl}product-cart/public/update`;
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
    const url = `${environment.baseUrl}product-cart/public/get`;
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

export const getServiceCartItems = async () => {
    const token = localStorage.getItem('token');
    const url = `${environment.baseUrl}service-cart/public/get`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error fetching service cart items:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch service cart items' };
    }
};

// ==================== Service Add to Cart Api ====================
export const addServiceToCart = async (body) => {
    const url = `${environment.baseUrl}service-cart/public/add`;

    try {
        const response = await axios.post(url, body);
        return {
            success: response.data?.success || false,
            message: response.data?.message || 'Service added to cart',
            data: response.data?.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add service to cart'
        };
    }
};

export const removeServiceCartItem = async (itemId) => {
    const token = localStorage.getItem('token');
    const url = `${environment.baseUrl}service-cart/public/remove-item`;
    try {
        const response = await axios.put(
            url,
            { itemId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error('Error removing service cart item:', err);
        return err?.response?.data || { success: false, message: 'Failed to remove service cart item' };
    }
};

export const updateServiceCartItem = async (itemId, updateData) => {
    const token = localStorage.getItem('token');
    const url = `${environment.baseUrl}service-cart/public/update`;
    try {
        // Map serviceMode values to API enum
        const serviceModeMap = {
            'online': 'online',
            'pandit_center': 'pandit_center',
            'pooja_at_home': 'pooja_at_home'
        };

        // Prepare payload according to new API structure
        const payload = {
            serviceItemId: itemId,
            astrologer: updateData.astrologer || '',
            serviceMode: serviceModeMap[updateData.serviceMode] || 'online',
            startTime: updateData.startTime || '',
            endTime: updateData.endTime || '',
            date: updateData.date || ''
        };

        const response = await axios.put(
            url,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error('Error updating service cart item:', err);
        return err?.response?.data || { success: false, message: 'Failed to update service cart item' };
    }
};


// ==================== Regiter Api===================

export const registerUserOld = async (data) => {
    const url = `${environment.baseUrl}user/add-user `;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in register User api file", err);
        return err?.response?.data
    }
};

export const loginUserOld = async (data) => {
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
    const url = `${environment.baseUrl}user/actors-pagination?role=${data?.role || ""}&actorType=${data?.actorType || ""}&page=${page || 1}`;
    try {
        const response = await axios.get(url)
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

export const getAllTransactions = async (data) => {
    const url = `${environment.baseUrl}transactions/get-all?page=${data?.p || 1}&limit=${data?.records || 10}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching transactions:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch transactions' };
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

export const deleteUserOld = async (id) => {
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
        const url = `${environment.baseUrl}product-categories/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
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
        const url = `${environment.baseUrl}product-subcategories/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
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
        const url = `${environment.baseUrl}service-categories/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
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

export const getProductSubCategoriesDropdown = async () => {
    try {
        const url = `${environment.baseUrl}product-subcategories/get-dropdown`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getProductSubCategoriesDropdown api file", err);
        return err?.response?.data
    }
}

export const getProductsDropdown = async () => {
    try {
        const url = `${environment.baseUrl}product/public/get-all-dropdown`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getProductsDropdown api file", err);
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
        const url = `${environment.baseUrl}service/get-all?name=${data?.name || ''}&categoryId=${data?.categoryId || ''}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getServices api file", err);
        return err?.response?.data
    }
}
export const getServiceDropdown = async () => {
    try {
        const url = `${environment.baseUrl}service/public/dropdown`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getServiceDropdown api file", err);
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
    try {
        const url = `${environment.baseUrl}product/get-all?name=${data?.name || ''}&categoryId=${data?.categoryId || ''}&page=${data?.p}&limit=${data?.records}`;
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

export const productStatusUpdate = async (id) => {
    const url = `${environment.baseUrl}product/id/status?id=${id}`;
    try {
        const response = await axios.put(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in productStatusUpdate api file", err);
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
        const url = `${environment.baseUrl}employee-users/get-all?name=${data?.name || ''}&page=${data?.p}&limit=${data?.records}${data?.employeeType ? `&employeeType=${data?.employeeType}` : ''}`;
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

// =======================Admin User Profile Api ========================

export const updateAdminUserProfile = async (id, data) => {
    const url = `${environment.baseUrl}admin-users/update?id=${id}`;
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (err) {
        console.log("==========error in updateAdminUserProfile api file", err);
        return err?.response?.data;
    }
};


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
        const url = `${environment.baseUrl}customer-users/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAllCustomers api file", err);
        return err?.response?.data;
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
        const url = `${environment.baseUrl}banners/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
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

// =========================== admin product order api ====================

export const getAdminAllTestimonials = async (data) => {
    try {
        const url = `${environment.baseUrl}testimonials/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAdminAllTestimonials api file", err);
        return err?.response?.data
    }
}
export const editTestimonials = async (id, data) => {
    const url = `${environment.baseUrl}testimonials/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editTestimonials api file", err);
        return err?.response?.data
    }
}


// ================== Coupon API ==================

export const getAllCoupons = async (data) => {
    try {
        const url = `${environment.baseUrl}coupon/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getAllCoupons api file", err);
        return err?.response?.data;
    }
};

export const applyServiceCoupon = async (couponCode, services) => {
    try {
        const url = `${environment.baseUrl}coupon/service/apply`;
        const response = await axios.post(url, { couponCode, services });
        return response.data;
    } catch (err) {
        console.log("==========error in ApplyCoupon api file", err);
        return err?.response?.data;
    }
}

export const applyProductCoupon = async (couponCode, products) => {
    try {
        const url = `${environment.baseUrl}coupon/product/apply`;
        const payload = { couponCode, products };
        const response = await axios.post(url, payload);
        return response.data;
    } catch (err) {
        console.log("==========error in ApplyProductCoupon api file", err);
        return err?.response?.data;
    }
}

export const addCoupon = async (data) => {
    const url = `${environment.baseUrl}coupon/create`;
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (err) {
        console.log("==========error in addCoupon api file", err);
        return err?.response?.data;
    }
};

export const editCoupon = async (id, data) => {
    const url = `${environment.baseUrl}coupon/update?id=${id}`;
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (err) {
        console.log("==========error in editCoupon api file", err);
        return err?.response?.data;
    }
};

export const deleteCoupon = async (id) => {
    const url = `${environment.baseUrl}coupon/delete?id=${id}`;
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (err) {
        console.log("==========error in deleteCoupon api file", err);
        return err?.response?.data;
    }
};




// ==================== Website APi Binding ====================


// ==================== Authendication Api===================
// export const registerUser = async (data) => {
//     const url = `${environment.baseUrl}customer-users/register`;
//     try {
//         console.log('register Data:', data);
//         const response = await axios.post(url, data)
//         return response.data

//     }
//     catch (err) {
//         console.log("==========error in register User api file", err);
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
//         console.log('register Data:', data);
//         const response = await axios.post(url, data)
//         return response.data

//     }
//     catch (err) {
//         console.log("==========error in register User api file", err);
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
        const url = `${environment.baseUrl}service/astroguid/public/get-all`;
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
export const getOurProducts = async () => {
    try {
        const url = `${environment.baseUrl}product/public/our-products/v3`;
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
export const getActiveProducts = async (params = {}) => {
    const queryParts = [];

    if (params.page !== undefined) queryParts.push(`page=${params.page}`);
    if (params.limit !== undefined) queryParts.push(`limit=${params.limit}`);
    if (params.category) queryParts.push(`category=${params.category}`);
    if (params.subcategory) queryParts.push(`subcategory=${params.subcategory}`);
    if (params.minPrice !== undefined) queryParts.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice !== undefined) queryParts.push(`maxPrice=${params.maxPrice}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.inStock !== undefined) queryParts.push(`inStock=${params.inStock}`);

    const queryString = queryParts.length > 0 ? '?' + queryParts.join('&') : '';
    const url = `${environment.baseUrl}product/public/active${queryString}`;

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
    const url = `${environment.baseUrl}product-cart/public/add`;
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

export const getAllAstrologer = async (data = { employeeType: "astrologer" }) => {
    const url = `${environment.baseUrl}employee-users/astroguid/public/get-all`;
    try {
        // Send data in the request payload using POST
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching get all astrologer:', error);
        throw error;
    }
};

// ==================== Post Contact Us & Feedback Api ====================
export const postContactUs = async (data) => {
    const url = `${environment.baseUrl}feedback/create`;
    try {
        const response = await axios.post(url, {
            ...data,
            source: "website"
        });
        return response.data;
    } catch (error) {
        console.error('Error posting contact us:', error);
        return error?.response?.data || { success: false, message: 'Failed to post contact us' };
    }
};
// ==================== Authentication APIs ====================

export const loginUser = async ({ email, password }) => {
    try {
        const response = await axios.post(
            `${environment.baseUrl}auth/login`,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (err) {
        console.error('Login error:', err);
        return {
            success: false,
            message: err.response?.data?.message || "Login failed"
        };
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${environment.baseUrl}auth/logout`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error('Logout error:', err);
        return {
            success: false,
            message: err.response?.data?.message || "Logout failed"
        };
    }
};

export const registerUser = async (data) => {
    try {
        const response = await axios.post(
            `${environment.baseUrl}customer-users/register`,
            data,
            { headers: { "Content-type": "application/json" } }
        );
        return response.data;
    } catch (err) {
        console.error('Registration error:', err);
        return {
            success: false,
            message: err.response?.data?.message || "Registration failed"
        };
    }
};

export const forgetUserPassword = async ({ email }) => {
    try {
        const response = await axios.post(
            `${environment.baseUrl}customer-users/forgot-password-otp`,
            { email },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (err) {
        console.error('Forgot password error:', err);
        return {
            success: false,
            message: err.response?.data?.message || "Forgot password failed"
        };
    }
};

export const resetUserPassword = async ({ token, password }) => {
    try {
        const response = await axios.post(
            `${environment.baseUrl}customer-users/reset-password`,
            { token, password },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (err) {
        console.error('Reset password error:', err);
        return {
            success: false,
            message: err.response?.data?.message || "Reset password failed"
        };
    }
};

export const deleteUser = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${environment.baseUrl}customer-users/delete`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error('Delete user error:', err);
        return {
            success: false,
            message: err.response?.data?.message || "Account deletion failed"
        };
    }
};

// ==================== Create Product Order Api ====================
export const createProductOrder = async (orderData) => {
    const url = `${environment.baseUrl}product-order/public/create`;
    try {
        const response = await axios.post(url, orderData);
        return response.data;
    } catch (err) {
        console.error('Error creating product order:', err);
        return err?.response?.data || { success: false, message: 'Failed to create order' };
    }
};

// =========================== admin service order api ====================

export const getAllServiceOrdersAdmin = async (data) => {
    try {
        const url = `${environment.baseUrl}service-order/get-all?orderId=${data?.orderId || ""}&date=${data?.date || ""}&status=${data?.status || ""}&page=${data?.p}&limit=${data?.records}&astrologerId=${data?.astrologerId || ""}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAllServiceOrdersAdmin api file", err);
        return err?.response?.data
    }
}

// ==================== Create Service Order Api ====================
export const createServiceOrder = async (orderData) => {
    const url = `${environment.baseUrl}service-order/public/create`;
    try {
        const response = await axios.post(url, orderData);
        return response.data;
    } catch (err) {
        console.error('Error creating service order:', err);
        return err?.response?.data || { success: false, message: 'Failed to create service order' };
    }
};

// ==================== Get All Service Orders Api ====================
export const getAllServiceOrders = async () => {
    const url = `${environment.baseUrl}service-order/public/get-all`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching service orders:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch service orders' };
    }
};
export const getProductSubCategoriesByCategory = async (id) => {
    try {
        const url = `${environment.baseUrl}product-subcategories/get-by-category?id=${id || ''}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getProductSubCategoriesSingle api file", err);
        return err?.response?.data
    }
}

// ================== Customer Feedback Api ==================

export const getAllFeedback = async (data) => {
    try {
        const url = `${environment.baseUrl}feedback/get-all?search=${data?.name || ''}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAllFeedback api file", err);
        return err?.response?.data
    }
}


export const addFeedback = async (data) => {
    const url = `${environment.baseUrl}feedback/create`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in addFeedback api file", err);
        return err?.response?.data
    }
}

export const respondFeedback = async (data) => {
    const url = `${environment.baseUrl}feedback/respond`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in respondFeedback api file", err);
        return err?.response?.data
    }
}

export const deleteFeedback = async (id) => {
    const url = `${environment.baseUrl}/feedback/delete?id=${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in deleteFeedback api file", err);
        return err?.response?.data
    }
}

// =========================== admin product order api ====================

export const getAllProductOrders = async (data) => {
    try {
        const url = `${environment.baseUrl}product-order/get-all?orderId=${data?.orderId || ""}&date=${data?.date || ""}&status=${data?.status || ""}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAllProductOrders api file", err);
        return err?.response?.data
    }
}

export const updateProductOrder = async (data) => {
    try {
        const url = `${environment.baseUrl}product-order/update-order-status`;
        const response = await axios.post(url, data);
        return response.data;
    }
    catch (err) {
        console.log("==========error in updateProductOrderStatus api file", err);
        return err?.response?.data;
    }
}
// ======================= calendar api =======================

export const adminBlockSlots = async (data) => {
    const url = `${environment.baseUrl}calender/admin-block-slots`;
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (err) {
        console.log("==========error in adminBlockSlots api file", err);
        return err?.response?.data;
    }
};

export const checkAvailability = async (data) => {
    try {
        const url = `${environment.baseUrl}calender/check-availability`;
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in checkAvailability api file", err);
        return err?.response?.data
    }
}
export const checkAvailabilityById = async (id) => {
    try {
        const url = `${environment.baseUrl}service-order/item/get-single?id=${id || ""}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in checkAvailability api file", err);
        return err?.response?.data
    }
}


export const updateServiceOrderStatus = async (data) => {
    const url = `${environment.baseUrl}service-order/astrologer/update-order-status`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in updateAvailability api file", err);
        return err?.response?.data
    }
}



export const logoutUserOld = async (data) => {
    const url = `${environment.baseUrl}auth/logout`;
    try {
        const response = await axios.post(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in logout User api file", err);
        return err?.response?.data
    }
};

export const adminSlots = async (date) => {
    const url = `${environment.baseUrl}calender/admin-slots?date=${date}`;
    try {
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in logout User api file", err);
        return err?.response?.data
    }
};

// =========================== admin product order api ====================

export const getAdminAllReviews = async (data) => {
    try {
        const url = `${environment.baseUrl}reviews/get-all?name=${data?.name || ""}&page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAdminAllReviews api file", err);
        return err?.response?.data
    }
}
export const editReviews = async (id, data) => {
    const url = `${environment.baseUrl}reviews/update?id=${id}`;
    try {
        const response = await axios.put(url, data)
        return response.data
    }
    catch (err) {
        console.log("==========error in editReviews api file", err);
        return err?.response?.data
    }
}

export const deleteReview = async (id) => {
    const url = `${environment.baseUrl}reviews/delete?id=${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in deleteReview api file", err);
        return err?.response?.data
    }
}

export const astrologerSlots = async (sdate, edate, astrologerId) => {
    const url = `${environment.baseUrl}calender/astrologer-slots?sdate=${sdate}&edate=${edate}&astrologerId=${astrologerId}`;
    try {
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in logout User api file", err);
        return err?.response?.data
    }
};

export const getSingleServiceOrder = async (orderId) => {
    const url = `${environment.baseUrl}service-order/public/get-single?id=${orderId}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching single service order:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch service order details' };
    }
};

export const getAllReviews = async (page = 1, limit = 10, isActive = true) => {
    const url = `${environment.baseUrl}reviews/public/get-all?page=${page}&limit=${limit}&isActive=${isActive}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching Reviews:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch Reviews' };
    }
};

export const createReview = async (ReviewData) => {
    const url = `${environment.baseUrl}reviews/create`;
    try {
        const response = await axios.post(url, ReviewData);
        return response.data;
    } catch (err) {
        console.error('Error creating Review:', err);
        return err?.response?.data || { success: false, message: 'Failed to create Review' };
    }
};

export const getFilteredReviews = async ({ userId, productId = null, serviceId = null }) => {
    const params = new URLSearchParams();
    if (userId) params.append('user', userId);
    if (productId) params.append('product', productId);
    if (serviceId) params.append('service', serviceId);

    const url = `${environment.baseUrl}reviews/filter?${params.toString()}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching filtered Reviews:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch Reviews' };
    }
};

export const getSingleProductOrder = async (orderId) => {
    const url = `${environment.baseUrl}product-order/public/get-single?id=${orderId}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching single product order:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch product order details' };
    }
};

// ==================== Navigation APIs ====================
export const getServiceCategoriesDropdownPublic = async () => {
    const url = `${environment.baseUrl}service-categories/public/dropdown`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching service categories dropdown:', err);
        if (err.response?.data?.message) {
            return { success: false, message: err.response.data.message };
        } else if (err.message) {
            return { success: false, message: err.message };
        } else {
            return { success: false, message: 'Failed to fetch service categories' };
        }
    }
};

export const getProductCategoriesWithProductsPublic = async () => {
    const url = `${environment.baseUrl}product-categories/astroguid/public/categories-with-products`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching product categories with products:', err);
        if (err.response?.data?.message) {
            return { success: false, message: err.response.data.message };
        } else if (err.message) {
            return { success: false, message: err.message };
        } else {
            return { success: false, message: 'Failed to fetch product categories' };
        }
    }
};

export const getNavDropdowns = async () => {
    try {
        const [serviceCatRes, productCatRes] = await Promise.all([
            getServiceCategoriesDropdownPublic(),
            getProductCategoriesWithProductsPublic()
        ]);

        return {
            success: true,
            data: {
                servicesDropdown: serviceCatRes.success ? serviceCatRes.data : [],
                productsDropdown: productCatRes.success ? productCatRes.data : [],
                servicesError: serviceCatRes.success ? null : serviceCatRes.message,
                productsError: productCatRes.success ? null : productCatRes.message
            }
        };
    } catch (error) {
        console.error('Error fetching navigation dropdowns:', error);
        return {
            success: false,
            message: error.message || 'Failed to fetch navigation data'
        };
    }
};

export const clearProductCart = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${environment.baseUrl}product-cart/public/clear`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error('Error clearing product cart:', err);
        return err?.response?.data || { success: false, message: 'Failed to clear product cart' };
    }
}

export const clearServiceCart = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${environment.baseUrl}service-cart/public/clear`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error('Error clearing service cart:', err);
        return err?.response?.data || { success: false, message: 'Failed to clear service cart' };
    }
}

// get all coupons list for user
export const getUserCoupons = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams({ couponType: params.couponType || '' });
        if (params.productIds) queryParams.append('productIds', params.productIds);
        if (params.serviceIds) queryParams.append('serviceIds', params.serviceIds);
        const url = `${environment.baseUrl}coupon/public/get-all?${queryParams.toString()}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching user coupons:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch user coupons' };
    }
};

export const getHomeModalStatus = async () => {
    const url = `${environment.baseUrl}config/public/get?key=homepage_settings`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching HomepageModal Status:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch HomepageModal Status' };
    }
};

export const getPublicServicesDropdown = async () => {
    try {
        const url = `${environment.baseUrl}service/public/dropdown`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in get Public Services Dropdown api file", err);
        return err?.response?.data
    }
}
export const createTestimonial = async (ReviewData) => {
    const url = `${environment.baseUrl}testimonials/create`;
    try {
        const response = await axios.post(url, ReviewData);
        return response.data;
    } catch (err) {
        console.error('Error creating testimonial:', err);
        return err?.response?.data || { success: false, message: 'Failed to create testimonial' };
    }
};
export const getAllTestimonials = async (data) => {
    try {
        const url = `${environment.baseUrl}testimonials/public/get-all?page=${data?.p}&limit=${data?.records}`;
        const response = await axios.get(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in getAlltestimonials api file", err);
        return err?.response?.data
    }
}

export const deleteTestimonial = async (id) => {
    const url = `${environment.baseUrl}testimonials/delete?id=${id}`;
    try {
        const response = await axios.delete(url)
        return response.data
    }
    catch (err) {
        console.log("==========error in deletetestimonial api file", err);
        return err?.response?.data
    }
}

// ==================== Notification API ====================
export const sendNotificationToUser = async (data) => {
    const url = `${environment.baseUrl}notification/send`;
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (err) {
        console.error('Error sending notification:', err);
        return err?.response?.data || { success: false, message: 'Failed to send notification' };
    }
}

// =================== Refer & Earn Api ==================


// =================== Refer & Earn Api ==================

export const getWalletBalance = async () => {
    const url = `${environment.baseUrl}wallet/get-balance`;
    try {
        const response = await axios.get(url);
        return response.data
    }
    catch (err) {
        console.log("==========error in getWalletBalance api file", err);
        return err?.response?.data
    }
}

export const getWalletTransactions = async () => {
    const url = `${environment.baseUrl}wallet/get-transactions-history`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching wallet transactions:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch transactions' };
    }
}


// ===================== Customer Notification Api =====================

export const getAllNotifications = async (data) => {
    try {
        const url = `${environment.baseUrl}notification/get-all?page=${data?.p || 1}&limit=${data?.records || 10}&status=${data?.status || 'active'}&userType=${data?.userType || 'all-customers'}&from=${data?.from || 'admin'}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getAllNotifications api file", err);
        return err?.response?.data;
    }
}
export const getNotificationsDropdown = async () => {
    try {
        const url = `${environment.baseUrl}notification/dropdown-dashboard`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getNotificationsDropdown api file", err);
        return err?.response?.data;
    }
}
export const getNotificationsDropdownCustomer = async () => {
    try {
        const url = `${environment.baseUrl}notification/dropdown-customer`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getNotificationsDropdownCustomer api file", err);
        return err?.response?.data;
    }
}

export const clearAllNotifications = async () => {
    try {
        const url = `${environment.baseUrl}notification/remove-all`;
        const response = await axios.delete(url);
        return response.data;
    } catch (err) {
        console.log("==========error in clearAllNotifications api file", err);
        return err?.response?.data;
    }
}

export const addNotification = async (data) => {
    const url = `${environment.baseUrl}notification/create`;
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (err) {
        console.log("==========error in addNotification api file", err);
        return err?.response?.data;
    }
};


export const getCustomerUsersDropdown = async () => {
    try {
        const url = `${environment.baseUrl}customer-users/dropdown`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getCustomerUsersDropdown api file", err);
        return err?.response?.data;
    }
}

// ========================== dashboard insights api ========================

export const getDashboardInsights = async (astrologerId) => {
    try {
        const url = `${environment.baseUrl}dashboard/get-dashboard-data?astrologer=${astrologerId || ""}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getDashboardData api file", err);
        return err?.response?.data;
    }
}
export const getZoomSignature = async (meetingNumber, role = 0) => {
    try {
        const response = await axios.get(
            `${environment.baseUrl}zoom/get-meeting-sdk-jwt`,
            {
                params: {
                    meetingNumber: meetingNumber.toString(),
                    role
                }
            }
        );

        if (response.data.success) {
            return {
                signature: response.data.data.jwt,
                sdkKey: response.data.data.sdkKey
            };
        } else {
            throw new Error(response.data.message || 'Failed to get JWT');
        }
    } catch (error) {
        console.error('Error getting Zoom signature:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to get Zoom signature'
        };
    }
};

export const getAllCallsHistory = async () => {
    try {
        const token = localStorage.getItem('token');
        const url = `${environment.baseUrl}call/public/get-all-calls-history`;
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error fetching call history:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch call history' };
    }
}

export const getAllAstrologerCalls = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.languages?.length) queryParams.append('languages', params.languages.join(','));
        if (params.skills?.length) queryParams.append('skills', params.skills.join(','));
        if (params.minPrice) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
        if (params.experience?.length) queryParams.append('experience', params.experience.join(','));
        if (params.search) queryParams.append('search', params.search);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);

        const url = `${environment.baseUrl}call/public/get-all-call-astrologers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await axios.get(url);
        return response.data;

    } catch (err) {
        console.log("==========error in getAllAstrologerCalls api", err);
        return err?.response?.data;
    }
}

export const getCallFilters = async () => {
    try {
        const url = `${environment.baseUrl}call/public/get-filters`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getCallFilters api", err);
        return err?.response?.data;
    }
}

export const getSingleCallAstrologer = async (id) => {
    try {
        const url = `${environment.baseUrl}call/public/get-single-call-astrologer?id=${id}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log("==========error in getSingleCallAstrologer api", err);
        return err?.response?.data;
    }
}

export const getSingleCoupon = async (id) => {
    try {
        const url = `${environment.baseUrl}coupon/get-single?id=${id}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching single coupon:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch coupon' };
    }
}

export const initiateCall = async (data) => {
    const url = `${environment.baseUrl}call/initiate`;
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (err) {
        console.error('Error initiating call:', err);
        return err?.response?.data || { success: false, message: 'Failed to initiate call' };
    }
}

export const addWalletBalance = async (amount, paymentMethod) => {
    const url = `${environment.baseUrl}wallet/add-balance`;
    try {
        const response = await axios.post(url, { amount, paymentMethod });
        return response.data;
    } catch (err) {
        console.error('Error adding wallet balance:', err);
        return err?.response?.data || { success: false, message: 'Failed to add wallet balance' };
    }
}

export const getInvoiceByServiceOrderId = async (serviceOrderId) => {
    const url = `${environment.baseUrl}invoice/get-details?serviceOrderId=${serviceOrderId}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching invoice details:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch invoice details' };
    }
}

export const getInvoiceByProductOrderId = async (productOrderId) => {
    const url = `${environment.baseUrl}invoice/get-details?productOrderId=${productOrderId}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching invoice details:', err);
        return err?.response?.data || { success: false, message: 'Failed to fetch invoice details' };
    }
}