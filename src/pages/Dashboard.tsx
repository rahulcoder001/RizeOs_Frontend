// client/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Upload, User, Briefcase, Link, Mail, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [manualSkills, setManualSkills] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  // Fetch user profile data
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const userData = response.data;
          setName(userData.name || '');
          setBio(userData.bio || '');
          setLinkedinUrl(userData.linkedinUrl || '');
          setSkills(userData.skills || []);
        } catch (err) {
          console.error('Failed to fetch profile data'+err);
        }
      };
      
      fetchProfile();
    }
  }, [user]);

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  if (file && file.type === 'application/pdf') {
    setResumeFile(file);
    setIsExtracting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post('http://localhost:5000/api/ai/extract-skills', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSkills(response.data.skills);
      setSuccessMessage('Skills extracted successfully from your resume!');
    } catch (err) {
      setError('Failed to extract skills. Please try again.'+ err);
    } finally {
      setIsExtracting(false);
    }
  } else {
    setError('Please upload a valid PDF file.');
  }
};

  const addManualSkill = () => {
    if (manualSkills.trim()) {
      const newSkills = manualSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
      setSkills(prev => [...new Set([...prev, ...newSkills])]);
      setManualSkills('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    try {
      await axios.put('http://localhost:5000/api/auth/profile', {
        userId: user?.id,
        name,
        bio,
        linkedinUrl,
        skills
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.'+err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your professional information and showcase your skills</p>
        </div>

        {/* Alert Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-green-800">{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-600 hover:text-green-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{name || 'Your Name'}</h2>
                <p className="text-gray-600 mt-1">{user?.email}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Link className="w-4 h-4" />
                  <span className="truncate">{linkedinUrl || 'No LinkedIn URL'}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded break-all">
                    {user?.walletAddress || 'No wallet connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <div className="flex space-x-8">
                  {[
                    { id: 'basic', label: 'Basic Info', icon: User },
                    { id: 'skills', label: 'Skills & Resume', icon: Briefcase }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Professional Bio
                      </label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your professional background..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        value={user?.walletAddress || ''}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-mono text-sm"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-8">
                    {/* Resume Upload */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Upload</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          {isExtracting ? (
                            <div className="space-y-4">
                              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                              <p className="text-indigo-600 font-medium">Extracting skills from your resume...</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                              <div>
                                <p className="text-lg font-medium text-gray-900">
                                  {resumeFile ? resumeFile.name : 'Upload your resume'}
                                </p>
                                <p className="text-gray-500 mt-1">
                                  PDF files only. We'll automatically extract your skills using AI.
                                </p>
                              </div>
                              <div className="bg-indigo-600 text-white px-6 py-2 rounded-lg inline-block hover:bg-indigo-700 transition-colors">
                                Choose File
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Manual Skills Input */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Skills Manually</h3>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={manualSkills}
                          onChange={(e) => setManualSkills(e.target.value)}
                          placeholder="Enter skills separated by commas"
                          onKeyPress={(e) => e.key === 'Enter' && addManualSkill()}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={addManualSkill}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Skills Display */}
                    {skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}