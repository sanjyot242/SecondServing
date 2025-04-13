import React from 'react';

interface FoodItem {
  name: string;
  type: string;
  condition: 'Critical' | 'Good' | 'Waste';
  tags: string[];
}

interface InventoryTableProps {
  items: FoodItem[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  // Get appropriate CSS class based on condition
  const getConditionClass = (condition: 'Critical' | 'Good' | 'Waste') => {
    switch (condition) {
      case 'Critical':
        return 'bg-cosmos-mars text-white';
      case 'Good':
        return 'bg-shelter-primary text-white';
      case 'Waste':
        return 'bg-cosmos-station-metal text-white';
      default:
        return 'bg-cosmos-station-hull';
    }
  };

  // Get appropriate CSS class based on tag type
  const getTagClass = (tag: string) => {
    if (tag.includes('Gluten')) return 'bg-cosmos-jupiter text-cosmos-void';
    if (tag.includes('Vegan')) return 'bg-shelter-secondary text-cosmos-void';
    if (tag.includes('Vegetarian')) return 'bg-cosmos-comet text-white';
    if (tag.includes('Kosher')) return 'bg-donor-secondary text-cosmos-void';
    if (tag.includes('Probiotic')) return 'bg-cosmos-satellite text-white';
    return 'bg-cosmos-orbit text-white';
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
              <th className='font-space text-cosmos-station-base font-medium pb-2'>
                Condition
              </th>
              <th className='font-space text-cosmos-station-base font-medium pb-2'>
                Restriction Tags
              </th>
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
                <td className='py-3 font-space text-white'>{item.name}</td>
                <td className='py-3 font-space text-cosmos-station-base'>
                  {item.type}
                </td>
                <td className='py-3'>
                  <span
                    className={`${getConditionClass(
                      item.condition
                    )} px-2 py-1 rounded-full text-xs font-space`}>
                    {item.condition}
                  </span>
                </td>
                <td className='py-3 flex flex-wrap gap-1'>
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`${getTagClass(
                        tag
                      )} px-2 py-1 rounded-full text-xs font-space`}>
                      {tag}
                    </span>
                  ))}
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
