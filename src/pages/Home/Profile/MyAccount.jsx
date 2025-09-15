import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";
import { updateCustomerProfile, uploadToCloudinary } from "../../../api";
import toast from "react-hot-toast";

const MyAccount = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        defaultValues: {
            title: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            profileImage: null
        }
    });

    const title = watch("title");
    const profileImage = watch("profileImage");

    const onSubmit = async (data) => {
        const toastId = toast.loading('Updating profile...');

        try {
            if (data.profileImage instanceof File) {
                try {
                    const imageUrl = await uploadToCloudinary(data.profileImage);
                    data.profileImage = imageUrl;
                } catch (err) {
                    console.error('Error uploading image:', err);
                    throw new Error('Failed to upload profile image');
                }
            } else if (data.profileImage === null) {
                delete data.profileImage;
            }

            const payload = {
                title: data.title,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                isActive: true
            };

            if (data.profileImage) {
                payload.profileImage = data.profileImage;
            }

            const response = await updateCustomerProfile(payload);

            if (response?.success) {
                toast.success('Profile updated successfully!', { id: toastId });
            } else {
                throw new Error(response?.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.message || 'An error occurred while updating your profile', { id: toastId });
        }
    };

    return (
        <div className="flex px-40 py-12">
            <ProfileSidebar />
            <div className="flex-1 ml-6 rounded-lg bg-white p-6">
                <h2 className="font-semibold text-lg mb-6">My Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label>Title <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                            {["Mr", "Mrs", "Miss", "Baby", "Master"].map((opt) => (
                                <label
                                    key={opt}
                                    className={`px-3 py-2 rounded-xl border text-sm cursor-pointer transition-all duration-150 ${title === opt
                                            ? "border-primary text-primary font-medium"
                                            : "bg-white text-black"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={opt}
                                        checked={title === opt}
                                        onChange={() => setValue("title", opt, { shouldValidate: true })}
                                        className="hidden"
                                        {...register("title", { required: "Title is required" })}
                                    />
                                    {opt}
                                </label>
                            ))}
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">First Name</label>
                        <input
                            type="text"
                            placeholder="Enter first name"
                            className={`w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12 ${errors.firstName ? "border border-red-500" : ""
                                }`}
                            {...register("firstName", {
                                required: "First name is required",
                                minLength: {
                                    value: 2,
                                    message: "First name must be at least 2 characters"
                                }
                            })}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter last name"
                            className={`w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12 ${errors.lastName ? "border border-red-500" : ""
                                }`}
                            {...register("lastName", {
                                required: "Last name is required",
                                minLength: {
                                    value: 2,
                                    message: "Last name must be at least 2 characters"
                                }
                            })}
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            className={`w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12 ${errors.email ? "border border-red-500" : ""
                                }`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Phone Number</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            className={`w-full rounded-lg px-3 py-2 focus:outline-none bg-[#F8FAFC] h-12 ${errors.phone ? "border border-red-500" : ""
                                }`}
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Please enter a valid 10-digit phone number"
                                }
                            })}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Profile Image</label>
                        <input
                            type="file"
                            className="w-full text-sm bg-[#F8FAFC] h-12"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setValue("profileImage", file);
                                }
                            }}
                        />
                    </div>

                    <div className="col-span-2 flex justify-end mt-12 space-x-4">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-6 py-2 border border-black hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`mt-4 bg-primary text-white rounded-lg py-2 px-6 hover:bg-primary-dark transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyAccount;
