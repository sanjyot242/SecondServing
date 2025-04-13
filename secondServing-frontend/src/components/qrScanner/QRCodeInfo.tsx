import React, { useState, useEffect } from 'react';
import {
  HiOutlineX,
  HiOutlineClipboard,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineInformationCircle,
  HiOutlinePlusCircle,
} from 'react-icons/hi';
import '../../styles/qrScanner.css';

interface ProductInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  expiryDays: number;
  quantity: number;
  tags: string[];
}

interface QRCodeInfoProps {
  productInfo: ProductInfo;
  onConfirm: (productInfo: ProductInfo) => void;
  onClose: () => void;
}

const QRCodeInfo: React.FC<QRCodeInfoProps> = ({
  productInfo,
  onConfirm,
  onClose,
}) => {
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  // Animate the success icon on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccessIcon(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Get appropriate icon for food category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'produce':
        return '🥬';
      case 'dairy':
        return '🥛';
      case 'meat':
        return '🥩';
      case 'baked goods':
        return '🍞';
      case 'canned goods':
        return '🥫';
      case 'dry goods':
        return '🌾';
      case 'beverages':
        return '🧃';
      case 'frozen foods':
        return '❄️';
      case 'prepared foods':
        return '🍱';
      default:
        return '🍽️';
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-cosmos-void bg-opacity-90'>
      <div className='bg-cosmos-nebula rounded-lg shadow-cosmos border border-cosmos-stardust p-6 max-w-md w-full animate-fade-in'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-future text-white text-lg flex items-center'>
            <HiOutlineInformationCircle className='mr-2 text-cosmos-orbit' />
            Product Information
          </h2>
          <button
            onClick={onClose}
            className='text-white hover:text-cosmos-mars transition-colors'>
            <HiOutlineX className='w-6 h-6' />
          </button>
        </div>

        <div className='space-y-5 mb-6 stagger-fade-in'>
          {/* Product icon and name */}
          <div className='bg-cosmos-orbit bg-opacity-10 p-4 rounded-lg flex items-center'>
            <div
              className={`w-16 h-16 bg-cosmos-orbit bg-opacity-20 rounded-full flex items-center justify-center mr-4 transition-all duration-500 ${
                showSuccessIcon ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
              }`}>
              <span
                className='text-3xl'
                role='img'
                aria-label={productInfo.category}>
                {getCategoryIcon(productInfo.category)}
              </span>
            </div>
            <div>
              <h3 className='text-white font-future text-xl'>
                {productInfo.name}
              </h3>
              <div className='flex items-center mt-1'>
                <span className='px-2 py-0.5 rounded-full bg-cosmos-orbit bg-opacity-20 text-cosmos-station-base text-xs font-space'>
                  {productInfo.category}
                </span>
              </div>
            </div>
          </div>

          {/* Product details cards */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-cosmos-stardust bg-opacity-10 p-3 rounded-lg border border-cosmos-stardust border-opacity-20'>
              <div className='flex items-center text-cosmos-station-base text-sm font-space mb-1'>
                <HiOutlineClipboard className='mr-1 w-4 h-4' /> Quantity
              </div>
              <p className='text-white font-space text-lg'>
                {productInfo.quantity} units
              </p>
            </div>

            <div className='bg-cosmos-stardust bg-opacity-10 p-3 rounded-lg border border-cosmos-stardust border-opacity-20'>
              <div className='flex items-center text-cosmos-station-base text-sm font-space mb-1'>
                <HiOutlineClock className='mr-1 w-4 h-4' /> Expires In
              </div>
              <p className='text-white font-space text-lg'>
                {productInfo.expiryDays} days
              </p>
            </div>
          </div>

          {/* Description */}
          <div className='bg-cosmos-stardust bg-opacity-10 p-4 rounded-lg border border-cosmos-stardust border-opacity-20'>
            <div className='flex items-center text-cosmos-station-base text-sm font-space mb-2'>
              <HiOutlineInformationCircle className='mr-1 w-4 h-4' />{' '}
              Description
            </div>
            <p className='text-white font-space'>{productInfo.description}</p>
          </div>

          {/* Tags */}
          <div>
            <div className='flex items-center text-cosmos-station-base text-sm font-space mb-2'>
              <HiOutlineTag className='mr-1 w-4 h-4' /> Tags
            </div>
            <div className='flex flex-wrap gap-2'>
              {productInfo.tags.map((tag, index) => (
                <span
                  key={tag}
                  className='bg-cosmos-orbit bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-space transition-colors hover:bg-opacity-30'
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className='flex flex-col space-y-3 pt-4 border-t border-cosmos-stardust border-opacity-30'>
          <button
            onClick={() => onConfirm(productInfo)}
            className='donor-button w-full flex items-center justify-center py-3 transition-all hover:shadow-lg'>
            <HiOutlinePlusCircle className='w-5 h-5 mr-2' />
            Add to Inventory Form
          </button>

          <button onClick={onClose} className='space-button-ghost py-2'>
            Scan Different Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeInfo;
