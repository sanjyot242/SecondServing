import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import axios from 'axios';

interface StockItem {
  title: string;
  description?: string;
  category: string;
  quantity: number;
  expiry: string;
  available_from?: string;
  available_until?: string;
  pickupLocation: string;
}

interface AddStockPageProps {
  onAddStock?: (item: StockItem) => void;
}

const AddStockPage: React.FC<AddStockPageProps> = ({ onAddStock }) => {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080';

  const [stockItem, setStockItem] = useState<StockItem>({
    title: '',
    description: '',
    category: 'Produce',
    quantity: 1,
    expiry: '',
    available_from: '',
    available_until: '',
    pickupLocation: '',
  });

  const [availableTags, setAvailableTags] = useState([
    'No Nuts',
    'Gluten Free',
    'Vegan',
    'Vegetarian',
    'Kosher',
    'Probiotic',
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStockItem((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addFoodItem(stockItem); // will throw if failed
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding food item:', err);
      // Optional: add a toast or message to user
    }
  };

  const addFoodItem = async (foodData: StockItem) => {
    try {
      const response = await axios.post(`${API_URL}/add-food`, foodData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className='space-card'>
      <div className='flex items-center mb-6'>
        <button
          onClick={() => navigate('/dashboard')}
          className='text-cosmos-station-base mr-4'>
          <HiOutlineArrowLeft className='w-5 h-5' />
        </button>
        <h1 className='font-future text-white text-xl'>Add Stock Item</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='space-label block mb-1'>Item Name*</label>
            <input
              type="text"
              name="title"
              value={stockItem.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className='space-label block mb-1'>Food Type*</label>
            <select
              name="category"
              value={stockItem.category}
              onChange={handleChange}
            >
              <option>Produce</option>
              <option>Dairy</option>
              <option>Meat</option>
              <option>Baked Goods</option>
              <option>Canned Goods</option>
              <option>Dry Goods</option>
              <option>Beverages</option>
              <option>Frozen Foods</option>
              <option>Prepared Foods</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className='space-label block mb-1'>Quantity*</label>
            <input
              type='number'
              name='quantity'
              value={stockItem.quantity}
              onChange={handleChange}
              min='1'
              className='space-input w-full'
              required
            />
          </div>

          <div>
            <label className='space-label block mb-1'>Expiry*</label>
            <input
              type="datetime-local"
              name="expiry"
              value={stockItem.expiry}
              onChange={handleChange}
              required
            />

            {/* Available From */}
            <label className='space-label block mb-1'>Available From*</label>
            <input
              type="datetime-local"
              name="available_from"
              value={stockItem.available_from}
              onChange={handleChange}
            />

            {/* Available Until */}
            <label className='space-label block mb-1'>Available Until*</label>
            <input
              type="datetime-local"
              name="available_until"
              value={stockItem.available_until}
              onChange={handleChange}
            />

            {/* Pickup Location */}
            <label className='space-label block mb-1'>Pickup Location*</label>
            <input
              type="text"
              name="pickupLocation"
              value={stockItem.pickupLocation}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => navigate('/dashboard')}
            className='space-button-ghost'>
            Cancel
          </button>
          <button type='submit' className='shelter-button'>
            Add to Inventory
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStockPage;
