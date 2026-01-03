import { DocumentUpload, TickCircle, Eye } from "iconsax-reactjs";
import Error from "../Errors/Error";
import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ImageView from "../Modals/ImageView/ImageView";

const ImageCropUpload = ({
    label,
    errors,
    multiple,
    register,
    registerName,
    setValue,
    defaultValue,
    style,
    disabled,
    cropAspectRatio = 5 / 3,
    cropWidth = 400,
    cropHeight = 600,
    onDelete,
}) => {
    const [fileName, setFileName] = useState("");
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [crop, setCrop] = useState({
        unit: "px",
        width: cropWidth,
        height: cropHeight,
        x: 50,
        y: 50,
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [zoom, setZoom] = useState(1);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const hasLoadedDefault = useRef(false);
    const prevDefaultValue = useRef(defaultValue);

    useEffect(() => {
        if (defaultValue && !hasLoadedDefault.current) {
            hasLoadedDefault.current = true;
            prevDefaultValue.current = defaultValue;
            if (multiple && Array.isArray(defaultValue)) {
                const dummyFiles = defaultValue.map((url) => ({
                    name: url.split("/").pop(),
                    url,
                }));
                setFiles(dummyFiles);
                setFileName(
                    dummyFiles.length === 1
                        ? dummyFiles[0].name
                        : `${dummyFiles.length} files selected`
                );
                setValue(registerName, defaultValue);
            } else if (!multiple && typeof defaultValue === "string") {
                const dummyFile = {
                    name: defaultValue.split("/").pop(),
                    url: defaultValue,
                };
                setFiles([dummyFile]);
                setFileName(dummyFile.name);
                setValue(registerName, defaultValue);
            }
        }
    }, [defaultValue, registerName, setValue, multiple]);

    const handleFileChange = (e) => {
        if (e?.target?.files?.length > 0) {
            if (multiple) {
                const fileArray = Array.from(e.target.files);
                processFilesSequentially(fileArray, 0);
            } else {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    setSelectedImage({
                        file,
                        src: reader.result,
                        name: file.name,
                    });
                    setShowCropModal(true);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const processFilesSequentially = (fileArray, index) => {
        if (index >= fileArray.length) return;

        const file = fileArray[index];
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage({
                file,
                src: reader.result,
                name: file.name,
                isMultiple: true,
                currentIndex: index,
                totalFiles: fileArray.length,
                remainingFiles: fileArray.slice(index + 1),
            });
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    const onImageLoad = useCallback(
        (e) => {
            const { width, height } = e.currentTarget;

            // Calculate crop dimensions based on aspect ratio
            let calculatedWidth, calculatedHeight;

            if (width / height > cropAspectRatio) {
                // Image is wider than crop ratio
                calculatedHeight = Math.min(height, cropHeight);
                calculatedWidth = calculatedHeight * cropAspectRatio;
            } else {
                // Image is taller than crop ratio
                calculatedWidth = Math.min(width, cropWidth);
                calculatedHeight = calculatedWidth / cropAspectRatio;
            }

            const centerX = Math.max(0, (width - calculatedWidth) / 2);
            const centerY = Math.max(0, (height - calculatedHeight) / 2);

            const initialCrop = {
                unit: "px",
                width: calculatedWidth,
                height: calculatedHeight,
                x: centerX,
                y: centerY,
            };
            setCrop(initialCrop);
            setCompletedCrop(initialCrop);
            setZoom(1);
        },
        [cropWidth, cropHeight, cropAspectRatio]
    );

    const getCroppedImg = useCallback(
        (image, crop) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (!crop || !canvas || !ctx) return;

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const imgDisplayWidth = image.width * zoom;
            const imgDisplayHeight = image.height * zoom;

            const offsetX = (imgDisplayWidth - image.width) / 2;
            const offsetY = (imgDisplayHeight - image.height) / 2;

            const adjustedCropX = (crop.x + offsetX) / zoom;
            const adjustedCropY = (crop.y + offsetY) / zoom;
            const adjustedCropWidth = crop.width / zoom;
            const adjustedCropHeight = crop.height / zoom;

            // Use actual cropped dimensions from source image
            const sourceWidth = adjustedCropWidth * scaleX;
            const sourceHeight = adjustedCropHeight * scaleY;

            // Set canvas to source dimensions (no upscaling)
            canvas.width = sourceWidth;
            canvas.height = sourceHeight;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(
                image,
                adjustedCropX * scaleX,
                adjustedCropY * scaleY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                sourceWidth,
                sourceHeight
            );

            return new Promise((resolve) => {
                canvas.toBlob(resolve, "image/jpeg", 0.95);
            });
        },
        [zoom]
    );

    const handleCropComplete = async () => {
        const cropToUse = completedCrop || crop;
        if (!cropToUse || !imgRef.current) return;

        setIsUploading(true);
        try {
            const croppedBlob = await getCroppedImg(imgRef.current, cropToUse);
            const croppedFile = new File([croppedBlob], selectedImage.name, {
                type: "image/jpeg",
            });

            const previewUrl = URL.createObjectURL(croppedBlob);

            const previewFile = {
                file: croppedFile,
                name: selectedImage.name,
                url: previewUrl,
            };

            if (multiple) {
                const newFiles = [...files, previewFile];
                setFiles(newFiles);
                setFileName(`${newFiles.length} files selected`);
                setValue(
                    registerName,
                    newFiles.map((f) => f.file),
                    { shouldValidate: false, shouldDirty: true }
                );

                if (
                    selectedImage.remainingFiles &&
                    selectedImage.remainingFiles.length > 0
                ) {
                    setShowCropModal(false);
                    processFilesSequentially(selectedImage.remainingFiles, 0);
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

        if (onDelete) {
            onDelete(url);
        }
    };

    return (
        <>
            <div
                className={`h-[53px] relative flex rounded-lg w-full cursor-pointer bg-slate1 ${style}`}
            >
                <input
                    type="file"
                    id={registerName}
                    accept="image/*"
                    multiple={multiple}
                    className={`peer w-full bg-transparent outline-none px-4 text-base font-tbLex text-black rounded-lg bg-slate1 ${style}
            ${!errors?.ref?.value && errors?.type === "required"
                            ? "border-red-500"
                            : "border-slate-300 focus:border-primary"
                        }
            opacity-0 absolute z-10 cursor-pointer ${style}`}
                    onChange={handleFileChange}
                    disabled={isUploading || disabled}
                />
                <div
                    className={`w-full h-full flex items-center px-4 rounded-lg cursor-pointer
          ${!errors?.ref?.value && errors?.type === "required"
                            ? "border-red-500"
                            : "border-slate-300 peer-focus:border-primary"
                        } ${style}`}
                >
                    <label
                        htmlFor={registerName}
                        className={`px-2 bg-slate1 text-base font-tbLex ${style}
              ${!errors?.ref?.value && errors?.type === "required"
                                ? "text-red-500"
                                : fileName
                                    ? "text-primary"
                                    : "text-slate-400"
                            }
              ${fileName ? "top-0 left-3 text-sm" : ""
                            } transition-all duration-150 flex items-center gap-2 cursor-pointer overflow-hidden`}
                    >
                        {!fileName && (
                            <span>
                                <DocumentUpload size="22" />
                            </span>
                        )}
                        <span className="truncate w-full overflow-hidden">
                            {isUploading ? "Uploading..." : fileName || label}
                        </span>
                    </label>
                    <div
                        className={`ml-auto flex items-center gap-2 z-50 absolute right-2 bg-slate1 pl-3 cursor-pointer ${style}`}
                    >
                        {fileName && !isUploading && (
                            <span className="text-sm text-green-500 text-nowrap flex items-center">
                                <TickCircle size="22" variant="Bold" />
                            </span>
                        )}
                        {files.length > 0 && !isUploading && (
                            <button
                                type="button"
                                onClick={() => setShowImageModal(true)}
                                className="text-slate-500 cursor-pointer hover:text-primary transition-colors"
                            >
                                <Eye size="22" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {!errors?.ref?.value && errors?.type === "required" && (
                <Error
                    message={`${label
                        .replace(/\b(enter|your)\b/gi, "")
                        .trim()} is required`}
                />
            )}

            <Transition appear show={showCropModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[1000]"
                    onClose={handleCropCancel}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 " />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl  rounded-lg bg-white text-left align-middle ">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white bg-linear-gradient py-4 px-6 relative"
                                    >
                                        {selectedImage?.isMultiple
                                            ? `Crop Image ${(selectedImage.currentIndex || 0) + 1
                                            } of ${selectedImage.totalFiles || 1}`
                                            : "Crop Your Image"}
                                        <button
                                            onClick={handleCropCancel}
                                            className="absolute right-4 top-4 text-white hover:text-gray-200"
                                        >
                                            <X size={24} />
                                        </button>
                                    </Dialog.Title>

                                    <div className="p-6">
                                        <div className="flex justify-center">
                                            {selectedImage && (
                                                <ReactCrop
                                                    crop={crop}
                                                    onChange={(newCrop) => setCrop(newCrop)}
                                                    onComplete={(c) => setCompletedCrop(c)}
                                                    aspect={cropAspectRatio}
                                                    locked={true}
                                                    className="max-w-full"
                                                    ruleOfThirds={true}
                                                >
                                                    <img
                                                        ref={imgRef}
                                                        src={selectedImage.src}
                                                        alt="Crop preview"
                                                        className="max-w-full max-h-96 object-contain"
                                                        style={{
                                                            transform: `scale(${zoom})`,
                                                            transformOrigin: "center",
                                                            transition: "transform 0.2s ease",
                                                        }}
                                                        onLoad={onImageLoad}
                                                    />
                                                </ReactCrop>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4 px-6">
                                        <label className="text-sm font-medium text-gray-700 min-w-[60px]">
                                            Zoom:
                                        </label>

                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5"
                                            step="0.010"
                                            value={zoom}
                                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoom - 0.1) / (5 - 0.1)) * 100}%, #e5e7eb ${((zoom - 0.1) / (5 - 0.1)) * 100}%, #e5e7eb 100%)`
                                            }}
                                        />
                                    </div>
                                    <div className="bg-gray-50 px-6 py-4 flex justify-center items-center">
                                        {/* <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setCrop({
                          unit: "px",
                          width: cropWidth,
                          height: cropHeight,
                          x: 50,
                          y: 50,
                        });
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Reset
                    </button> */}
                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleCropCancel}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCropComplete}
                                                disabled={isUploading}
                                                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md"
                                            >
                                                {isUploading ? "Processing..." : "Crop & Save"}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <ImageView
                isOpen={showImageModal}
                toggle={() => setShowImageModal(false)}
                files={files}
                onDelete={handleDelete}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
    );
};

export default ImageCropUpload;
