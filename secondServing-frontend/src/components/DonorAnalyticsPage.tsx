import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DonorAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    axios.get('http://localhost:8080/analytics/provider-impact', { withCredentials: true })
      .then(res => setAnalytics(res.data))
      .catch(err => console.error('Failed to fetch analytics', err));
  }, []);

  if (!analytics) return <p className='text-white'>Loading analytics...</p>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#c084fc'];

  return (
    <div className='space-card'>
      <h1 className='font-future text-white text-xl mb-6'>Environmental Impact</h1>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {Object.entries(analytics.summary).map(([key, value]) => (
          <div
            key={key as string}
            className='bg-cosmos-stardust bg-opacity-20 p-4 rounded-lg text-white shadow-md'>
            <h3 className='font-space text-sm text-cosmos-station-base mb-2'>{String(key).replace(/_/g, ' ').toUpperCase()}</h3>
            <p className='text-xl font-bold'>{String(value)}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Pie Chart */}
        <div className='bg-cosmos-stardust bg-opacity-20 p-4 rounded-lg'>
          <h3 className='text-white mb-4 font-space font-semibold'>Donations by Category</h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={analytics.category_breakdown}
                dataKey='count'
                nameKey='category'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label
              >
                {(analytics.category_breakdown || []).map((categoryItem: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className='bg-cosmos-stardust bg-opacity-20 p-4 rounded-lg'>
          <h3 className='text-white mb-4 font-space font-semibold'>Donation Trend (Last 30 Days)</h3>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={analytics.donation_trend}>
              <XAxis dataKey='date' stroke='#ccc' fontSize={10} />
              <YAxis allowDecimals={false} stroke='#ccc' />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='count' stroke='#00C49F' strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Items */}
      <div className='mt-10'>
        <h3 className='text-white font-space font-semibold mb-4'>Top Donated Items</h3>
        <ul className='space-y-2'>
          {analytics.top_items.map((item: any, index: number) => (
            <li
              key={index}
              className='text-cosmos-station-base border border-cosmos-stardust p-2 rounded-lg bg-cosmos-nebula bg-opacity-30'>
              {item.title} — {item.count} times
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonorAnalyticsPage;
