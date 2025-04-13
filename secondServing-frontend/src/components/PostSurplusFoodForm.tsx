import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PostSurplusFoodForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    expiryDateTime: '',
    availabilityWindow: '',
    pickupLocation: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Check if required fields are filled
    const requiredFields = ['title', 'description', 'quantity', 'expiryDateTime', 'availabilityWindow', 'pickupLocation'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError('Please fill all fields.');
        setIsLoading(false);
        return;
      }
    }

    // Get the JWT token from localStorage or context
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authorization required.');
      setIsLoading(false);
      return;
    }

    // Prepare the data for the POST request
    const foodData = {
      title: formData.title,
      description: formData.description,
      quantity: formData.quantity,
      expiryDateTime: formData.expiryDateTime,
      availabilityWindow: formData.availabilityWindow,
      pickupLocation: formData.pickupLocation,
    };

    try {
      const response = await fetch('/add-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        throw new Error('Failed to post food item.');
      }

      const data = await response.json();
      alert('Food item posted successfully!');
      setIsLoading(false);
      setFormData({ title: '', description: '', quantity: '', expiryDateTime: '', availabilityWindow: '', pickupLocation: '' }); // Reset form
    } catch (error: any) {
      setError(error.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-between p-4 space-container'>
      <Navbar />
      <div className="max-w-4xl mx-auto p-10 backdrop-blur-md bg-white/30 shadow-lg rounded-lg mb-12 mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center space-header">Post Surplus Food</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              required
            />
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              required
            />
          </div>

          {/* Expiry Date & Time */}
          <div className="mb-4">
            <label htmlFor="expiryDateTime" className="block text-sm font-medium text-gray-700">Expiry Date & Time</label>
            <input
              type="datetime-local"
              id="expiryDateTime"
              name="expiryDateTime"
              value={formData.expiryDateTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              required
            />
          </div>

          {/* Availability Window */}
          <div className="mb-4">
            <label htmlFor="availabilityWindow" className="block text-sm font-medium text-gray-700">Availability Window</label>
            <input
              type="text"
              id="availabilityWindow"
              name="availabilityWindow"
              value={formData.availabilityWindow}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input placeholder-gray-500"
              placeholder="e.g. 9 AM - 12 PM"
              required
            />
          </div>

          {/* Pickup Location */}
          <div className="mb-4">
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 donor-input"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-150 disabled:bg-gray-400 glow-effect space-button-ghost"
              disabled={isLoading}
            >
              {isLoading ? 'Posting...' : 'Post Surplus Food'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PostSurplusFoodForm;
