export const validatePassword = (value) => {
    const oldPattern = /^\d{6}$/; // Old: exactly 6 digits
    const newPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/; // New: 8+ characters, with number, letter, special char

    if (oldPattern.test(value) || newPattern.test(value)) {
        return true;
    }

    return 'Password must be either 6 digits (old format) or 8+ characters including a number, a letter, and a special character (new format)';
};


// ===================== Custom validation function for a 6-digit PIN code ================
export const validatePIN = (value) => {
    const pattern = /^(?!0)(?!([0-9])\1{5})\d{6}$/;
    if (pattern.test(value)) {
        return true;
    }
    return 'InValid Pincode';
};


//============================ Custom validation function for a 10-digit US phone number ==============================
export const validatePhoneNumber = (value) => {
    const isValid = /^(\+91)?[6-9][0-9]{9}$/.test(value);
    if (!isValid) {
        return "Phone Number must be 10-digit";
    }
    return true;
};


// ==================== Custom validation function for email ========================
export const validateEmail = (value) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (emailPattern.test(value)) {
        return true;
    }
    return 'Invalid email address';
};


// ==================== Custom validation function for GST ========================
export const validateGST = (value) => {
    // GST pattern for India
    const gstPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

    if (gstPattern.test(value)) {
        return true;
    }

    return 'Invalid GST number*';
};

export const validateCommision = (value) => {
    if (isNaN(value) || value.toString().length > 2) {
        return "Please enter a number with maximum 2 digits";
    }
    return true;
};


export const validatePANCard = (value) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (panPattern.test(value)) {
        return true;
    }

    return 'Invalid PAN number*';
};

export const validateAadharCard = (value) => {
    const aadharPattern = /^(?:\d{4}\s?\d{4}\s?\d{4}|^\d{12})$/;

    if (aadharPattern.test(value)) {
        return true;
    }
    return 'Invalid Aadhaar Card number*';
};

export const validateIFSC = (value) => {
    const IFSCPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (IFSCPattern.test(value)) {
        return true;
    }
    return 'Invalid ISFC code*';
};

export const validateAccountNo = (value) => {
    const AccountPattern = /^\d{9,18}$/;

    if (AccountPattern.test(value)) {
        return true;
    }
    return 'Invalid Account Number*';
};

export const validateAlphabets = (value) => {
    const AlphabetsPattern = /^[A-Za-z]+$/i;

    if (AlphabetsPattern.test(value)) {
        return true;
    }
    return 'Should Contain Alphabets Only*';
};

export const handlePincodeMaxLength = (e) => {
    if (e.target.value.length >= 6 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
}

export const handleMobileNoNumericInput = (e) => {
    if ((e.key < '0' || e.key > '9') && e.key !== 'Backspace') {
        e.preventDefault();
    }
};

export const handlePancardUpperCase = (e) => {
    if (e.target.value) {
        return e.target.value.toUpperCase()
    }
}

export const checkData = (value) => {
    return value == null || value === undefined || value === "" ? "-----" : value;
}

export const validateAlphabetic = (value) => {
    const AlphabetPattern = /^[A-Za-z\s]+$/i; // Includes /i for case insensitivity

    if (AlphabetPattern.test(value)) {
        return true;
    }
    return 'Should Contain Alphabets Only*';
};


export const validateUrl = (value) => {
    if (!value) return true;
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    if (urlPattern.test(value)) {
        return true;
    }
    return 'Please enter a valid URL*';
};


export const validateFacebookUrl = (url) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?facebook\.com\/.+/i;
    return pattern.test(url) || "Please enter a valid Facebook URL (e.g., https://facebook.com/username)";
};

export const validateInstagramUrl = (url) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i;
    return pattern.test(url) || "Please enter a valid Instagram URL (e.g., https://instagram.com/username)";
};

export const validateTwitterUrl = (url) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?(x)\.com\/.+/i;
    return pattern.test(url) || "Please enter a valid Twitter/X URL (e.g., https://x.com/username)";
};

export const validateYoutubeUrl = (url) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
    return pattern.test(url) || "Please enter a valid YouTube URL (e.g., https://youtube.com/username)";
};

export const validateYoutubeWatchUrl = (url) => {
    if (!url) return true;

    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|@[a-zA-Z0-9_-]+)|youtu\.be\/)[\w-]+/i;

    if (!pattern.test(url)) {
        return "Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=..., https://www.youtube.com/@username, or https://www.youtube.com/shorts/...)";
    }

    if (url.includes("/@")) {
        return true;
    }

    const videoId = url.match(/(?:v=|shorts\/|be\/|embed\/)([\w-]+)/)?.[1];
    if (!videoId || videoId.length !== 11) {
        return "YouTube video ID should be 11 characters long";
    }

    return true;
};

export const validateLinkedInUrl = (url) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i;
    return pattern.test(url) || "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)";
};

export const validateImdbUrl = (url) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?imdb\.com\/.+/i;
    return pattern.test(url) || "Please enter a valid IMDB URL (e.g., https://imdb.com/name/nm1234567)";
};
