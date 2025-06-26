"use client"

import React, { useState } from 'react';
import { useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useAuthStore } from '@/store/authStore';
import { updateUser } from '@/services/userService'
import { ProtectedRoute } from '@/components/protectedRoute'
import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/successMessage';
import Image from 'next/image'

export default function UserProfile() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const isInitialized = useAuthStore((s) => s.isInitialized);
    const userData = useAuthStore((s) => s.user);
    const userUpdate = useAuthStore((s) => s.userUpdate);
    const [newSkill, setNewSkill] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        specialization: "",
        year: 0,
        semester: 0,
        bio: " ",
        skills: [],
        github: "",
        linkedin: "",
        profilePicture: ""
    });

    useEffect(() => {
        if (isInitialized && userData) {
            setFormData({
                ...userData,
                bio: userData.bio || " ",
                github: userData.github || "",
                linkedin: userData.linkedin || "",
                profilePicture: userData.profilePicture || "",
                year: userData.year || 0,
                semester: userData.semester || 0,
            });
        }
        else {
            //loader
        }
    }, [userData, isInitialized]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSave = async () => {
        const response = await updateUser(formData);
        if (response.success) {
            userUpdate(response.data);
            setSuccess('Account updated successfully!');
        } else {
            if (response.status === 404) {
                console.log("404")
                setError("User not found!");
            } else {
                console.log(response.status)
                setError("Network Error! Try Again");
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            username: userData?.username || "",
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || "",
            email: userData?.email || "",
            specialization: userData?.specialization || "",
            year: userData?.year || 0,
            semester: userData?.semester || 0,
            bio: userData?.bio || "",
            skills: userData?.skills || [],
            github: userData?.github || "",
            linkedin: userData?.linkedin || "",
            profilePicture: userData?.profilePicture || ""
        });
        setIsEditing(false);
    };

    return (
        <ProtectedRoute requiredRole="MEMBER">
            <Header></Header>
            <ErrorMessage
                message={error}
                onClose={() => setError('')}
                autoClose={true}
            />
            <SuccessMessage
                message={success}
                onClose={() => setSuccess('')}
                autoClose={true}
            />
            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8 hover:shadow-2xl transition-all duration-500">
                        <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
                            <div className="absolute inset-0 bg-blue bg-opacity-20"></div>
                            <div className="absolute -bottom-20 left-8">
                                <div className="relative group">
                                    {formData.profilePicture ? (
                                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                                            {/* <Image
                                            src={formData.profilePicture}
                                            alt="Profile"
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
                                        /> */}
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-5xl font-medium">
                                                {formData?.firstName?.charAt(0)}{formData?.lastName?.charAt(0)}
                                            </span>
                                        </div>)}

                                    {isEditing && (
                                        <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                                <circle cx="12" cy="13" r="3" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="absolute top-6 right-6">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-gray-800 bg-opacity-10 backdrop-blur-lg text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 font-medium"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-500 bg-opacity-90 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-green-600 transition-all duration-200 flex items-center gap-2 font-medium"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                                <polyline points="17,21 17,13 7,13 7,21" />
                                                <polyline points="7,3 7,8 15,8" />
                                            </svg>
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-red-500 bg-opacity-90 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-200 flex items-center gap-2 font-medium"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-24 pb-8 px-8">
                            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    {isEditing ? (
                                        <div className="flex gap-4 mb-4">
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className="text-3xl font-bold text-slate-800 bg-transparent border-b-2 border-blue-300 focus:border-blue-600 outline-none transition-colors duration-200"
                                                placeholder="First Name"
                                            />
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="text-3xl font-bold text-slate-800 bg-transparent border-b-2 border-blue-300 focus:border-blue-600 outline-none transition-colors duration-200"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    ) : (
                                        <h1 className="text-4xl font-bold text-slate-800 mb-2">
                                            {formData.firstName} {formData.lastName}
                                        </h1>
                                    )}
                                    <p className="text-slate-600 font-medium mb-4">@{formData.username}</p>
                                    <div className="flex flex-wrap gap-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="bg-transparent border-b border-blue-300 focus:border-blue-600 outline-none transition-colors duration-200"
                                                />
                                            ) : (
                                                <span>{formData.email}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                                <path d="M2 3h6.386c.21 0 .41.084.558.232l2.024 2.025A1 1 0 0 0 11.525 6h8.475a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3z" />
                                                <path d="M8 21h8" />
                                                <path d="M12 17v4" />
                                            </svg>
                                            {isEditing ? (
                                                <select
                                                    value={formData.specialization}
                                                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                                                    className="bg-transparent border-b border-blue-300 focus:border-blue-600 outline-none transition-colors duration-200"
                                                >
                                                    <option value="Software Engineering">Software Engineering</option>
                                                    <option value="Data Science">Data Science</option>
                                                    <option value="Cyber Security">Cyber Security</option>
                                                    <option value="Information Technology">Information Technology</option>
                                                </select>
                                            ) : (
                                                <span>{formData.specialization}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <select
                                                        value={formData.year}
                                                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                                                        className="bg-transparent border-b border-blue-300 focus:border-blue-600 outline-none transition-colors duration-200"
                                                    >
                                                        <option value={1}>Year 1</option>
                                                        <option value={2}>Year 2</option>
                                                        <option value={3}>Year 3</option>
                                                        <option value={4}>Year 4</option>
                                                    </select>
                                                    <select
                                                        value={formData.semester}
                                                        onChange={(e) => handleInputChange('semester', parseInt(e.target.value))}
                                                        className="bg-transparent border-b border-blue-300 focus:border-blue-600 outline-none transition-colors duration-200"
                                                    >
                                                        <option value={1}>Semester 1</option>
                                                        <option value={2}>Semester 2</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <span>Year {formData.year}, Semester {formData.semester}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6 lg:mt-0">
                                    <a
                                        href={formData.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-800 text-white p-3 rounded-full hover:bg-slate-700 transition-all duration-200 hover:scale-110"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.37 0 0 5.37 0 12 0 17.31 3.435 21.795 8.205 23.385c.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={formData.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-200 hover:scale-110"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Bio Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">About Me</h2>
                                </div>

                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        rows={6}
                                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-slate-700"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-slate-700 leading-relaxed text-lg">{formData.bio}</p>
                                )}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div>
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <polyline points="16,18 22,12 16,6" />
                                            <polyline points="8,6 2,12 8,18" />
                                            <line x1="12" y1="2" x2="12" y2="22" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">Skills</h2>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-4">
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="relative group bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full font-medium border border-blue-200 hover:shadow-md transition-all duration-200"
                                        >
                                            {skill}
                                            {isEditing && (
                                                <button
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3,6 5,6 21,6" />
                                                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                    </svg>
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>

                                {isEditing && (
                                    <div className="flex gap-2 mt-4">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                            placeholder="Add new skill"
                                            className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Links Section */}
                    {isEditing && (
                        <div className="mt-8">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                            <rect x="2" y="9" width="4" height="12" />
                                            <circle cx="4" cy="4" r="2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">Social Links</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-2">GitHub Profile</label>
                                        <input
                                            type="url"
                                            value={formData.github}
                                            onChange={(e) => handleInputChange('github', e.target.value)}
                                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-2">LinkedIn Profile</label>
                                        <input
                                            type="url"
                                            value={formData.linkedin}
                                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer></Footer>
        </ProtectedRoute>
    );
}