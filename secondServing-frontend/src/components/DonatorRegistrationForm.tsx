import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DonatorData } from '../types';
import { useAuth } from '../context/AuthContext';

const DonatorRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { registerDonator } = useAuth();
  
  const [formData, setFormData] = useState<DonatorData>({
    name: '',
    location: '',
    type: '',
    contactInfo: '',
    password: '',
    email: '',
    role: 'provider'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const donorTypes = ['Restaurant', 'Grocery Store', 'Bakery', 'Catering Service', 'Farm', 'Other'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await registerDonator(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 space-container">
        <div className="max-w-4xl w-full backdrop-blur-md bg-white/30 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 space-header">Register as a Donor</h1>
            <p className="text-gray-600 mt-2 space-subheader">Join SecondServing to donate surplus food</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              />
            </div>

            {/* Business Type */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              >
                <option value="">Select your business type</option>
                {donorTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input placeholder-gray-500"
                placeholder="Full address"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              />
            </div>

            {/* Contact Information */}
            <div className="mb-4">
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Information
              </label>
              <input
                id="contactInfo"
                name="contactInfo"
                type="tel"
                required
                value={formData.contactInfo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input placeholder-gray-500"
                placeholder="Phone number"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
                minLength={8}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
                minLength={8}
              />
            </div>

            {/* Submit Button */}
            <div className="mb-4 col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-150 disabled:bg-gray-400 glow-effect space-button-ghost"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Already have an account?{' '}
              <Link 
                to="/login?type=donator"
                className="text-teal-800 hover:text-teal-900 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default DonatorRegistrationForm;
