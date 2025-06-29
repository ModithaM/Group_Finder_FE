"use client";

import { useRouter } from 'next/navigation';

export default function ProjectCard({ project }) {

    const router = useRouter();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getMemberStatus = () => {
        const percentage = (project.currentMembers / project.maxMembers) * 100;
        if (percentage === 0) return 'text-gray-500';
        if (percentage < 50) return 'text-green-600';
        if (percentage < 80) return 'text-yellow-600';
        return 'text-red-600';
    };

    const viewProject = () => {
        router.push(`/project/${project.id}`);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-blue-300 group">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                            onClick={viewProject}>
                            {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {project.moduleCode}
                            </span>
                            <span className="text-sm text-gray-600">{project.moduleName}</span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'OPEN'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {project.status}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.frontendTechnology && (
                        <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                            <span className="text-xs">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </span>
                            {project.frontendTechnology}
                        </div>
                    )}
                    {project.backendTechnology && (
                        <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs">
                            <span className="text-xs">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                            </span>
                            {project.backendTechnology}
                        </div>
                    )}
                    {!project.frontendTechnology && !project.backendTechnology && (
                        <span className="text-xs text-gray-400 italic">Tech stack not specified</span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <span className="text-sm">👥</span>
                            <span className={getMemberStatus()}>
                                {project.currentMembers}/{project.maxMembers}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <span>{formatDate(project.createdAt)}</span>
                        </div>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Join Project
                    </button>
                </div>
            </div>
        </div>
    );
}