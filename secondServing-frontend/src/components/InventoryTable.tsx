import React from 'react';

interface FoodItem {
  title: string;
  category: string;
  condition: string; // e.g. "expired", "expiring_soon", "fresh, low_quantity"
  available_until?: string;
}

interface InventoryTableProps {
  items: FoodItem[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  // Get appropriate CSS class based on condition

  // Get appropriate CSS class based on tag type
  const formatCondition = (condition: string) => {
    const parts = condition.split(',').map(c => c.trim());
  
    if (parts.includes("expired")) return "Expired";
    if (parts.includes("expiring_soon")) return "Expiring Soon";
    if (parts.includes("low_quantity")) return "Low Quantity";
    return "Fresh";
  };
  
  const getConditionClass = (condition: string) => {
    if (condition.includes("expired")) return 'bg-cosmos-mars text-white';
    if (condition.includes("expiring_soon")) return 'bg-yellow-600 text-white';
    if (condition.includes("low_quantity")) return 'bg-orange-500 text-white';
    return 'bg-shelter-primary text-white';
  };

  return (
    <div className='space-card overflow-hidden'>
      <h2 className='font-future text-white text-xl mb-4'>Inventory</h2>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='text-left border-b border-cosmos-stardust'>
              <th className='font-space text-cosmos-station-base font-medium pb-2'>
                Name
              </th>
              <th className='font-space text-cosmos-station-base font-medium pb-2'>
                Food Type
              </th>
              <th className='font-space text-cosmos-station-base font-medium pb-2'>Condition</th>
              <th className='font-space text-cosmos-station-base font-medium pb-2'>Available Until</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-cosmos-stardust ${
                  index % 2 === 0
                    ? 'bg-cosmos-nebula'
                    : 'bg-cosmos-stardust bg-opacity-10'
                }`}>
                <td className='py-3 font-space text-white'>{item.title}</td>
                <td className='py-3 font-space text-cosmos-station-base'>
                  {item.category}
                </td>
                <td className='py-3'>
                  <span
                    className={`${getConditionClass(item.condition)} px-2 py-1 rounded-full text-xs font-space`}
                  >
                    {formatCondition(item.condition)}
                  </span>
                </td>
                <td className='py-3 font-space text-cosmos-station-base'>
                  {item.available_until
                    ? new Date(item.available_until).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;