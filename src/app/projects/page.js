"use client";

import { ProtectedRoute } from '@/components/protectedRoute'
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProjectCard from '@/components/projectCard';
import { useState, useEffect } from 'react';
import { filterProjects } from '@/services/projectService';
import ErrorMessage from '@/components/ErrorMessage';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [isLast, setisLast] = useState(true);
    const [page, setPage] = useState(0);
    const [error, setError] = useState('');

    // Filter states
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedFrontend, setSelectedFrontend] = useState('');
    const [selectedBackend, setSelectedBackend] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const getProjects = async () => {
            try {
                const result = await filterProjects(selectedCourse, selectedFrontend, selectedBackend, page, 9);
                if (result.success) {
                    if (page === 0) {
                        setProjects(result.data.content);
                    } else {
                        // Subsequent pages - append projects
                        setProjects(prev => [...prev, ...result.data.content]);
                    }
                    setisLast(result.data.last);
                } else if (result.status === 400) {
                    setError(result.message || 'Bad request. Please check your filter parameters.');
                } else if (result.status === 500) {
                    setError('Internal server error. Please try again later.');
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
            } catch (error) {
                setError('Failed to fetch projects. Please check your network connection or try again later.');
            } finally {
                // add loader
            }
        }
        getProjects();
    }, [selectedCourse, selectedFrontend, selectedBackend, page]);

    const loadMoreProjects = async () => {
        if (!isLast) {
            setPage(prevPage => prevPage + 1);
        }
    }


    // Extract unique values for filters
    const courses = ['IT2030', 'IT2040', 'IT2050', 'IT2060', 'IT2070', 'IT2080'];
    const frontendTechs = ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js'];
    const backendTechs = ['Java', 'Node.js', 'Python', 'Ruby', 'PHP'];

    // Clear all filters
    const clearFilters = () => {
        setSelectedCourse('');
        setSelectedFrontend('');
        setSelectedBackend('');
    };

    // Count active filters
    const activeFiltersCount = [selectedCourse, selectedFrontend, selectedBackend]
        .filter(Boolean).length;

    return (
        <ProtectedRoute requiredRole="MEMBER">
            <Header></Header>
            <ErrorMessage
                message={error}
                onClose={() => setError('')}
                autoClose={true}
            />
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative"
                            >
                                <span className="text-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </span>
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Filter Options */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Course Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg> Course
                                        </label>
                                        <select
                                            value={selectedCourse}
                                            onChange={(e) => setSelectedCourse(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">All Courses</option>
                                            {courses.map(course => (
                                                <option key={course} value={course}>{course}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Frontend Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg> Frontend
                                        </label>
                                        <select
                                            value={selectedFrontend}
                                            onChange={(e) => setSelectedFrontend(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">All Frontend</option>
                                            {frontendTechs.map(tech => (
                                                <option key={tech} value={tech}>{tech}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Backend Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                            </svg> Backend
                                        </label>
                                        <select
                                            value={selectedBackend}
                                            onChange={(e) => setSelectedBackend(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">All Backend</option>
                                            {backendTechs.map(tech => (
                                                <option key={tech} value={tech}>{tech}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                {activeFiltersCount > 0 && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <span className="text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </span>
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-gray-600">
                            <span className="font-medium text-gray-900">{projects.length}</span> projects found
                        </div>
                        <div className="text-sm text-gray-500">
                            Page 1 of 1
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {projects && projects.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>) : (<div className="text-center text-gray-500 py-12">No projects Found</div>)}

                    {/* Load More / Pagination */}
                    {!isLast && (
                        <div onClick={loadMoreProjects} className="mt-12 flex justify-center">
                            <button className="bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg text-gray-700 font-medium transition-colors">
                                Load More Projects
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </ProtectedRoute>
    );
}