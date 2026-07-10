import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Gauge, Clock, User, Star, Search } from 'lucide-react';
import { getFeaturedContractors } from '../api/contractorApi';
import { getRecentReviews } from '../api/reviewApi';
import { submitQuote } from '../api/quoteApi';
import { projectApi } from '../api/projectApi';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [projects, setProjects] = useState([]);

    // Quote form state
    const [quoteForm, setQuoteForm] = useState({ name: '', email: '', details: '' });
    const [quoteStatus, setQuoteStatus] = useState('idle');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reviewsData = await getRecentReviews();
                if (Array.isArray(reviewsData) && reviewsData.length > 0) {
                    setReviews(reviewsData);
                }
            } catch (err) {
                console.error('Failed to fetch homepage reviews:', err);
            } finally {
                setLoadingReviews(false);
            }
            
            try {
                const data = await projectApi.getAll();
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch homepage projects:', err);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/contractors/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();
        if (!quoteForm.name || !quoteForm.email || !quoteForm.details) return;
        setQuoteStatus('sending');
        try {
            await submitQuote({ name: quoteForm.name, email: quoteForm.email, message: quoteForm.details, projectType: 'General' });
            setQuoteStatus('success');
            setQuoteForm({ name: '', email: '', details: '' });
        } catch (err) {
            console.error('Failed to submit quote:', err);
            // Fallback: navigate to contact page
            navigate('/contact');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="bg-cover bg-center h-[500px] flex items-center justify-center text-center text-white relative shadow-inner" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/projects/luxury.jpeg')" }}>
                <div className="container mx-auto px-4 z-10">
                    <h1 className="text-5xl font-bold mb-4 animate-fade-in text-white text-shadow">Building Your Vision, Brick by Brick.</h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">Professional, reliable construction services for homeowners and businesses. High quality work, guaranteed.</p>
                    <a href="/contact" className="bg-accent text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-lg inline-block">
                        START YOUR PROJECT & GET A FREE QUOTE
                    </a>
                </div>
            </section>

            {/* Trust Signals */}
            <section className="py-16 bg-bg-light">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="text-accent" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-primary">Certified & Verified</h3>
                            <p className="text-gray-600">Fully certified and insured, ensuring peace of mind for every project.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Gauge className="text-accent" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-primary">Fast Load Time</h3>
                            <p className="text-gray-600">Optimized platform for a seamless user experience.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock className="text-accent" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-primary">10+ Years Experience</h3>
                            <p className="text-gray-600">Proven track record of delivering high-quality residential and commercial construction.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {['Residential', 'Commercial', 'Renovation', 'Project Management'].map((service, idx) => (
                            <a key={idx} href="/services" className="block p-6 rounded-xl border hover:border-accent hover:shadow-lg transition-all group">
                                <h3 className="text-xl font-bold text-primary group-hover:text-accent mb-2">{service}</h3>
                                <p className="text-gray-600 text-sm">Expert solutions for your {service.toLowerCase()} needs.</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-4">Our Recent Work</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Highlighting completed projects that showcase our quality and expertise.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {projects.length > 0 ? projects.slice(0, 3).map((project, idx) => (
                            <div key={idx} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:-translate-y-2 bg-white">
                                <img src={project.image || "/projects/commercial.jpeg"} alt={project.name} className="w-full h-64 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-primary mb-2">{project.name}</h3>
                                    <p className="text-gray-600">{project.description}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-3 text-center text-gray-500 py-8">Loading projects...</div>
                        )}
                    </div>

                    <div className="text-center">
                        <a href="/projects" className="border-2 border-primary text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary hover:text-white transition-colors inline-block">
                            View Full Portfolio
                        </a>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-bg-light">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary mb-8">What Our Clients Say</h2>
                    {loadingReviews ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border-l-4 border-accent relative">
                            <p className="text-lg text-gray-700 italic mb-6">"{reviews[0]?.text || 'The team was professional and the project was completed with exceptional quality. Highly recommend!'}"</p>
                            <div className="font-bold text-primary flex items-center justify-center gap-2">
                                <User size={20} />
                                <span>- {reviews[0]?.author || 'Homeowner'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Form Placeholder */}
            <section id="contact" className="py-16 bg-primary text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Get a Free Quote</h2>
                    <div className="max-w-2xl mx-auto bg-white text-gray-800 p-8 rounded-xl shadow-2xl">
                        {quoteStatus === 'success' ? (
                            <div className="text-center py-4">
                                <h3 className="text-xl font-bold text-green-600 mb-2">Request Sent!</h3>
                                <p className="text-gray-500">We'll get back to you shortly.</p>
                                <button onClick={() => setQuoteStatus('idle')} className="mt-4 text-primary font-bold hover:underline">Send another</button>
                            </div>
                        ) : (
                            <form className="space-y-4 text-left" onSubmit={handleQuoteSubmit}>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={quoteForm.name}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={quoteForm.email}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Project Details</label>
                                    <textarea
                                        value={quoteForm.details}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, details: e.target.value })}
                                        className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="Tell us about your project..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={quoteStatus === 'sending'}
                                    className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
                                >
                                    {quoteStatus === 'sending' ? 'Sending...' : 'Send Request'}
                                </button>
                                <p className="text-xs text-gray-500 mt-2 text-center">We respect your privacy.</p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
