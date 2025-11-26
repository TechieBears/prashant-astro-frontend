export const parseZoomUrl = (zoomUrl) => {
    try {
        let decodedUrl = zoomUrl.replace(/&amp;/g, '&');
        decodedUrl = decodeURIComponent(decodeURIComponent(decodedUrl));
        decodedUrl = decodedUrl.replace('/j/', '/wc/join/');

        const url = new URL(decodedUrl);
        const meetingId = url.pathname.split('/wc/join/')[1];
        const password = url.searchParams.get('pwd');

        const userName = url.searchParams.get('uname') ? decodeURIComponent(url.searchParams.get('uname')) : 'Guest';

        console.log('Parsed password:', password);

        return {
            meetingId,
            password,
            userName,
            isValid: !!(meetingId && password)
        };
    } catch (error) {
        console.error('Error parsing Zoom URL:', error);
        return { isValid: false };
    }
};

export const buildWebClientUrl = (zoomUrl) => {
    try {
        let decodedUrl = zoomUrl.replace(/&amp;/g, '&');
        decodedUrl = decodeURIComponent(decodeURIComponent(decodedUrl));
        decodedUrl = decodedUrl.replace('/j/', '/wc/join/');

        console.log('Original URL:', zoomUrl);
        console.log('Final URL:', decodedUrl);

        return decodedUrl;
    } catch (error) {
        console.error('Error building web client URL:', error);
        return zoomUrl;
    }
};