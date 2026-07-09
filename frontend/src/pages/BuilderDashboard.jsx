import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Plus, Users, Layout, Briefcase } from 'lucide-react';
import { getContractorQuotes } from '../api/quoteApi';
import { projectApi } from '../api/projectApi';
import { getProfile, updateProfile } from '../api/authApi';

const BuilderDashboard = () => {
    const navigate = useNavigate();

    // Initialize state from localStorage to prevent blank flicker
    const [user] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Error parsing user in BuilderDashboard:", e);
            return null;
        }
    });

    // State for leads and projects
    const [leads, setLeads] = useState([]);
    const [projects, setProjects] = useState([]);
    const [profile, setProfile] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', phone: '', address: '', profilePhotoUrl: '' });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'builder') {
            navigate('/');
        } else {
            const fetchData = async () => {
                try {
                    const quotesData = await getContractorQuotes();
                    setLeads(quotesData);
                } catch (err) {
                    console.error('Failed to fetch leads', err);
                }
                try {
                    // For now, fetch all projects. Ideally we'd fetch only the builder's projects.
                    const projData = await projectApi.getAll();
                    setProjects(projData);
                } catch (err) {
                    console.error('Failed to fetch projects', err);
                }
                try {
                    const profileData = await getProfile();
                    setProfile(profileData.data);
                    setEditFormData({
                        name: profileData.data.name || '',
                        phone: profileData.data.phone || '',
                        address: profileData.data.address || '',
                        profilePhotoUrl: profileData.data.profilePhotoUrl || ''
                    });
                } catch (err) {
                    console.error('Failed to fetch profile', err);
                }
            };
            fetchData();
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('user-state-change'));
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-gray-100">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-accent">
                    <div className="flex items-center gap-6">
                        <div className="bg-orange-500/20 p-4 rounded-xl text-accent border border-accent/30">
                            <ShieldCheck size={40} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Builder Admin Portal</h1>
                            <p className="text-gray-400">Welcome back, {profile?.name || user.email?.split('@')[0] || 'Builder'} • System Administrator Mode</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500/10 text-red-500 px-6 py-2 rounded-xl hover:bg-red-500/20 transition-all font-semibold border border-red-500/20 shadow-lg"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* STATS CARDS */}
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-accent/40 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">+12%</span>
                        </div>
                        <h3 className="text-gray-400 font-medium">Total Client Leads</h3>
                        <p className="text-3xl font-bold text-white mt-1">24</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-orange-500/40 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400 group-hover:bg-orange-500/30 transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded">Action Required</span>
                        </div>
                        <h3 className="text-gray-400 font-medium">New Quote Requests</h3>
                        <p className="text-3xl font-bold text-white mt-1">{leads.length}</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-emerald-500/40 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                                <Layout size={24} />
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Active</span>
                        </div>
                        <h3 className="text-gray-400 font-medium">Projects Under Construction</h3>
                        <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Management Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Briefcase className="text-accent" size={24} /> Project Tracking
                                </h2>
                                <button className="bg-accent text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg">
                                    <Plus size={20} /> Add New Project
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {projects.map(proj => (
                                    <div key={proj.id} className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold">{proj.name}</h4>
                                            <span className="text-xs text-gray-500">{proj.deadline}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                                            <div className="bg-accent h-2 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                            <span>{proj.location}</span>
                                            <span>{proj.progress}% Complete</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                            <h2 className="text-xl font-bold mb-6">Recent Customer Leads</h2>
                            <div className="space-y-4">
                                {leads.map((lead) => (
                                    <div key={lead.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex items-center justify-between hover:bg-gray-700/30 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-800 rounded-full border border-gray-600 flex items-center justify-center font-bold text-gray-400">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-200">{lead.name}</p>
                                                <p className="text-xs text-gray-500">{lead.projectType} • {lead.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-bold uppercase">{lead.status}</span>
                                            <button className="block text-accent text-xs font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">View Case →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Profile Info</h3>
                                <button onClick={() => setIsEditingProfile(true)} className="text-sm text-accent hover:underline">Edit</button>
                            </div>
                            <div className="space-y-3">
                                {profile?.profilePhotoUrl && (
                                    <div className="flex justify-center mb-4">
                                        <img src={profile.profilePhotoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-600" />
                                    </div>
                                )}
                                <div className="flex justify-between border-b border-gray-700 pb-2 text-sm">
                                    <span className="text-gray-400 font-medium">Name:</span>
                                    <span className="text-gray-200">{profile?.name || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2 text-sm">
                                    <span className="text-gray-400 font-medium">Email:</span>
                                    <span className="text-gray-200">{user.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2 text-sm">
                                    <span className="text-gray-400 font-medium">Phone:</span>
                                    <span className="text-gray-200">{profile?.phone || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between pb-2 text-sm">
                                    <span className="text-gray-400 font-medium">Address:</span>
                                    <span className="text-gray-200">{profile?.address || 'Not set'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 shadow-lg border-l-4 border-l-emerald-500">
                            <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                                <ShieldCheck size={20} /> Professional Verification
                            </h3>
                            <p className="text-xs text-emerald-300 opacity-80 leading-relaxed">
                                Your builder account is verified. You have access to upload brochures, modify project timelines, and respond to quote requests.
                            </p>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
                            <h3 className="font-bold mb-4">Quick Tools</h3>
                            <div className="space-y-2">
                                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors text-sm text-gray-400 hover:text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Download Lead List (CSV)
                                </button>
                                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors text-sm text-gray-400 hover:text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div> Update Project Status
                                </button>
                                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors text-sm text-gray-400 hover:text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div> Settings & Permissions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {isEditingProfile && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
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
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-accent focus:border-accent text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-accent focus:border-accent text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                <input type="text" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-accent focus:border-accent text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Profile Photo URL</label>
                                <input type="text" value={editFormData.profilePhotoUrl} onChange={(e) => setEditFormData({...editFormData, profilePhotoUrl: e.target.value})} className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:ring-accent focus:border-accent text-white" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-5 py-2 text-gray-400 bg-gray-900 rounded-xl hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-5 py-2 text-white bg-accent rounded-xl hover:bg-orange-600 font-bold">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuilderDashboard;
