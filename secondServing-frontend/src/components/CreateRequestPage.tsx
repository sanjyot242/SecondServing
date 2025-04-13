import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi';
import axios from 'axios';

interface RequestItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

interface RequestFormData {
  title: string;
  urgency: string;
  items: RequestItem[];
  notes: string;
}

const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080';

  const [formData, setFormData] = useState<RequestFormData>({
    title: '',
    urgency: 'High - Within 2 days',
    items: [
      { id: '1', name: '', category: 'Dairy', quantity: 1, unit: 'units' },
    ],
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof RequestItem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'quantity' ? parseInt(value) : value }
          : item
      ),
    }));
  };

  const handleAddItem = () => {
    const newId = (formData.items.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: newId, name: '', category: 'Dairy', quantity: 1, unit: 'units' },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    // Only allow removing if there's more than one item
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  const mapUrgency = (value: string): "low" | "medium" | "high" => {
    if (value.toLowerCase().includes("high")) return "high";
    if (value.toLowerCase().includes("medium")) return "medium";
    return "low";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const item = formData.items[0]; // Only use the first item for MVP
  
    const payload = {
      title: formData.title,
      requested_item: item.name,
      category: item.category,
      quantity: item.quantity,
      urgency: mapUrgency(formData.urgency),
      needed_by: null, // optionally add this later
      is_recurring: false,
      notes: formData.notes,
    };
  
    try {
      await axios.post(`${API_URL}/requests`, payload, { withCredentials: true });
      console.log('Request submitted:', payload);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error submitting request:', err);
      // Optionally show a toast or error UI
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
        <h1 className='font-future text-white text-xl'>Create New Request</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='mb-8'>
          <h2 className='font-space text-cosmos-station-base font-medium mb-4'>
            Request Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='space-label block'>Request Title*</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='space-input w-full'
                required
              />
            </div>

            <div>
              <label className='space-label block'>Urgency Level</label>
              <select
                name='urgency'
                value={formData.urgency}
                onChange={handleChange}
                className='space-input w-full'>
                <option>High - Within 2 days</option>
                <option>Medium - Within a week</option>
                <option>Low - When available</option>
              </select>
            </div>
          </div>
        </div>

        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='font-space text-cosmos-station-base font-medium'>
              Requested Items*
            </h2>
            <button
              type='button'
              onClick={handleAddItem}
              className='donor-button py-1 px-3 flex items-center text-sm'>
              <HiOutlinePlus className='w-4 h-4 mr-1' /> Add Item
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div
              key={item.id}
              className='grid grid-cols-12 gap-4 mb-4 items-end'>
              <div className='col-span-12 md:col-span-4'>
                <label className='space-label block'>Item Name*</label>
                <input
                  type='text'
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(item.id, 'name', e.target.value)
                  }
                  className='space-input w-full'
                  required
                />
              </div>

              <div className='col-span-12 md:col-span-2'>
                <label className='space-label block'>Category</label>
                <select
                  value={item.category}
                  onChange={(e) =>
                    handleItemChange(item.id, 'category', e.target.value)
                  }
                  className='space-input w-full'>
                  <option>Dairy</option>
                  <option>Produce</option>
                  <option>Canned Goods</option>
                  <option>Baked Goods</option>
                  <option>Grains</option>
                  <option>Dry Goods</option>
                </select>
              </div>

              <div className='col-span-6 md:col-span-2'>
                <label className='space-label block'>Quantity*</label>
                <input
                  type='number'
                  min='1'
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(item.id, 'quantity', e.target.value)
                  }
                  className='space-input w-full'
                  required
                />
              </div>

              <div className='col-span-6 md:col-span-3'>
                <label className='space-label block'>Unit</label>
                <select
                  value={item.unit}
                  onChange={(e) =>
                    handleItemChange(item.id, 'unit', e.target.value)
                  }
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

              <div className='col-span-12 md:col-span-1 flex justify-center'>
                <button
                  type='button'
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={formData.items.length <= 1}
                  className='p-2 text-cosmos-mars hover:bg-cosmos-stardust hover:bg-opacity-20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'>
                  <HiOutlineTrash className='w-5 h-5' />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='mb-8'>
          <label className='space-label block mb-2'>Additional Notes</label>
          <textarea
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            className='space-input w-full h-32'
            placeholder='We have the demand for milk and need it as soon as possible!'></textarea>
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => navigate('/dashboard')}
            className='space-button-ghost'>
            Cancel
          </button>
          <button type='submit' className='donor-button'>
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequestPage;
