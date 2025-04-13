import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  // Handle button click event to trigger fade-out animation
  const handleButtonClick = () => {
    setIsButtonClicked(true);
  };

  return (
    <motion.div
      initial={{ x: '100%' }} // Start off-screen to the right
      animate={{ x: 0 }}      // End at default position (0, center)
      exit={{ x: '-100%' }}    // Move to the left (off-screen) when navigating away
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 25, 
        duration: 1
      }}
    >
      <div className="min-h-screen bg-no-repeat bg-center bg-contain">
        <div className="flex flex-col items-center justify-start h-full bg-black bg-opacity-50 text-white text-center px-8 space-container2">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-wide leading-tight mt-16 space-header">
            SECOND SERVING
          </h1>
          <p className="text-lg sm:text-2xl mb-8 max-w-lg mx-auto space-subheader">
            Bridging the gap between excess and need
          </p>

          {/* Animated Fade-In/Fade-Out Button */}
          <motion.div
            initial={{ opacity: 1 }} // Start visible
            animate={{ opacity: isButtonClicked ? 0 : 1 }} // Fade out after click
            transition={{ duration: 0.5 }} // Transition time for the fade
            className="w-full text-center"
          >
            <Link to="/user-type-selection">
              <button
                onClick={handleButtonClick}
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-105 glow-effect space-button-ghost"
              >
                JOIN US
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
