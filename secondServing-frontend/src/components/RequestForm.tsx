import React, { useState } from 'react';
import { HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi';

interface RequestFormItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

interface RequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  userType: 'shelter' | 'donator';
}

const RequestForm: React.FC<RequestFormProps> = ({
  onSubmit,
  onCancel,
  userType,
}) => {
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState('High - Within 2 days');
  const [items, setItems] = useState<RequestFormItem[]>([
    { id: '1', name: '', category: '', quantity: 1, unit: 'units' },
  ]);
  const [notes, setNotes] = useState('');

  const handleAddItem = () => {
    const newId = (items.length + 1).toString();
    setItems([
      ...items,
      { id: newId, name: '', category: '', quantity: 1, unit: 'units' },
    ]);
  };

  const handleItemChange = (
    id: string,
    field: keyof RequestFormItem,
    value: any
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      urgency,
      items,
      notes,
    });
  };

  const buttonClass =
    userType === 'shelter' ? 'shelter-button' : 'donor-button';
  const inputClass = userType === 'shelter' ? 'shelter-input' : 'donor-input';

  return (
    <div className='max-w-3xl mx-auto space-card'>
      <div className='flex items-center mb-6'>
        <button onClick={onCancel} className='text-cosmos-station-base mr-4'>
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
                className='space-input w-full'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className='space-label block'>Urgency Level</label>
              <select
                className='space-input w-full'
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}>
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
              className={`${buttonClass} py-1 px-3 flex items-center text-sm`}>
              <HiOutlinePlus className='w-4 h-4 mr-1' /> Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className='grid grid-cols-4 gap-4 mb-4'>
              <div>
                <label className='space-label block'>Item Name*</label>
                <input
                  type='text'
                  className='space-input w-full'
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(item.id, 'name', e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className='space-label block'>Category</label>
                <select
                  className='space-input w-full'
                  value={item.category}
                  onChange={(e) =>
                    handleItemChange(item.id, 'category', e.target.value)
                  }>
                  <option value=''>Select...</option>
                  <option>Dairy</option>
                  <option>Produce</option>
                  <option>Canned Goods</option>
                  <option>Baked Goods</option>
                  <option>Grains</option>
                  <option>Dry Goods</option>
                </select>
              </div>

              <div>
                <label className='space-label block'>Quantity*</label>
                <input
                  type='number'
                  min='1'
                  className='space-input w-full'
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      item.id,
                      'quantity',
                      parseInt(e.target.value)
                    )
                  }
                  required
                />
              </div>

              <div>
                <label className='space-label block'>Unit</label>
                <select
                  className='space-input w-full'
                  value={item.unit}
                  onChange={(e) =>
                    handleItemChange(item.id, 'unit', e.target.value)
                  }>
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
            </div>
          ))}
        </div>

        <div className='mb-8'>
          <label className='space-label block mb-2'>Additional Notes</label>
          <textarea
            className='space-input w-full h-32'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Add any specific requirements or context for this request...'></textarea>
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={onCancel}
            className='space-button-ghost'>
            Cancel
          </button>
          <button type='submit' className={buttonClass}>
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
