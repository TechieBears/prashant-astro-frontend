export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const checkTokenOnNavigation = () => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('persist:root');
        localStorage.removeItem('rememberedCredentials');
        return false;
    }
    return !!token;
};
