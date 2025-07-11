'use client';

import { useParams } from 'next/navigation';
import { getProjectById, updateProject } from '@/services/projectService';
import { sendJoinRequest, getJoinRequests, handleJoinRequest, leaveProject } from '@/services/joinRequestService';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protectedRoute';
import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/successMessage';
import { useAuthStore } from '@/store/authStore';
import LeaveProjectModal from '@/components/confirmleveModel';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Project() {

    const frontendTechs = ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js'];
    const backendTechs = ['Java', 'Node.js', 'Python', 'Ruby', 'PHP', 'Golang'];

    const params = useParams();
    const id = params.id;
    const user = useAuthStore((s) => s.user);

    const [project, setProject] = useState({
        title: '',
        description: '',
        moduleCode: '',
        moduleName: '',
        frontendTechnology: '',
        backendTechnology: '',
        maxMembers: 0,
        projectMembers: [],
        status: 'OPEN',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinMessage, setJoinMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        moduleCode: '',
        moduleName: '',
        frontendTechnology: '',
        backendTechnology: '',
        maxMembers: 0,
        status: 'OPEN',
    });
    const [joinRequests, setJoinRequests] = useState([]);
    const [isRequestLoading, setRequestIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [removeMemberId, setRemoveMemberId] = useState(null);

    //done
    const currentUser = {
        userId: user?.id || 0,
    };

    //done
    useEffect(() => {
        const getProject = async () => {
            try {
                const project = await getProjectById(id);
                if (project.success) {
                    setProject(project.data);
                } else {
                    setError('Error fetching project data: ' + project.message);
                }
            } catch (err) {
                setError('Error fetching project data: ' + (err.message || 'Unknown error'));
            } finally {
                // add loader
            }
        };

        if (id) {
            getProject();
        }
    }, [id]);

    //done
    const handleOpenJoinModal = () => {
        setShowJoinModal(true);
        setJoinMessage('I would like to join your project.');
    };

    //done
    const handleCloseJoinModal = () => {
        setShowJoinModal(false);
        setJoinMessage('');
    };

    //done
    const handleSendJoinRequest = async () => {
        if (!joinMessage.trim()) {
            setError('Please enter a message before sending the join request.');
            return;
        }

        try {
            const requestData = {
                projectId: parseInt(id),
                userId: currentUser.userId,
                message: joinMessage.trim(),
                status: "PENDING"
            };

            const response = await sendJoinRequest(requestData);
            if (!response.success) {
                setError('Error sending join request: ' + response.message);
                return;
            }

            handleCloseJoinModal();
            setSuccess('Join request sent successfully!');
        } catch (err) {
            setError('Error sending join request: ' + (err.message || 'Unknown error'));
        } finally {
            // add loader
            setJoinMessage('');
        }
    };

    //done
    const handleOpenEditModal = () => {
        setEditFormData({
            title: project.title,
            description: project.description,
            frontendTechnology: project.frontendTechnology || '',
            backendTechnology: project.backendTechnology || '',
            maxMembers: project.maxMembers,
            moduleCode: project.moduleCode || '',
            moduleName: project.moduleName || '',
            status: project.status || 'OPEN',
        });
        setShowEditModal(true);
    };

    //done
    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    //done
    const handleUpdateProject = async () => {
        try {
            const project = await updateProject(id, currentUser.userId, editFormData);
            if (project.success) {
                setProject(project.data);
                setSuccess('Project updated successfully!');
            } else {
                setError('Error fetching project data: ' + project.message);
            }
        } catch (err) {
            setError('Error fetching project data: ' + (err.message || 'Unknown error'));
        } finally {
            // add loader
            handleCloseEditModal();
        }
    };

    //done
    const handleRemoveMember = async (memberId) => {
        try {
            const response = await leaveProject(id, memberId);
            if (!response.success) {
                setError('Failed to remove member: ' + response.message);
                return;
            }
            setSuccess('Member removed successfully!');
        } catch (error) {
            setError('Failed to remove member: ' + (error.message || 'Unknown error'));
        } finally {
            setProject(prevProject => ({
                ...prevProject,
                projectMembers: prevProject.projectMembers.filter(member => member.memberId !== memberId)
            }));
        }
    };

    const handleleaderRemoveMember = (memberId) => {
        setShowRemoveModal(true);
        setRemoveMemberId(memberId);
    }

    const handleConfirmRemoveMember = () => {
        handleRemoveMember(removeMemberId);
        setShowRemoveModal(false);
        setRemoveMemberId(null);
    }

    const handleLeaveProject = () => {
        setShowLeaveModal(true);
    };

    const handleConfirmLeave = () => {
        handleRemoveMember(currentUser.userId);
        setShowLeaveModal(false);
    };

    //all done under this function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMemberStatus = () => {
        if (!project) return '';
        const isFull = project.projectMembers.length >= project.maxMembers;
        return isFull ? 'text-red-600' : 'text-green-600';
    };

    const isProjectFull = () => {
        return project && project.projectMembers.length >= project.maxMembers;
    };

    const isUserAlreadyMember = () => {
        if (!project || !currentUser) return false;
        return project.projectMembers.some(member => member.memberId === currentUser.userId);
    };

    const getCurrentUserRole = () => {
        if (!project || !currentUser) return null;
        const member = project.projectMembers.find(member => member.memberId === currentUser.userId);
        return member ? member.role : null;
    };

    const isCurrentUserLeader = () => {
        return getCurrentUserRole() === 'LEADER';
    };


    // join requests related functions
    const loadRequests = async () => {
        setRequestIsLoading(true);
        try {
            const requests = await getJoinRequests(id);
            if (requests.success) {
                setJoinRequests(requests.data || []);
            }
            setHasLoaded(true);
        } catch (error) {
            console.error('Error loading requests:', error);
        } finally {
            setRequestIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'REJECTED':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'PENDING':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const handleApproveReject = async (requestId, status) => {
        try {
            const response = await handleJoinRequest(requestId, status);
            if (response.success) {
                setSuccess(`Join request ${status.toLowerCase()} successfully!`);
            } else {
                setError(`Failed to ${status.toLowerCase()} join request: ${response.message}`);
            }
        } catch (error) {
            setError(`Failed to ${status.toLowerCase()} join request: ${error.message || 'Unknown error'}`);
        } finally {
            setJoinRequests(prev =>
                prev.map(request =>
                    request.id === requestId
                        ? { ...request, status: status, respondedAt: new Date().toISOString() }
                        : request
                )
            );
        }
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
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Project Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                        {project.title}
                                    </h1>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-base font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                            {project.moduleCode}
                                        </span>
                                        <span className="text-base text-gray-600">{project.moduleName}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isCurrentUserLeader() && (
                                        <button
                                            onClick={handleOpenEditModal}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Project
                                        </button>
                                    )}
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${project.status === 'OPEN'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            {/* Project Description */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Technology Stack</h2>
                                <div className="flex flex-wrap gap-3">
                                    {project.frontendTechnology && (
                                        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                            <span className="font-medium">Frontend: {project.frontendTechnology}</span>
                                        </div>
                                    )}
                                    {project.backendTechnology && (
                                        <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                            </svg>
                                            <span className="font-medium">Backend: {project.backendTechnology}</span>
                                        </div>
                                    )}
                                    {!project.frontendTechnology && !project.backendTechnology && (
                                        <span className="text-gray-400 italic bg-gray-50 px-3 py-2 rounded-lg">
                                            Tech stack not specified
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Project Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">👥</span>
                                        <h3 className="font-semibold text-gray-900">Team Size</h3>
                                    </div>
                                    <p className={`text-2xl font-bold ${getMemberStatus()}`}>
                                        {project.projectMembers.length}/{project.maxMembers}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {isProjectFull() ? 'Team is full' : `${project.maxMembers - project.projectMembers.length} spots remaining`}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="font-semibold text-gray-900">Created</h3>
                                    </div>
                                    <p className="text-lg font-medium text-gray-700">
                                        {formatDate(project.createdAt)}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="font-semibold text-gray-900">Status</h3>
                                    </div>
                                    <p className="text-lg font-medium text-gray-700">
                                        {project.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.projectMembers.map((member, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-semibold">
                                                {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {member.firstName} {member.lastName}
                                            </h3>
                                            <p className={`text-sm font-medium ${member.role === 'LEADER'
                                                ? 'text-indigo-600'
                                                : 'text-gray-600'
                                                }`}>
                                                {member.role === 'LEADER' ? '👑 Project Leader' : 'Team Member'}
                                            </p>
                                        </div>
                                        {isCurrentUserLeader() && member.role !== 'LEADER' && (
                                            <button
                                                onClick={() => handleleaderRemoveMember(member.memberId)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                title="Remove member"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Join Project Button */}
                    {project.status === 'OPEN' && !isUserAlreadyMember() && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-8 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Ready to Join This Project?
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Collaborate with talented students and work on exciting projects together.
                                </p>
                                <button
                                    onClick={handleOpenJoinModal}
                                    disabled={isProjectFull()}
                                    className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${isProjectFull()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isProjectFull() ? 'Project Full' : 'Join Project'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isCurrentUserLeader() && (
                        <div className="mx-auto pb-8 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-8 text-center border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Join Requests
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Manage collaboration requests from interested students
                                    </p>
                                    <button
                                        onClick={loadRequests}
                                        disabled={isRequestLoading}
                                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto ${isRequestLoading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                            }`}
                                    >
                                        <svg className={`w-4 h-4 ${isRequestLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        {isRequestLoading ? 'Loading...' : hasLoaded ? 'Refresh Requests' : 'View Requests'}
                                    </button>
                                </div>

                                <div className="p-6">
                                    {hasLoaded && joinRequests.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Join Requests</h3>
                                            <p className="text-gray-600">No students have requested to join this project yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {joinRequests.map((request) => (
                                                <div
                                                    key={request.id}
                                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                        {/* Left: User Info and Message */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">
                                                                        User #{request.userId}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500">
                                                                        Request #{request.id}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                                <p className="text-gray-700 leading-relaxed">
                                                                    {request.message}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-sm text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <span>Requested: {formatDate(request.createdAt)}</span>
                                                                </div>
                                                                {request.respondedAt && (
                                                                    <div className="flex items-center gap-1">
                                                                        <span>Responded: {formatDate(request.respondedAt)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right: Actions and Status */}
                                                        <div className="flex flex-col sm:flex-row items-end gap-2 sm:gap-3 mt-4 md:mt-0">
                                                            {request.status === 'PENDING' && (
                                                                <div className="flex flex-row gap-2 w-full sm:w-auto">
                                                                    <button
                                                                        onClick={() => handleApproveReject(request.id, 'APPROVED')}
                                                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleApproveReject(request.id, 'REJECTED')}
                                                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                                                                {getStatusIcon(request.status)}
                                                                <span className="capitalize">{request.status.toLowerCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {isUserAlreadyMember() && (
                        <div className="bg-green-50 rounded-xl border border-green-200">
                            <div className="p-8 text-center">
                                <div className="text-green-600 mb-4">
                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-green-900 mb-2">
                                    You&apos;re Already a Member!
                                </h2>
                                <p className="text-green-700">
                                    You&apos;re part of this amazing project team.
                                </p>
                                {!isCurrentUserLeader() && (
                                    <button
                                        onClick={handleLeaveProject}
                                        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                                        Leave Project
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Edit Project Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
                                        <button
                                            onClick={handleCloseEditModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Project Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Project Title
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.title}
                                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {/* Project Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={editFormData.description}
                                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            />
                                        </div>

                                        {/* Module Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Module Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editFormData.moduleCode}
                                                    onChange={(e) => setEditFormData({ ...editFormData, moduleCode: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="e.g., IT2030, SE3020"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Format: ITxxxx, SExxxx, etc.</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Module Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editFormData.moduleName}
                                                    onChange={(e) => setEditFormData({ ...editFormData, moduleName: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="e.g., Software Engineering"
                                                />
                                            </div>
                                        </div>

                                        {/* Technology Stack */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Frontend Technology
                                                </label>
                                                <select
                                                    value={editFormData.frontendTechnology}
                                                    onChange={(e) => setEditFormData({ ...editFormData, frontendTechnology: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Select Frontend Technology</option>
                                                    {frontendTechs.map((tech) => (
                                                        <option key={tech} value={tech}>
                                                            {tech}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Backend Technology
                                                </label>
                                                <select
                                                    value={editFormData.backendTechnology}
                                                    onChange={(e) => setEditFormData({ ...editFormData, backendTechnology: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Select Backend Technology</option>
                                                    {backendTechs.map((tech) => (
                                                        <option key={tech} value={tech}>
                                                            {tech}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Status and Max Members */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Status
                                                </label>
                                                <select
                                                    value={editFormData.status}
                                                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="OPEN">OPEN</option>
                                                    <option value="CLOSED">CLOSED</option>
                                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Maximum Members
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={editFormData.maxMembers}
                                                    onChange={(e) => setEditFormData({ ...editFormData, maxMembers: parseInt(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={handleCloseEditModal}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateProject}
                                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Update Project
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showJoinModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Join Project Request</h2>
                                        <button
                                            onClick={handleCloseJoinModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Message<span className='text-red-600 text-xl'>*</span>
                                            </label>
                                            <textarea
                                                value={joinMessage}
                                                required
                                                onChange={(e) => setJoinMessage(e.target.value)}
                                                rows={6}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                placeholder="Tell the project owner why you'd like to join this project..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Explain your skills, experience, and what you can contribute to the project.</p>
                                        </div>
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={handleCloseJoinModal}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendJoinRequest}
                                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Leave Project Confirmation Modal */}
                    {showLeaveModal && (
                        <LeaveProjectModal
                            projectTitle={project.title}
                            onCancel={() => setShowLeaveModal(false)}
                            onConfirm={handleConfirmLeave}
                            header="Leave Project?"
                            isLeave={true}
                        ></LeaveProjectModal>
                    )}
                    {/* Remove Member Confirmation Modal */}
                    {showRemoveModal && (
                        <LeaveProjectModal
                            projectTitle={project.title}
                            onCancel={() => setShowRemoveModal(false)}
                            onConfirm={handleConfirmRemoveMember}
                            header="Remove Member?"
                            isLeave={false}
                        ></LeaveProjectModal>
                    )}

                </div>
            </div>
            <Footer></Footer>
        </ProtectedRoute>
    );
}
