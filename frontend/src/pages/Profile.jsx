import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileDetails } from "../redux/authSlice";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaCalendarAlt, FaClock, FaMoneyBillWave, FaSave, FaCamera, FaVenusMars } from "react-icons/fa";

const Profile = () => {
    const { user: currentUser } = useSelector((state) => state.auth);

    // Detailed Profile State
    const [profile, setProfile] = useState({
        fullName: currentUser?.fullName || currentUser?.username || "",
        email: currentUser?.email || "",
        mobile: currentUser?.mobile || "",
        dob: currentUser?.dob || "",
        gender: currentUser?.gender || "Can't say",
        city: currentUser?.city || "",
        language: currentUser?.language || "English",
        currency: currentUser?.currency || "INR",
        timezone: currentUser?.timezone || "Asia/Kolkata",
        photoBase64: currentUser?.photoBase64 || null
    });

    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = React.useRef(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File is too large. Please upload an image smaller than 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, photoBase64: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        dispatch(updateProfileDetails(profile))
            .unwrap()
            .then(() => {
                setIsEditing(false);
                alert("Profile updated successfully!");
            })
            .catch((err) => {
                alert("Failed to update profile: " + err);
            });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile & Settings</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6 text-center">
                        <div className="relative mx-auto h-32 w-32 mb-4">
                            <div className="h-full w-full rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold overflow-hidden border-4 border-white shadow-md">
                                {profile.photoBase64 ? (
                                    <img src={profile.photoBase64} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    profile.fullName[0].toUpperCase()
                                )}
                            </div>
                            {isEditing && (
                                <>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handlePhotoUpload} 
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-500"
                                    >
                                        <FaCamera className="text-sm" />
                                    </button>
                                </>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {profile.city && (
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                    {profile.city}
                                </span>
                            )}
                            {profile.currency && (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                    {profile.currency}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                {isEditing ? "Cancel" : "Edit Details"}
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <FaUser />
                                        </div>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <FaEnvelope />
                                        </div>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <FaPhone />
                                        </div>
                                        <input
                                            type="tel"
                                            disabled={!isEditing}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                            value={profile.mobile}
                                            onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* DOB */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <FaCalendarAlt />
                                        </div>
                                        <input
                                            type="date"
                                            disabled={!isEditing}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                            value={profile.dob}
                                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <FaVenusMars />
                                        </div>
                                        <select
                                            disabled={!isEditing}
                                            className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                            value={profile.gender}
                                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                {/* City / Country */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City / Country</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                            value={profile.city}
                                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preferences Section */}
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <FaGlobe />
                                            </div>
                                            <select
                                                disabled={!isEditing}
                                                className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                                value={profile.language}
                                                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                                            >
                                                <option value="English">English</option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Currency */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <FaMoneyBillWave />
                                            </div>
                                            <select
                                                disabled={!isEditing}
                                                className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                                value={profile.currency}
                                                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                                            >
                                                <option value="INR">INR (₹)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Time Zone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <FaClock />
                                            </div>
                                            <select
                                                disabled={!isEditing}
                                                className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-60"
                                                value={profile.timezone}
                                                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                            >
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="America/New_York">America/New_York (EST)</option>
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="UTC">UTC</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
                                    >
                                        <FaSave /> Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
