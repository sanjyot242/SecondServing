import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const quotes = [
    "Bridging the gap between excess and need",
    "Together, we can make a difference in the fight against hunger",
    "Your food donation could change someone's life",
    "Join us in reducing food waste and feeding those in need",
    "Help us deliver hope through food"
  ];

  useEffect(() => {
    let currentQuote = quotes[quoteIndex];
    let currentText = "";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < currentQuote.length) {
        currentText += currentQuote[i];
        setTypedText(currentText);
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 2000); // Wait for 2 seconds before changing the quote
      }
    }, 100); // Typing speed (100ms per character)

    return () => clearInterval(typingInterval);
  }, [quoteIndex]);

  // Handle button click event to trigger fade-out animation
  const handleButtonClick = () => {
    setIsButtonClicked(true);
  };

  return (
    <div className="min-h-screen relative">

      {/* First Section (Welcome) */}
      <div className="min-h-screen bg-no-repeat bg-center bg-contain relative">
        {/* Background image with reduced opacity */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div> {/* Reduced opacity */}

        {/* Centered Content */}
        <div className="flex flex-col items-center justify-start h-full bg-black bg-opacity-50 text-white text-center px-8 space-container2">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-wide leading-tight mt-64 space-header text-shadow-lg text-white animate-pulse">
            SECOND SERVING
          </h1>

          <p className="text-lg sm:text-2xl mb-8 max-w-lg mx-auto space-subheader text-shadow-lg">
            <span className="typing-text">{typedText}</span>
            <span className="cursor">|</span> {/* Cursor animation */}
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

      {/* New Section: Main Features and Mission */}
      <div className="bg-white py-16 blur-effect">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">How it Works</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Our app connects businesses with food donors to help reduce food waste. 
            By partnering with local shelters and nonprofits, we help redistribute food to 
            those in need. Join us in making a lasting impact on the environment and society.
          </p>
          <div className="flex justify-center gap-8">
            <div className="w-1/3">
              <h3 className="text-xl font-semibold text-teal-600 mb-2">Donate Food</h3>
              <p className="text-gray-600">Businesses, restaurants, or any company with surplus food can schedule a pickup with our team.</p>
            </div>
            <div className="w-1/3">
              <h3 className="text-xl font-semibold text-teal-600 mb-2">Receive Food</h3>
              <p className="text-gray-600">Nonprofits can request and receive high-quality food donations through food recovery from our partners.</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Section: Testimonials */}
      <div className="bg-teal-100 py-16 blur-effect">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8">What Our Users Say</h2>
          <div className="flex justify-center gap-8">
            <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg text-gray-700 mb-4">
                "Second Serving has helped our restaurant give back to the community. It's so easy to use, and the impact is incredible!"
              </p>
              <h4 className="font-semibold text-teal-600">John D., Restaurant Owner</h4>
            </div>
            <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg text-gray-700 mb-4">
                "We’ve been able to feed so many more families with the help of Second Serving. It's truly a game-changer in food donation."
              </p>
              <h4 className="font-semibold text-teal-600">Maria T., Shelter Director</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
