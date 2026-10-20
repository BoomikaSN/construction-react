import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Briefcase, ShieldCheck, ArrowLeft, Heart, Send } from 'lucide-react';
import { getContractor, saveContractor, unsaveContractor } from '../api/contractorApi';
import { getContractorProjects } from '../api/projectApi';
import { getContractorReviews, submitReview } from '../api/reviewApi';
import { submitQuote } from '../api/quoteApi';


const ContractorDetail = () => {
    const { id } = useParams();
    const [contractor, setContractor] = useState(null);
    const [projects, setProjects] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const user = (() => {
        try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
    })();

    // Quote form state
    const [quoteData, setQuoteData] = useState({ name: '', email: user?.email || '', projectType: 'Residential', message: '' });
    const [quoteStatus, setQuoteStatus] = useState('idle');

    // Review form state
    const [reviewData, setReviewData] = useState({ rating: 5, text: '' });
    const [reviewStatus, setReviewStatus] = useState('idle');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const [contractorData, projectsData, reviewsData] = await Promise.all([
                    getContractor(id),
                    getContractorProjects(id),
                    getContractorReviews(id),
                ]);
                setContractor(contractorData.data ? contractorData.data : contractorData);
                setProjects(Array.isArray(projectsData?.data) ? projectsData.data : (Array.isArray(projectsData) ? projectsData : []));
                setReviews(Array.isArray(reviewsData?.data) ? reviewsData.data : (Array.isArray(reviewsData) ? reviewsData : []));
            } catch (err) {
                console.error('Failed to fetch contractor details:', err);
                setError('Unable to load contractor details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSaveToggle = async () => {
        try {
            if (saved) {
                await unsaveContractor(id);
                setSaved(false);
            } else {
                await saveContractor(id);
                setSaved(true);
            }
        } catch (err) {
            console.error('Failed to save/unsave contractor:', err);
        }
    };

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();
        setQuoteStatus('sending');
        try {
            await submitQuote({ contractorId: id, ...quoteData });
            setQuoteStatus('success');
            setQuoteData({ name: '', email: '', projectType: 'Residential', message: '' });
        } catch (err) {
            console.error('Failed to submit quote:', err);
            setQuoteStatus('error');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewStatus('sending');
        try {
            const payload = { ...reviewData, author: user?.name || user?.email?.split('@')[0] || 'Anonymous' };
            const newReview = await submitReview(id, payload);
            setReviews(prev => [newReview || { ...payload, id: Date.now(), date: 'Just now' }, ...prev]);
            setReviewStatus('success');
            setReviewData({ rating: 5, text: '' });
        } catch (err) {
            console.error('Failed to submit review:', err);
            setReviewStatus('error');
        }
    };

    const renderStars = (rating, interactive = false, onChange) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={interactive ? 24 : 16}
                className={`${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer' : ''}`}
                onClick={interactive ? () => onChange(i + 1) : undefined}
            />
        ));
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!contractor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Contractor Not Found</h1>
                <p className="text-gray-600 mb-6">The contractor you are looking for does not exist or an error occurred.</p>
                <Link to="/contractors/search" className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                    Back to Search
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header Section */}
            <section className="bg-primary text-white py-12">
                <div className="container mx-auto px-4">
                    <Link to="/contractors/search" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={18} /> Back to Search
                    </Link>

                    {error && (
                        <div className="bg-yellow-400/20 text-white p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                            {contractor?.name?.charAt(0) || 'C'}
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold">{contractor?.name}</h1>
                                {contractor?.verified && (
                                    <span className="flex items-center gap-1 bg-green-400/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                                        <ShieldCheck size={16} /> Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-lg opacity-90 mb-2">{contractor?.specialization}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
                                <span className="flex items-center gap-1">
                                    {renderStars(contractor?.rating || 0)}
                                    <span className="ml-1">{contractor?.rating}</span>
                                </span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> {contractor?.city}</span>
                                <span className="flex items-center gap-1"><Briefcase size={14} /> {contractor?.yearsExperience} years experience</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {user && (
                                <button
                                    onClick={handleSaveToggle}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-colors border ${saved ? 'bg-white text-primary border-white' : 'bg-transparent text-white border-white/50 hover:bg-white/10'}`}
                                >
                                    <Heart size={18} className={saved ? 'fill-red-500 text-red-500' : ''} /> {saved ? 'Saved' : 'Save'}
                                </button>
                            )}
                            <button
                                onClick={() => setShowQuoteForm(true)}
                                className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Request Quote
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-gray-50 flex-grow">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Bio */}
                            {contractor?.bio && (
                                <div className="bg-white p-6 rounded-xl shadow-md">
                                    <h2 className="text-xl font-bold text-primary mb-4">About</h2>
                                    <p className="text-gray-700 leading-relaxed">{contractor.bio}</p>
                                </div>
                            )}

                            {/* Portfolio */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-bold text-primary mb-4">Portfolio</h2>
                                {projects.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">No projects to display yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {projects.map((project) => (
                                            <div key={project.id} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                                {project.image && (
                                                    <img src={project.image} alt={project.name || project.title} className="w-full h-48 object-cover" />
                                                )}
                                                <div className="p-4">
                                                    <h3 className="font-bold text-primary">{project.name || project.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                                                    {project.category && (
                                                        <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{project.category}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reviews */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-primary">Reviews ({reviews.length})</h2>
                                    {user && user.role === 'client' && (
                                        <button
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="text-sm bg-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                                        >
                                            Write Review
                                        </button>
                                    )}
                                </div>

                                {/* Review Form */}
                                {showReviewForm && (
                                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                                        {reviewStatus === 'success' ? (
                                            <div className="text-green-600 text-center py-4 font-medium">
                                                Review submitted successfully!
                                                <button onClick={() => { setShowReviewForm(false); setReviewStatus('idle'); }} className="block mt-2 text-primary text-sm hover:underline mx-auto">Close</button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                                    <div className="flex gap-1">
                                                        {renderStars(reviewData.rating, true, (r) => setReviewData({ ...reviewData, rating: r }))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                                                    <textarea
                                                        value={reviewData.text}
                                                        onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                                                        required
                                                        rows="3"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none resize-none"
                                                        placeholder="Share your experience..."
                                                    />
                                                </div>
                                                {reviewStatus === 'error' && <p className="text-red-500 text-sm">Failed to submit review. Please try again.</p>}
                                                <button
                                                    type="submit"
                                                    disabled={reviewStatus === 'sending'}
                                                    className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                                                >
                                                    {reviewStatus === 'sending' ? 'Submitting...' : 'Submit Review'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {/* Reviews List */}
                                {reviews.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="p-4 border rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm text-gray-600">
                                                            {review.author?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="font-bold text-gray-800">{review.author}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{review.date}</span>
                                                </div>
                                                <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
                                                <p className="text-gray-600 text-sm">{review.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Contact Card */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="font-bold text-lg text-primary mb-4">Quick Contact</h3>
                                <button
                                    onClick={() => setShowQuoteForm(true)}
                                    className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send size={18} /> Request Quote
                                </button>
                            </div>

                            {/* Stats Card */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="font-bold text-lg text-primary mb-4">Statistics</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Rating</span>
                                        <span className="font-bold text-gray-800">{contractor?.rating || 'N/A'} / 5.0</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Projects</span>
                                        <span className="font-bold text-gray-800">{projects.length}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Reviews</span>
                                        <span className="font-bold text-gray-800">{reviews.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Experience</span>
                                        <span className="font-bold text-gray-800">{contractor?.yearsExperience || 'N/A'} years</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Request Modal */}
            {showQuoteForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
                        <button
                            onClick={() => { setShowQuoteForm(false); setQuoteStatus('idle'); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold text-primary mb-6">Request a Quote</h2>

                        {quoteStatus === 'success' ? (
                            <div className="text-center py-8">
                                <div className="text-green-500 text-5xl mb-4">✓</div>
                                <h3 className="text-xl font-bold text-primary mb-2">Quote Request Sent!</h3>
                                <p className="text-gray-500">The contractor will respond shortly.</p>
                                <button
                                    onClick={() => { setShowQuoteForm(false); setQuoteStatus('idle'); }}
                                    className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        value={quoteData.name}
                                        onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={quoteData.email}
                                        onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                                    <select
                                        value={quoteData.projectType}
                                        onChange={(e) => setQuoteData({ ...quoteData, projectType: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
                                    >
                                        <option>Residential</option>
                                        <option>Commercial</option>
                                        <option>Renovation</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                                    <textarea
                                        value={quoteData.message}
                                        onChange={(e) => setQuoteData({ ...quoteData, message: e.target.value })}
                                        required
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none resize-none"
                                        placeholder="Describe your project requirements..."
                                    />
                                </div>
                                {quoteStatus === 'error' && <p className="text-red-500 text-sm">Failed to send quote request. Please try again.</p>}
                                <button
                                    type="submit"
                                    disabled={quoteStatus === 'sending'}
                                    className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                                >
                                    {quoteStatus === 'sending' ? 'Sending...' : 'Send Quote Request'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractorDetail;
