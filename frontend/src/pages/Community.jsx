import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, ThumbsUp, Share2, Bell, Send } from 'lucide-react';
import { apiClient } from '../api/apiClient';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await apiClient.get('/community');
            setPosts(res);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const res = await apiClient.post('/community', { 
                author: "You", 
                text: newPost,
                isOfficial: false
            });
            setPosts([res, ...posts]);
            setNewPost("");
        } catch (error) {
            console.error("Failed to submit post:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-bg-light">
            {/* Hero Section */}
            <section className="bg-primary text-white py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Hub</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        Connect with other homeowners, share experiences, and get the latest updates.
                    </p>
                </div>
            </section>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Create Post */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Share your thoughts or ask a question..."
                                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none resize-none h-24"
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
                                >
                                    <Send size={18} /> Post
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Posts List */}
                    {posts.map((post) => (
                        <div key={post.id} className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${post.isOfficial ? 'border-primary' : 'border-transparent'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${post.isOfficial ? 'bg-primary' : 'bg-gray-400'}`}>
                                        {post.author[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                            {post.author}
                                            {post.isOfficial && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Official</span>}
                                        </h4>
                                        <span className="text-xs text-gray-500">{post.date}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {post.text}
                            </p>
                            <div className="flex items-center gap-6 text-gray-500 text-sm border-t pt-4">
                                <button className="flex items-center gap-2 hover:text-accent transition-colors">
                                    <ThumbsUp size={18} /> {post.likes} Likes
                                </button>
                                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <MessageSquare size={18} /> {post.comments} Comments
                                </button>
                                <button className="flex items-center gap-2 hover:text-gray-700 transition-colors ml-auto">
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Announcements */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                            <Bell size={20} /> Announcements
                        </h3>
                        <ul className="space-y-4">
                            <li className="text-sm text-gray-600 pb-2 border-b">
                                <span className="font-bold block text-gray-800">New Office Opening</span>
                                We are expanding to a new location in downtown!
                            </li>
                            <li className="text-sm text-gray-600 pb-2 border-b">
                                <span className="font-bold block text-gray-800">Summer Renovation Sale</span>
                                Get 10% off on all kitchen remodeling projects this July.
                            </li>
                        </ul>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                            <Users size={20} /> Top Contributors
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">JD</div>
                                <span className="text-sm font-medium text-gray-700">Jane Doe</span>
                                <span className="ml-auto text-xs text-gray-400">15 posts</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">RK</div>
                                <span className="text-sm font-medium text-gray-700">Rajesh K.</span>
                                <span className="ml-auto text-xs text-gray-400">12 posts</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
