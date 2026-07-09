import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Plus, Clock, FileText } from 'lucide-react';
import { getClientQuotes } from '../api/quoteApi';
import { getProfile, updateProfile } from '../api/authApi';


const ClientDashboard = () => {
    const navigate = useNavigate();

    // State for user
    const [user] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Error parsing user in ClientDashboard:", e);
            return null;
        }
    });

    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', phone: '', address: '', profilePhotoUrl: '' });


    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [quotesData, profileData] = await Promise.all([
                    getClientQuotes(),
                    getProfile()
                ]);
                setProjects(quotesData);
                setProfile(profileData.data);
                setEditFormData({
                    name: profileData.data.name || '',
                    phone: profileData.data.phone || '',
                    address: profileData.data.address || '',
                    profilePhotoUrl: profileData.data.profilePhotoUrl || ''
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('user-state-change'));
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white p-8 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-6 border-l-8 border-accent">
                    <div className="flex items-center gap-6">
                        <div className="bg-orange-100 p-4 rounded-full text-accent">
                            <User size={40} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary">Welcome, {profile?.name || user.email?.split('@')[0] || 'User'}!</h1>
                            <p className="text-gray-500">Client Dashboard • Manage your dream projects</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-100"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Saved Projects Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                    <FileText className="text-accent" size={22} /> My Projects
                                </h2>
                                <button 
                                    onClick={() => navigate('/contractors/search')}
                                    className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-bold shadow-sm">
                                    <Plus size={18} /> Request New Quote
                                </button>
                            </div>
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-primary font-bold">
                                                {project.projectType ? project.projectType.charAt(0) : 'P'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{project.projectType}</h3>
                                                <p className="text-sm text-gray-500">Submitted: {new Date(project.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary">{project.budget || 'TBD'}</div>
                                            <div className="text-xs bg-orange-100 text-accent px-2 py-1 rounded inline-block font-bold">
                                                {project.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Inquiries */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                                <Clock className="text-accent" size={22} /> Inquiry History
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center opacity-60">
                                    <span>Support Inquiry #402 - "Pricing for hillside site"</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-primary">Profile Info</h2>
                                <button onClick={() => setIsEditingProfile(true)} className="text-sm text-accent hover:underline">Edit</button>
                            </div>
                            <div className="space-y-3">
                                {profile?.profilePhotoUrl && (
                                    <div className="flex justify-center mb-4">
                                        <img src={profile.profilePhotoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100" />
                                    </div>
                                )}
                                <div className="flex justify-between border-b pb-2 text-sm">
                                    <span className="text-gray-500 font-medium">Name:</span>
                                    <span className="text-gray-800">{profile?.name || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 text-sm">
                                    <span className="text-gray-500 font-medium">Email:</span>
                                    <span className="text-gray-800">{user.email}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 text-sm">
                                    <span className="text-gray-500 font-medium">Phone:</span>
                                    <span className="text-gray-800">{profile?.phone || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 text-sm">
                                    <span className="text-gray-500 font-medium">Address:</span>
                                    <span className="text-gray-800">{profile?.address || 'Not set'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold mb-2">Need Help?</h3>
                                <p className="text-sm opacity-80 mb-4">Our engineers are available for direct consultations.</p>
                                <button className="w-full bg-white text-primary py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                    Chat with Builder
                                </button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 bg-accent w-20 h-20 rounded-full opacity-20 transform translate-x-4 translate-y-4"></div>
                        </div>
                    </div>
                </div>
            </div>
            {isEditingProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-primary mb-6">Edit Profile</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await updateProfile(editFormData);
                                setProfile({ ...profile, ...editFormData });
                                setIsEditingProfile(false);
                            } catch (err) {
                                console.error("Failed to update profile", err);
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2 border rounded-md focus:ring-accent focus:border-accent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-md focus:ring-accent focus:border-accent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full px-4 py-2 border rounded-md focus:ring-accent focus:border-accent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL</label>
                                <input type="text" value={editFormData.profilePhotoUrl} onChange={(e) => setEditFormData({...editFormData, profilePhotoUrl: e.target.value})} className="w-full px-4 py-2 border rounded-md focus:ring-accent focus:border-accent" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-accent rounded-md hover:bg-orange-600">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
