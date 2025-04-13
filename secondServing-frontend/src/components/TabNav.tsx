import React from 'react';

interface TabProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-space ${
        active
          ? 'text-white border-b-2 border-cosmos-orbit'
          : 'text-cosmos-station-metal hover:text-white'
      }`}>
      {label}
    </button>
  );
};

interface TabNavProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNav: React.FC<TabNavProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className='border-b border-cosmos-stardust mb-6'>
      <div className='flex space-x-2'>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            label={tab}
            active={tab === activeTab}
            onClick={() => onTabChange(tab)}
          />
        ))}
      </div>
    </div>
  );
};

export default TabNav;
