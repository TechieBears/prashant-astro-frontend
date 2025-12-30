import { DocumentUpload, TickCircle, Eye } from "iconsax-reactjs";
import Error from "../Errors/Error";
import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ImageView from "../Modals/ImageView/ImageView";

const ImageCropUploadWeb = ({
    label, errors, multiple, registerName, setValue, defaultValue, style = "", disabled,
    cropAspectRatio = 2.75, cropWidth = 550, cropHeight = 200, onDelete
}) => {
    const [fileName, setFileName] = useState("");
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [crop, setCrop] = useState({ unit: "px", width: cropWidth, height: cropHeight, x: 50, y: 50 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [zoom, setZoom] = useState(1);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!defaultValue) return;
        const isArray = Array.isArray(defaultValue);
        if (multiple && isArray) {
            const dummyFiles = defaultValue.map(url => ({ name: url.split("/").pop(), url }));
            setFiles(dummyFiles);
            setFileName(dummyFiles.length === 1 ? dummyFiles[0].name : `${dummyFiles.length} files selected`);
            setValue(registerName, defaultValue);
        } else if (!multiple && typeof defaultValue === "string") {
            const dummyFile = { name: defaultValue.split("/").pop(), url: defaultValue };
            setFiles([dummyFile]);
            setFileName(dummyFile.name);
            setValue(registerName, defaultValue);
        }
    }, []);

    const processFile = (file, index = 0, total = 1, remaining = []) => {
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage({ file, src: reader.result, name: file.name, isMultiple: multiple, currentIndex: index, totalFiles: total, remainingFiles: remaining });
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => {
        if (!e?.target?.files?.length) return;
        const fileArray = Array.from(e.target.files);
        if (multiple) processFile(fileArray[0], 0, fileArray.length, fileArray.slice(1));
        else processFile(fileArray[0]);
    };

    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget;
        const ratio = cropAspectRatio;
        let w, h;
        if (width / height > ratio) {
            h = Math.min(height, cropHeight);
            w = h * ratio;
        } else {
            w = Math.min(width, cropWidth);
            h = w / ratio;
        }
        const initialCrop = { unit: "px", width: w, height: h, x: Math.max(0, (width - w) / 2), y: Math.max(0, (height - h) / 2) };
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
        setZoom(1);
    }, [cropWidth, cropHeight, cropAspectRatio]);

    const getCroppedImg = useCallback((image, crop) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!crop || !canvas || !ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const offsetX = (image.width * zoom - image.width) / 2;
        const offsetY = (image.height * zoom - image.height) / 2;
        const adjustedCropX = (crop.x + offsetX) / zoom;
        const adjustedCropY = (crop.y + offsetY) / zoom;
        const adjustedCropWidth = crop.width / zoom;
        const adjustedCropHeight = crop.height / zoom;
        const sourceWidth = adjustedCropWidth * scaleX;
        const sourceHeight = adjustedCropHeight * scaleY;

        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, adjustedCropX * scaleX, adjustedCropY * scaleY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

        return new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.95));
    }, [zoom]);

    const handleCropComplete = async () => {
        const cropToUse = completedCrop || crop;
        if (!cropToUse || !imgRef.current) return;

        setIsUploading(true);
        try {
            const croppedBlob = await getCroppedImg(imgRef.current, cropToUse);
            const croppedFile = new File([croppedBlob], selectedImage.name, { type: "image/jpeg" });
            const previewFile = { file: croppedFile, name: selectedImage.name, url: URL.createObjectURL(croppedBlob) };

            if (multiple) {
                const newFiles = [...files, previewFile];
                setFiles(newFiles);
                setFileName(`${newFiles.length} files selected`);
                setValue(registerName, newFiles.map(f => f.file), { shouldValidate: false, shouldDirty: true });

                if (selectedImage.remainingFiles?.length > 0) {
                    setShowCropModal(false);
                    processFile(selectedImage.remainingFiles[0], selectedImage.currentIndex + 1, selectedImage.totalFiles, selectedImage.remainingFiles.slice(1));
                } else {
                    setShowCropModal(false);
                    setSelectedImage(null);
                }
            } else {
                setFiles([previewFile]);
                setFileName(selectedImage.name);
                setValue(registerName, croppedFile);
                setShowCropModal(false);
                setSelectedImage(null);
            }

            const fileInput = document.getElementById(registerName);
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Crop failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setSelectedImage(null);
        setCrop({ x: 0, y: 0, width: cropWidth, height: cropHeight });
        setCompletedCrop(null);
        setZoom(1);
        const fileInput = document.getElementById(registerName);
        if (fileInput) fileInput.value = "";
    };

    const handleDelete = (url) => {
        const updatedFiles = files.filter(file => file.url !== url);
        setFiles(updatedFiles);
        if (updatedFiles.length === 0) {
            setFileName("");
            setValue(registerName, multiple ? [] : null);
        } else {
            setFileName(updatedFiles.length === 1 ? updatedFiles[0].name : `${updatedFiles.length} files selected`);
            setValue(registerName, multiple ? updatedFiles.map(f => f.file) : updatedFiles[0].file);
        }
        if (onDelete) onDelete(url);
    };

    const isError = !errors?.ref?.value && errors?.type === "required";
    const borderClass = isError ? "border-red-500" : "border-slate-300 focus:border-primary";
    const textClass = isError ? "text-red-500" : fileName ? "text-primary" : "text-slate-400";

    return (
        <>
            <div className={`h-[53px] relative flex rounded-lg w-full cursor-pointer bg-slate1 ${style}`}>
                <input type="file" id={registerName} accept="image/*" multiple={multiple}
                    className={`peer w-full bg-transparent outline-none px-4 text-base font-tbLex text-black rounded-lg bg-slate1 ${borderClass} opacity-0 absolute z-10 cursor-pointer ${style}`}
                    onChange={handleFileChange} disabled={isUploading || disabled} />
                <div className={`w-full h-full flex items-center px-4 rounded-lg cursor-pointer ${borderClass} peer-focus:border-primary ${style}`}>
                    <label htmlFor={registerName} className={`px-2 bg-slate1 text-base font-tbLex ${textClass} ${fileName ? "top-0 left-3 text-sm" : ""} transition-all duration-150 flex items-center gap-2 cursor-pointer overflow-hidden ${style}`}>
                        {!fileName && <DocumentUpload size="22" />}
                        <span className="truncate w-full overflow-hidden">{isUploading ? "Uploading..." : fileName || label}</span>
                    </label>
                    <div className={`ml-auto flex items-center gap-2 z-50 absolute right-2 bg-slate1 pl-3 cursor-pointer ${style}`}>
                        {fileName && !isUploading && <TickCircle size="22" variant="Bold" className="text-green-500" />}
                        {files.length > 0 && !isUploading && <button type="button" onClick={() => setShowImageModal(true)} className="text-slate-500 hover:text-primary transition-colors"><Eye size="22" /></button>}
                    </div>
                </div>
            </div>

            {isError && <Error message={`${label.replace(/\b(enter|your)\b/gi, "").trim()} is required`} />}

            <Transition appear show={showCropModal} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={handleCropCancel}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white text-left align-middle max-h-[90vh] flex flex-col">
                                    <Dialog.Title as="h3" className="text-base font-medium text-white bg-linear-gradient py-3 px-4 relative flex-shrink-0">
                                        {selectedImage?.isMultiple ? `Crop Image ${(selectedImage.currentIndex || 0) + 1} of ${selectedImage.totalFiles || 1}` : "Crop Your Image (Landscape)"}
                                        <button onClick={handleCropCancel} className="absolute right-3 top-3 text-white hover:text-gray-200"><X size={20} /></button>
                                    </Dialog.Title>
                                    <div className="p-4 overflow-y-auto flex-1">
                                        <div className="flex justify-center">
                                            {selectedImage && (
                                                <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop} aspect={cropAspectRatio} locked className="max-w-full" ruleOfThirds>
                                                    <img ref={imgRef} src={selectedImage.src} alt="Crop preview" className="max-w-full max-h-[50vh] object-contain"
                                                        style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.2s ease" }} onLoad={onImageLoad} />
                                                </ReactCrop>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-4 pb-3 flex-shrink-0">
                                        <label className="text-xs font-medium text-gray-700">Zoom:</label>
                                        <input type="range" min="0.1" max="5" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer" />
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 flex justify-center gap-3 flex-shrink-0">
                                        <button type="button" onClick={handleCropCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50">Cancel</button>
                                        <button type="button" onClick={handleCropComplete} disabled={isUploading} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md">{isUploading ? "Processing..." : "Crop & Save"}</button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <ImageView isOpen={showImageModal} toggle={() => setShowImageModal(false)} files={files} onDelete={handleDelete} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
    );
};

export default ImageCropUploadWeb;
