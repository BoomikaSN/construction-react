import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Star, MapPin, Briefcase, Filter } from 'lucide-react';
import { searchContractors } from '../api/contractorApi';



const ContractorSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [contractors, setContractors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter state
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '');
    const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');
    const [showFilters, setShowFilters] = useState(false);

    const fetchContractors = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (query) params.query = query;
            if (city) params.city = city;
            if (specialization) params.specialization = specialization;
            if (minRating) params.minRating = minRating;
            if (sortBy) params.sortBy = sortBy;

            const data = await searchContractors(params);
            setContractors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch contractors:', err);
            setError('Unable to load contractors. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContractors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (query) params.query = query;
        if (city) params.city = city;
        if (specialization) params.specialization = specialization;
        if (minRating) params.minRating = minRating;
        if (sortBy) params.sortBy = sortBy;
        setSearchParams(params);
        fetchContractors();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-primary text-white py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find a Contractor</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        Search our network of verified construction professionals.
                    </p>
                </div>
            </section>

            {/* Search Bar */}
            <section className="py-8 bg-white border-b shadow-sm">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, specialization, or city..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors md:hidden"
                        >
                            <Filter size={18} /> Filters
                        </button>
                    </form>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-8 bg-gray-50 flex-grow">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filter Sidebar */}
                        <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
                            <div className="bg-white p-6 rounded-xl shadow-md sticky top-[140px]">
                                <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                                    <Filter size={18} /> Filters
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="e.g. Chennai"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                        <select
                                            value={specialization}
                                            onChange={(e) => setSpecialization(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none text-sm bg-white"
                                        >
                                            <option value="">All Specializations</option>
                                            <option value="Residential">Residential</option>
                                            <option value="Commercial">Commercial</option>
                                            <option value="Renovation">Renovation</option>
                                            <option value="Project Management">Project Management</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                                        <select
                                            value={minRating}
                                            onChange={(e) => setMinRating(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none text-sm bg-white"
                                        >
                                            <option value="">Any Rating</option>
                                            <option value="4">4+ Stars</option>
                                            <option value="4.5">4.5+ Stars</option>
                                            <option value="3">3+ Stars</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none text-sm bg-white"
                                        >
                                            <option value="rating">Rating (High to Low)</option>
                                            <option value="experience">Experience (Most)</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="lg:col-span-3">
                            {error && (
                                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : contractors.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-xl font-medium">No contractors found</p>
                                    <p className="text-sm mt-2">Try adjusting your search criteria or filters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {contractors.map((contractor) => (
                                        <div key={contractor.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden border border-gray-100">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                                            {contractor.name?.charAt(0) || 'C'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-primary">{contractor.name}</h3>
                                                            <p className="text-sm text-gray-500">{contractor.specialization}</p>
                                                        </div>
                                                    </div>
                                                    {contractor.verified && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Verified</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 mb-3">
                                                    {renderStars(contractor.rating)}
                                                    <span className="text-sm text-gray-600 ml-1">{contractor.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} /> {contractor.city}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase size={14} /> {contractor.yearsExperience} yrs
                                                    </span>
                                                </div>
                                                <Link
                                                    to={`/contractors/${contractor.id}`}
                                                    className="block w-full text-center bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors text-sm"
                                                >
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContractorSearch;
