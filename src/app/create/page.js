"use client";

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ProtectedRoute } from '@/components/protectedRoute';
import techStack from '@/data/techStack.json';
import { useAuthStore } from '@/store/authStore';
import { createNewProject } from '@/services/projectService';
import { useRouter } from 'next/navigation';

export default function createProject() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const user = useAuthStore((s) => s.user);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        moduleCode: '',
        moduleName: '',
        creatorId: '',
        frontendTechnology: '',
        backendTechnology: '',
        maxMembers: '',
        status: 'OPEN'
    });

    const router = useRouter();
    var response = null;

    // Dropdown data mappings
    const moduleCodeOptions = techStack.modules;
    const frontendOptions = techStack.frontend;
    const backendOptions = techStack.backend;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate required fields
        if (!formData.title || !formData.description || !formData.moduleCode ||
            !formData.moduleName || !formData.frontendTechnology ||
            !formData.backendTechnology || !formData.maxMembers) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            // Convert maxMembers to number and add creatorId from state
            const projectData = {
                ...formData,
                creatorId: user.id,
                maxMembers: parseInt(formData.maxMembers)
            };

            response = await createNewProject(projectData);
            if (!response.success) {
                setError(response.message || 'Failed to create project');
                setLoading(false);
                return;
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                moduleCode: '',
                moduleName: '',
                frontendTechnology: '',
                backendTechnology: '',
                maxMembers: '',
                status: 'OPEN'
            });

            // Redirect to the newly created project page
            router.push('/project/' + response.data.id);

        } catch (error) {
            console.error('Error creating project:', error);
            setError('Error creating project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute requiredRole="MEMBER">
            <Header />
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-gray-100">
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Project</h1>
                            <p className="text-gray-500">Start your innovative project journey</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                                <p className="text-red-600 text-sm flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Project Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Title *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="pl-9 w-full py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your project title"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full py-2.5 px-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Describe your project in detail..."
                                    required
                                />
                            </div>

                            {/* Module Name and Code Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Module Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="moduleName"
                                            name="moduleName"
                                            value={formData.moduleName}
                                            onChange={handleInputChange}
                                            className="pl-9 w-full py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g., ITP"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="moduleCode" className="block text-sm font-medium text-gray-700 mb-1">
                                        Module Code *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <select
                                            id="moduleCode"
                                            name="moduleCode"
                                            value={formData.moduleCode}
                                            onChange={handleInputChange}
                                            className="pl-9 w-full py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Select Module Code</option>
                                            {moduleCodeOptions.map((code) => (
                                                <option key={code} value={code}>
                                                    {code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Technology Stack Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="frontendTechnology" className="block text-sm font-medium text-gray-700 mb-1">
                                        Frontend Technology *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <select
                                            id="frontendTechnology"
                                            name="frontendTechnology"
                                            value={formData.frontendTechnology}
                                            onChange={handleInputChange}
                                            className="pl-9 w-full py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Select Frontend Stack</option>
                                            {frontendOptions.map((tech) => (
                                                <option key={tech} value={tech}>
                                                    {tech}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="backendTechnology" className="block text-sm font-medium text-gray-700 mb-1">
                                        Backend Technology *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <select
                                            id="backendTechnology"
                                            name="backendTechnology"
                                            value={formData.backendTechnology}
                                            onChange={handleInputChange}
                                            className="pl-9 w-full py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Select Backend Stack</option>
                                            {backendOptions.map((tech) => (
                                                <option key={tech} value={tech}>
                                                    {tech}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Max Members and Status Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Members *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="number"
                                            id="maxMembers"
                                            name="maxMembers"
                                            value={formData.maxMembers}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="20"
                                            className="pl-9 w-full py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g., 8"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            className="pl-9 w-full py-2.5 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed outline-none"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Project...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Create Project
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </ProtectedRoute>
    );
}