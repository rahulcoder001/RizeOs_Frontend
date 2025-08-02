// client/src/pages/JobFeedPage.tsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Filter, Briefcase, MapPin, DollarSign, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Job {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  salary?: number;
  location: string;
  tags: string[];
  paymentTxHash: string;
  createdAt: string;
  createdBy: {
    name: string;
    walletAddress: string;
  };
  similarity?: number; // For recommendations
}

export default function JobFeedPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [, setSuggestedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Fetch jobs with NLP search
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (skillsFilter) params.append('skills', skillsFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (tagsFilter) params.append('tags', tagsFilter);

      const response = await axios.get(`http://localhost:5000/api/jobs/search?${params.toString()}`);
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs: ' + err);
    } finally {
      setLoading(false);
    }
  }, [search, skillsFilter, locationFilter, tagsFilter]);

  // Fetch skill suggestions
  const fetchSkillSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestedSkills([]);
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/skills?q=${encodeURIComponent(query)}`);
      setSuggestedSkills(response.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch skill suggestions:', err);
    }
  }, []);

  // Initial job load
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Debounce skill suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSkillSuggestions(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, fetchSkillSuggestions]);

  const clearFilters = () => {
    setSearch('');
    setSkillsFilter('');
    setLocationFilter('');
    setTagsFilter('');
    setSuggestedSkills([]);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Recommendations Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Job Recommendations</h2>
          <button 
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {showRecommendations ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {/* Recommendations Section */}
        {showRecommendations && user && (
          <div className="mb-10 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs
                .filter(job => job.similarity && job.similarity > 0.3)
                .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
                .slice(0, 3)
                .map(job => (
                  <div key={job._id} className="bg-white rounded-lg shadow-md border border-indigo-100 overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                        <div className="flex items-center bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          <span className="font-medium">
                            {Math.round((job.similarity || 0) * 100)}% match
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600 line-clamp-2">{job.description}</div>
                      
                      <div className="mt-4 flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="flex-shrink-0 mr-1 text-gray-400 w-4 h-4" />
                          <span className="text-xs text-gray-500">{job.location || 'Remote'}</span>
                        </div>
                        
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
              
              {jobs.filter(job => job.similarity && job.similarity > 0.3).length === 0 && (
                <div className="col-span-full text-center py-4">
                  <p className="text-gray-600">Complete your profile to get personalized job recommendations</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Job Feed Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Feed</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        
        {/* Search with AI suggestions */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Search jobs by title, skills, or description..."
          />
{/*           
          {suggestedSkills.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
              <div className="px-3 py-2 text-xs text-gray-500 font-semibold border-b">
                AI Suggestions
              </div>
              {suggestedSkills.map((skill, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setSearch(skill);
                    setSuggestedSkills([]);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-indigo-50 flex items-center"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
                  {skill}
                </div>
              ))}
            </div>
          )} */}
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="City or country"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsFilter}
                  onChange={(e) => setTagsFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Remote, Full-time, Contract"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Job Listings */}
        <div className="grid grid-cols-1 gap-6">
          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {job.budget} ETH
                    </span>
                  </div>
                  
                  <div className="mt-4 text-gray-600">{job.description}</div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-2 text-gray-400" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="flex-shrink-0 mr-2 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {job.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="flex-shrink-0 mr-2 text-gray-400" />
                      <span>
                        {job.salary 
                          ? `$${job.salary.toLocaleString()}/year` 
                          : 'Salary not specified'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                        <span className="text-xs font-bold">JD</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{job.createdBy.name}</p>
                        <p className="text-xs text-gray-500 truncate w-32">
                          {job.createdBy.walletAddress}
                        </p>
                      </div>
                    </div>
                    
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${job.paymentTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      View Payment
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}