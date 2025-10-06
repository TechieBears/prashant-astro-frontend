import { DocumentUpload, TickCircle, Eye } from "iconsax-reactjs";
import Error from "../Errors/Error";
import { useState, useEffect } from "react";
import ImageView from "../Modals/ImageView/ImageView";
import { uploadToCloudinary } from "../../api";

const ImageUploadInput = ({
    label,
    errors,
    register,
    registerName,
    multiple,
    setValue,
    defaultValue,
    value,
    onChange,
    style,
    disabled,
}) => {
    const [fileName, setFileName] = useState("");
    const [files, setFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Load existing image on edit
    useEffect(() => {
        const dataToUse = value || defaultValue;
        if (dataToUse) {
            const urls = multiple ? dataToUse : [dataToUse];
            const dummyFiles = urls.map(url => ({
                name: url.split("/").pop(),
                url
            }));
            setFiles(dummyFiles);
            setFileName(dummyFiles.length === 1 ? dummyFiles[0].name : `${dummyFiles.length} files selected`);
            if (onChange) {
                onChange(multiple ? urls : urls[0]);
            } else {
                setValue(registerName, multiple ? urls : urls[0]);
            }
        }
    }, [defaultValue, value, multiple, registerName, setValue, onChange]);

    const handleFileChange = async (e) => {
        if (e?.target?.files?.length > 0) {
            setIsUploading(true);
            const newFiles = Array.from(e.target.files).filter(file => file && file.name); // Filter out undefined files

            if (newFiles.length === 0) {
                console.warn('No valid files selected');
                setIsUploading(false);
                return;
            }

            try {
                const uploadPromises = newFiles.map(file => uploadToCloudinary(file));
                const urls = await Promise.all(uploadPromises);

                // Filter out any undefined or null URLs
                const validUrls = urls.filter(url => url && typeof url === 'string');

                if (validUrls.length === 0) {
                    throw new Error('No valid URLs returned from upload');
                }

                console.log('Uploaded URLs:', validUrls);
                if (onChange && typeof onChange === 'function') {
                    console.log('Using onChange for image upload');
                    try {
                        onChange(multiple ? validUrls : validUrls[0]);
                    } catch (onChangeError) {
                        console.error('Error in onChange callback:', onChangeError);
                        throw onChangeError;
                    }
                } else {
                    console.log('Using setValue for image upload');
                    if (setValue && registerName) {
                        if (multiple) {
                            setValue(registerName, validUrls);
                        } else {
                            setValue(registerName, validUrls[0]);
                        }
                    } else {
                        console.warn('setValue or registerName not provided');
                    }
                }

                const previewFiles = newFiles.map((file, idx) => ({
                    file,
                    name: file.name,
                    url: validUrls[idx] || urls[idx] // Fallback to original urls if validUrls is shorter
                }));

                setFiles(previewFiles);
                setFileName(previewFiles.length === 1 ? previewFiles[0].name : `${previewFiles.length} files selected`);
            } catch (error) {
                console.error("Upload failed:", error);
            } finally {
                setIsUploading(false);
            }
        } else {
            setFiles([]);
            setFileName("");
            if (onChange) {
                onChange(multiple ? [] : null);
            } else {
                setValue(registerName, multiple ? [] : null);
            }
        }
    };

    const openModal = () => {
        if (files.length > 0) setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className={`h-[53px] relative flex rounded-lg w-full cursor-pointer bg-slate-100 ${style}`}>
                <input
                    type="file"
                    id={registerName}
                    accept="image/*"
                    multiple={multiple}
                    className={`peer w-full bg-transparent outline-none px-4 text-base font-tbLex text-black rounded-lg bg-slate-100 ${style}
                        ${!errors?.ref?.value && errors?.type === "required"
                            ? 'border-red-500'
                            : 'border-slate-300 focus:border-primary'}
                        opacity-0 absolute z-10 cursor-pointer ${style}`}
                    onChange={handleFileChange}
                    disabled={isUploading || disabled}
                />
                <div className={`w-full h-full flex items-center px-4 rounded-lg  cursor-pointer
                    ${!errors?.ref?.value && errors?.type === "required"
                        ? 'border-red-500'
                        : 'border-slate-300 peer-focus:border-primary'} ${style}`}>
                    <label
                        htmlFor={registerName}
                        className={`px-2 bg-slate-100 text-base font-tbLex ${style}
                            ${!errors?.ref?.value && errors?.type === "required"
                                ? 'text-red-500'
                                : fileName
                                    ? 'text-primary'
                                    : 'text-slate-400'}
                            ${fileName ? 'top-0 left-3 text-sm' : ''} transition-all duration-150 flex items-center gap-2 cursor-pointer overflow-hidden`}
                    >
                        {!fileName && <span><DocumentUpload size="22" /></span>}
                        <span className="truncate w-full overflow-hidden">{isUploading ? "Uploading..." : fileName || label}</span>
                    </label>
                    <div className={`ml-auto flex items-center gap-2 z-50 absolute right-2 bg-slate-100 pl-3 cursor-pointer ${style}`}>
                        {fileName && !isUploading && (
                            <span className="text-sm text-green-500 text-nowrap flex items-center">
                                <TickCircle size="22" variant="Bold" />
                            </span>
                        )}
                        {files.length > 0 && !isUploading && (
                            <button
                                type="button"
                                onClick={openModal}
                                className="text-slate-500 cursor-pointer hover:text-primary transition-colors"
                            >
                                <Eye size="22" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {!errors?.ref?.value && errors?.type === "required" && (
                <Error message={`${label.replace(/\b(enter|your)\b/gi, '').trim()} is required`} />
            )}

            <ImageView isOpen={showModal} toggle={closeModal} files={files} />
        </>
    );
};

export default ImageUploadInput;
