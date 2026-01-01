"use client";

import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const EditForm = ({ data, user }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset
    } = useForm();

    const [profileImage, setProfileImage] = useState("./assets/profile/image.png");
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [displayPhone, setDisplayPhone] = useState("");
    const [displayEmail, setDisplayEmail] = useState("");
    const profileImageRef = useRef(null);

    // Watch the form fields for real-time updates
    const givenName = watch("given_name");
    const surname = watch("surname");
    const phoneNumber = watch("phone_number");
    const email = watch("email");
    const passportFile = watch("passport_file");
    const visaFile = watch("visa_file");

    // Initialize form with data when component mounts or data changes
    useEffect(() => {
        if (data || user) {
            const formData = {
                "given_name": data?.given_name || user?.givenName || "",
                "surname": data?.surname || user?.surname || "",
                "customer_id": data?.customer_id || user?.id || "",
                "gender": data?.gender || "",
                "phone_number": data?.phone_number || user?.phone || "",
                "email": user?.email || "",
                "date_of_birth": data?.date_of_birth ? data.date_of_birth.split('T')[0] : user?.dob || "",
                "nationality": data?.nationality || "",
                "address": data?.address || "",
                "postcode": data?.post_code || "",
                "passport": data?.passport_number || "",
                "expire": data?.passport_expiry_date ? data.passport_expiry_date.split('T')[0] : user?.expireDate || "",
                "passport_file": null,
                "visa_file": null,
            };

            reset(formData);

            // Set initial display values
            const initialGivenName = data?.given_name || user?.givenName || "";
            const initialSurname = data?.surname || user?.surname || "";
            const initialPhone = data?.phone_number || user?.phone || "N/A";
            const initialEmail = user?.email || "user@example.com";

            setDisplayName(`${initialGivenName} ${initialSurname}`.trim() || "User");
            setDisplayPhone(initialPhone);
            setDisplayEmail(initialEmail);

            // Set profile image if available
            if (data?.profile_image) {
                setProfileImage(data.profile_image);
            } else if (user?.profileImage) {
                setProfileImage(user.profileImage);
            }

        }
    }, [data, user, reset]);

    // Update display values when form fields change
    useEffect(() => {
        if (givenName || surname) {
            const newName = `${givenName || ""} ${surname || ""}`.trim();
            setDisplayName(newName || "User");
        }
    }, [givenName, surname]);

    useEffect(() => {
        if (phoneNumber !== undefined) {
            setDisplayPhone(phoneNumber || "N/A");
        }
    }, [phoneNumber]);

    useEffect(() => {
        if (email !== undefined) {
            setDisplayEmail(email || "user@example.com");
        }
    }, [email]);

    const handleProfileImageChange = (event) => {
        if (!isEditing) return;

        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (PNG, JPG, JPEG)');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Profile image must be less than 2MB');
                return;
            }

            // Create preview URL
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const triggerProfileImageInput = () => {
        if (!isEditing) return;
        profileImageRef.current?.click();
    };

    const onSubmit = async (formData) => {
        console.log('Form data to submit:', formData);

        try {
            // Create FormData for file upload (Laravel compatible)
            const submitData = new FormData();

            // Append all form fields with Laravel-friendly names
            submitData.append('given_name', formData.given_name);
            submitData.append('surname', formData.surname);
            submitData.append('customer_id', formData.customer_id);
            submitData.append('gender', formData.gender);
            submitData.append('phone_number', formData.phone_number);
            submitData.append('email', formData.email);
            submitData.append('date_of_birth', formData.date_of_birth);
            submitData.append('nationality', formData.nationality);
            submitData.append('address', formData.address);
            submitData.append('postcode', formData.postcode);
            submitData.append('passport', formData.passport);
            submitData.append('expire', formData.expire);

            // Append files if they exist
            if (formData.passport_file && formData.passport_file[0]) {
                submitData.append('passport_file', formData.passport_file[0]);
            }

            if (formData.visa_file && formData.visa_file[0]) {
                submitData.append('visa_file', formData.visa_file[0]);
            }

            // Append profile image if changed
            if (profileImageRef.current?.files[0]) {
                submitData.append('profile_image', profileImageRef.current.files[0]);
            }

            // Add _method for Laravel to recognize as PUT request
            submitData.append('_method', 'PUT');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer-details/${data?.id || user?.id}`, {
                method: "POST", // Use POST with _method=PUT for Laravel
                headers: {
                    // Don't set Content-Type for FormData - browser will set it automatically with boundary
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: submitData,
            });

            if (response.ok) {
                const result = await response.json();
                alert('Profile updated successfully!');
                setIsEditing(false);

                // Update profile image if it was changed
                if (result.data?.profile_image) {
                    setProfileImage(result.data.profile_image);
                }

                // Update display values with final values
                setDisplayName(`${formData.given_name} ${formData.surname}`.trim());
                setDisplayPhone(formData.phone_number || "N/A");
                setDisplayEmail(formData.email || "user@example.com");
            } else {
                // Handle Laravel validation errors
                const errorData = await response.json();
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join('\n');
                    alert(`Validation errors:\n${errorMessages}`);
                } else {
                    throw new Error(errorData.message || 'Failed to update profile');
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className="w-full">
            <main className="w-full pb-10">
                {/* Header */}
                <div className="w-full bg-blue-950 rounded shadow-sm border-b border-gray-200">
                    <div className=" py-3">
                        <div className="text-center">
                            {/* Profile Image */}
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mx-auto">
                                    <Image
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "./assets/profile/image.png";
                                        }}
                                    />
                                </div>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={triggerProfileImageInput}
                                        className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={profileImageRef}
                                    className="hidden"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleProfileImageChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* User Info */}
                            <h1 className="text-2xl font-bold text-gray-100">
                                {displayName}
                            </h1>
                            <p className="text-gray-100 flex items-center justify-center gap-2 mt-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {displayEmail}
                            </p>
                            <p className="text-gray-100 flex items-center justify-center gap-2 mt-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {displayPhone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="w-full mt-10 px-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

                        {/* Form Header */}
                        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                                    <svg className="w-5 h-5 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Personal Information
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Update your personal details & documents</p>
                            </div>

                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="px-6 py-2 bg-gradient-to-r from-[#313881] to-[#0678B4] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Form Body */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)}>

                                {/* Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Given Name */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("given_name")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Surname */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Surname
                                        </label>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("surname")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("email")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("phone_number")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("gender")}
                                            disabled={!isEditing}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("date_of_birth")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Nationality */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Nationality
                                        </label>
                                        <select
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("nationality")}
                                            disabled={!isEditing}
                                        >
                                            <option value="">Select Nationality</option>
                                            <option value="Bangladeshi">Bangladeshi</option>
                                            <option value="American">American</option>
                                            <option value="British">British</option>
                                            <option value="Canadian">Canadian</option>
                                            <option value="Australian">Australian</option>
                                            <option value="Indian">Indian</option>
                                            <option value="Chinese">Chinese</option>
                                        </select>
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("address")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Post Code */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Post Code
                                        </label>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("postcode")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Passport Number */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Passport Number
                                        </label>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("passport")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    {/* Date of Expire */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Passport Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            className={`border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            {...register("expire")}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                </div>

                                {/* File Uploads */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                                    {/* Passport Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Passport (Max 2MB)
                                        </label>
                                        <label
                                            htmlFor="passport-file"
                                            className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                                        >
                                            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition ${!isEditing
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-300 hover:border-blue-500 bg-white"
                                                }`}>
                                                <svg className={`w-10 h-10 mx-auto ${!isEditing ? "text-gray-300" : "text-gray-400"
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className={`font-medium mt-3 ${!isEditing ? "text-gray-400" : "text-gray-900"
                                                    }`}>
                                                    {passportFile?.[0]?.name || "Click to upload"}
                                                </p>
                                                <p className={`text-xs ${!isEditing ? "text-gray-300" : "text-gray-500"
                                                    }`}>PNG, JPG, PDF up to 2MB</p>
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            id="passport-file"
                                            className="hidden"
                                            accept=".png,.jpg,.jpeg,.pdf"
                                            {...register("passport_file", {
                                                validate: {
                                                    fileSize: (file) => {
                                                        if (file && file[0]) {
                                                            return file[0].size <= 2 * 1024 * 1024 || "File size must be less than 2MB";
                                                        }
                                                        return true;
                                                    },
                                                    fileType: (file) => {
                                                        if (file && file[0]) {
                                                            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
                                                            return allowedTypes.includes(file[0].type) || "Only PNG, JPG, PDF files are allowed";
                                                        }
                                                        return true;
                                                    }
                                                }
                                            })}
                                            disabled={!isEditing}
                                        />
                                        {errors.passport_file && (
                                            <p className="text-red-500 text-sm mt-1">{errors.passport_file.message}</p>
                                        )}
                                    </div>

                                    {/* Visa Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Visa (Max 2MB)
                                        </label>
                                        <label
                                            htmlFor="visa-file"
                                            className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                                        >
                                            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition ${!isEditing
                                                ? "border-gray-200 bg-gray-50"
                                                : "border-gray-300 hover:border-blue-500 bg-white"
                                                }`}>
                                                <svg className={`w-10 h-10 mx-auto ${!isEditing ? "text-gray-300" : "text-gray-400"
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className={`font-medium mt-3 ${!isEditing ? "text-gray-400" : "text-gray-900"
                                                    }`}>
                                                    {visaFile?.[0]?.name || "Click to upload"}
                                                </p>
                                                <p className={`text-xs ${!isEditing ? "text-gray-300" : "text-gray-500"
                                                    }`}>PNG, JPG, PDF up to 2MB</p>
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            id="visa-file"
                                            className="hidden"
                                            accept=".png,.jpg,.jpeg,.pdf"
                                            {...register("visa_file", {
                                                validate: {
                                                    fileSize: (file) => {
                                                        if (file && file[0]) {
                                                            return file[0].size <= 2 * 1024 * 1024 || "File size must be less than 2MB";
                                                        }
                                                        return true;
                                                    },
                                                    fileType: (file) => {
                                                        if (file && file[0]) {
                                                            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
                                                            return allowedTypes.includes(file[0].type) || "Only PNG, JPG, PDF files are allowed";
                                                        }
                                                        return true;
                                                    }
                                                }
                                            })}
                                            disabled={!isEditing}
                                        />
                                        {errors.visa_file && (
                                            <p className="text-red-500 text-sm mt-1">{errors.visa_file.message}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Buttons - Only show when editing */}
                                {isEditing && (
                                    <div className="flex justify-end gap-4 mt-10 border-t pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </button>
                                    </div>
                                )}

                            </form>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default EditForm;