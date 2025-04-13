import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';

interface StockItem {
  name: string;
  type: string;
  quantity: number;
  unit: string;
  condition: 'Critical' | 'Good' | 'Waste';
  tags: string[];
}

interface AddStockPageProps {
  onAddStock?: (item: StockItem) => void;
}

const AddStockPage: React.FC<AddStockPageProps> = ({ onAddStock }) => {
  const navigate = useNavigate();

  const [stockItem, setStockItem] = useState<StockItem>({
    name: '',
    type: 'Produce',
    quantity: 1,
    unit: 'units',
    condition: 'Good',
    tags: [],
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

  const handleTagToggle = (tag: string) => {
    setStockItem((prev) => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If onAddStock callback provided, call it with the current stock item
    if (onAddStock) {
      onAddStock(stockItem);
    }

    // For demo purposes, let's just log the item and navigate back
    console.log('Added stock item:', stockItem);
    navigate('/dashboard');
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
              type='text'
              name='name'
              value={stockItem.name}
              onChange={handleChange}
              className='space-input w-full'
              required
            />
          </div>

          <div>
            <label className='space-label block mb-1'>Food Type*</label>
            <select
              name='type'
              value={stockItem.type}
              onChange={handleChange}
              className='space-input w-full'
              required>
              <option>Produce</option>
              <option>Baked Goods</option>
              <option>Canned Goods</option>
              <option>Dairy</option>
              <option>Grains</option>
              <option>Dry Goods</option>
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
            <label className='space-label block mb-1'>Unit</label>
            <select
              name='unit'
              value={stockItem.unit}
              onChange={handleChange}
              className='space-input w-full'>
              <option>units</option>
              <option>lbs</option>
              <option>kg</option>
              <option>gallons</option>
              <option>liters</option>
              <option>boxes</option>
              <option>cans</option>
              <option>loaves</option>
              <option>pieces</option>
            </select>
          </div>

          <div>
            <label className='space-label block mb-1'>Condition</label>
            <select
              name='condition'
              value={stockItem.condition}
              onChange={handleChange}
              className='space-input w-full'>
              <option value='Good'>Good</option>
              <option value='Critical'>Critical</option>
              <option value='Waste'>Waste</option>
            </select>
          </div>
        </div>

        <div className='mb-8'>
          <label className='space-label block mb-2'>Restriction Tags</label>
          <div className='flex flex-wrap gap-2'>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-space transition-colors ${
                  stockItem.tags.includes(tag)
                    ? 'bg-cosmos-orbit text-white'
                    : 'bg-cosmos-stardust text-cosmos-station-base hover:bg-opacity-70'
                }`}>
                {tag}
              </button>
            ))}
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
