import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineQrcode } from 'react-icons/hi';
import axios from 'axios';
import QRScanner from './qrScanner/QRScanner';
import QRCodeInfo from './qrScanner/QRCodeInfo';

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

interface ProductInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  expiryDays: number;
  quantity: number;
  tags: string[];
}

interface AddStockPageProps {
  onAddStock?: (item: StockItem) => void;
}

// Sample product database (would come from backend in a real app)
const sampleProducts: { [key: string]: ProductInfo } = {
  'product-123456': {
    id: 'product-123456',
    name: 'Organic Apples',
    category: 'Produce',
    description:
      'Fresh organic apples from local farm. No pesticides or chemicals used.',
    expiryDays: 7,
    quantity: 10,
    tags: ['Vegan', 'Gluten Free', 'No Nuts'],
  },
  'product-789012': {
    id: 'product-789012',
    name: 'Whole Grain Bread',
    category: 'Baked Goods',
    description: 'Freshly baked whole grain bread with seeds',
    expiryDays: 4,
    quantity: 5,
    tags: ['Vegetarian'],
  },
};

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

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ProductInfo | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setStockItem((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
    }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemWithTags = {
        ...stockItem,
        tags: selectedTags,
      };
      await addFoodItem(itemWithTags);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding food item:', err);
      // Optional: add a toast or message to user
    }
  };

  const addFoodItem = async (foodData: any) => {
    try {
      const response = await axios.post(`${API_URL}/add-food`, foodData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleScanSuccess = (qrData: string) => {
    // In a real app, we would validate this data from the backend
    if (sampleProducts[qrData]) {
      setScannedProduct(sampleProducts[qrData]);
      setShowScanner(false);
      setShowProductInfo(true);
    } else {
      // Handle unknown QR code
      setShowScanner(false);
      alert(
        'Unknown product QR code. Please try again or enter details manually.'
      );
    }
  };

  const handleProductConfirm = (productInfo: ProductInfo) => {
    // Current date for the available_from field
    const now = new Date();

    // Calculate expiry date based on expiryDays
    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() + productInfo.expiryDays);

    // Calculate available_until date (1 day before expiry as default)
    const availableUntilDate = new Date(expiryDate);
    availableUntilDate.setDate(availableUntilDate.getDate() - 1);

    // Format dates for datetime-local input
    const formatDate = (date: Date) => {
      return date.toISOString().slice(0, 16);
    };

    // Update the form with scanned product info
    setStockItem({
      title: productInfo.name,
      description: productInfo.description,
      category: productInfo.category,
      quantity: productInfo.quantity,
      expiry: formatDate(expiryDate),
      available_from: formatDate(now),
      available_until: formatDate(availableUntilDate),
      pickupLocation: stockItem.pickupLocation || '', // Keep existing location if set
    });

    // Update tags
    setSelectedTags(productInfo.tags);

    // Close product info modal
    setShowProductInfo(false);
  };

  // Available food categories
  const foodCategories = [
    'Produce',
    'Dairy',
    'Meat',
    'Baked Goods',
    'Canned Goods',
    'Dry Goods',
    'Beverages',
    'Frozen Foods',
    'Prepared Foods',
    'Others',
  ];

  // Available food tags
  const foodTags = [
    'No Nuts',
    'Gluten Free',
    'Vegan',
    'Vegetarian',
    'Kosher',
    'Probiotic',
  ];

  return (
    <div className='space-card'>
      <div className='flex items-center mb-6'>
        <button
          onClick={() => navigate('/dashboard')}
          className='text-cosmos-station-base mr-4'>
          <HiOutlineArrowLeft className='w-5 h-5' />
        </button>
        <h1 className='font-future text-white text-xl'>Add Stock Item</h1>

        {/* QR Code Scanner Button */}
        <button
          onClick={() => setShowScanner(true)}
          className='ml-auto donor-button flex items-center py-2 px-3 rounded-lg'>
          <HiOutlineQrcode className='w-5 h-5 mr-2' /> Scan Product
        </button>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Product Info Modal */}
      {showProductInfo && scannedProduct && (
        <QRCodeInfo
          productInfo={scannedProduct}
          onConfirm={handleProductConfirm}
          onClose={() => setShowProductInfo(false)}
        />
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div className='space-y-4'>
            <div>
              <label className='space-label block mb-1'>Item Name*</label>
              <input
                type='text'
                name='title'
                value={stockItem.title}
                onChange={handleChange}
                className='space-input w-full'
                required
              />
            </div>

            <div>
              <label className='space-label block mb-1'>Food Type*</label>
              <select
                name='category'
                value={stockItem.category}
                onChange={handleChange}
                className='space-input w-full'>
                {foodCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='space-label block mb-1'>Description</label>
              <textarea
                name='description'
                value={stockItem.description}
                onChange={handleChange}
                className='space-input w-full h-24'
                placeholder='Add details about the food item'
              />
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
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            <div>
              <label className='space-label block mb-1'>Expiry Date*</label>
              <input
                type='datetime-local'
                name='expiry'
                value={stockItem.expiry}
                onChange={handleChange}
                className='space-input w-full'
                required
              />
            </div>

            <div>
              <label className='space-label block mb-1'>Available From*</label>
              <input
                type='datetime-local'
                name='available_from'
                value={stockItem.available_from}
                onChange={handleChange}
                className='space-input w-full'
                required
              />
            </div>

            <div>
              <label className='space-label block mb-1'>Available Until*</label>
              <input
                type='datetime-local'
                name='available_until'
                value={stockItem.available_until}
                onChange={handleChange}
                className='space-input w-full'
                required
              />
            </div>

            <div>
              <label className='space-label block mb-1'>Pickup Location*</label>
              <input
                type='text'
                name='pickupLocation'
                value={stockItem.pickupLocation}
                onChange={handleChange}
                className='space-input w-full'
                placeholder='Enter the pickup address'
                required
              />
            </div>
          </div>
        </div>

        {/* Food Tags Section */}
        <div>
          <label className='space-label block mb-2'>
            Food Tags (Select all that apply)
          </label>
          <div className='flex flex-wrap gap-2'>
            {foodTags.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-space transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-cosmos-orbit text-white'
                    : 'bg-cosmos-stardust bg-opacity-30 text-cosmos-station-base hover:bg-opacity-50'
                }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Form Buttons */}
        <div className='flex justify-end space-x-4 pt-4 border-t border-cosmos-stardust'>
          <button
            type='button'
            onClick={() => navigate('/dashboard')}
            className='space-button-ghost'>
            Cancel
          </button>
          <button type='submit' className='donor-button'>
            Add to Inventory
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStockPage;
