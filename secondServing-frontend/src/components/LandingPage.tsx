import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat">
            <div className="flex flex-col items-center justify-start h-full bg-black bg-opacity-50 text-white text-center px-8 space-container2">
                <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-wide leading-tight mt-16 space-header">
                    SECOND SERVING
                </h1>
                <p className="text-lg sm:text-2xl mb-8 max-w-lg mx-auto space-subheader">
                    Bridging the gap between excess and need
                </p>
               
                <Link to="/user-type-selection">
                    <button className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-105 glow-effect space-button-ghost">
                        JOIN US
                    </button>
                </Link>
                
            </div>
            

        </div>
        
    );
};

export default LandingPage;
