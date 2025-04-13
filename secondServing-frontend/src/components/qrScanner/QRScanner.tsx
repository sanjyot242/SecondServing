import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlineX,
  HiOutlineCamera,
  HiOutlineQrcode,
  HiOutlinePhotograph,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import '../../styles/qrScanner.css';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanningStage, setScanningStage] = useState(0); // 0: initializing, 1: scanning, 2: processing
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start scanning animation when component mounts
  useEffect(() => {
    // Simulate camera initialization
    const timer = setTimeout(() => {
      setScanning(true);
      setScanningStage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSimulateScan = () => {
    // Simulate scanning stages
    setScanning(false);
    setScanningStage(2); // Processing stage
    setScanComplete(true);

    setTimeout(() => {
      // Fake QR data - in a real app this would be the data from the QR code
      onScanSuccess('product-123456');
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, process the image for QR code
      setScanning(false);
      setScanningStage(2); // Processing stage
      setScanComplete(true);

      setTimeout(() => {
        onScanSuccess('product-123456');
      }, 1500);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-cosmos-void bg-opacity-90'>
      <div className='bg-cosmos-nebula rounded-lg shadow-cosmos border border-cosmos-stardust p-6 max-w-md w-full animate-fade-in'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-future text-white text-lg flex items-center'>
            <HiOutlineQrcode className='mr-2 text-cosmos-orbit' />
            QR Code Scanner
          </h2>
          <button
            onClick={onClose}
            className='text-white hover:text-cosmos-mars transition-colors'>
            <HiOutlineX className='w-6 h-6' />
          </button>
        </div>

        {/* Scanner viewport */}
        <div className='bg-black rounded-lg overflow-hidden relative mb-6 h-64 flex items-center justify-center animate-bg-pulse'>
          {scanComplete ? (
            <div className='text-center text-white p-4 stagger-fade-in'>
              <div className='text-cosmos-orbit text-5xl mb-4 animate-success-pulse'>
                <HiOutlineCheckCircle />
              </div>
              <p className='font-space text-lg font-medium'>
                QR Code Detected!
              </p>
              <div className='mt-3 px-8 py-1 bg-cosmos-orbit bg-opacity-20 rounded-full animate-shimmer'>
                <p className='text-sm text-cosmos-station-base'>
                  Retrieving product information...
                </p>
              </div>
            </div>
          ) : scanning ? (
            <>
              {/* Animated scanning effect */}
              <div className='absolute top-0 left-0 w-full h-1 bg-cosmos-orbit animate-scanner-line'></div>

              {/* Target frame */}
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-cosmos-orbit rounded animate-frame-pulse'>
                <div className='absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cosmos-orbit animate-corner-pulse'></div>
                <div className='absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cosmos-orbit animate-corner-pulse'></div>
                <div className='absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cosmos-orbit animate-corner-pulse'></div>
                <div className='absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cosmos-orbit animate-corner-pulse'></div>
              </div>

              <div className='text-white text-xs absolute bottom-4 left-0 right-0 text-center font-space animate-pulse'>
                Center QR code in the frame
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center text-cosmos-station-base animate-pulse'>
              <HiOutlineCamera className='w-16 h-16 mb-3 opacity-50' />
              <p className='font-space'>Initializing camera...</p>
              <div className='mt-4 flex space-x-1'>
                <div className='h-1 w-1 bg-cosmos-orbit rounded-full animate-pulse'></div>
                <div
                  className='h-1 w-1 bg-cosmos-orbit rounded-full animate-pulse'
                  style={{ animationDelay: '0.2s' }}></div>
                <div
                  className='h-1 w-1 bg-cosmos-orbit rounded-full animate-pulse'
                  style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        <div className='space-y-3'>
          <button
            onClick={handleSimulateScan}
            className='donor-button w-full py-3 transition-all hover:shadow-lg'
            disabled={scanComplete}>
            {scanningStage === 2 ? 'Processing...' : 'Simulate Successful Scan'}
          </button>

          <div className='flex items-center my-3'>
            <div className='flex-grow h-px bg-cosmos-stardust'></div>
            <span className='px-2 text-cosmos-station-base text-sm'>OR</span>
            <div className='flex-grow h-px bg-cosmos-stardust'></div>
          </div>

          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleFileUpload}
            className='hidden'
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className='space-button-ghost w-full py-3 flex items-center justify-center'
            disabled={scanComplete}>
            <HiOutlinePhotograph className='w-5 h-5 mr-2' />
            Upload Image with QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
