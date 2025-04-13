// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Space theme colors
        cosmos: {
          // Deep space colors
          void: '#0A0E17',         // Deep space background
          nebula: '#1E2A45',       // Darker blue-purple
          stardust: '#2D3B55',     // Soft muted space blue
          
          // Celestial body colors
          moon: '#E5E7EB',         // Soft gray like the moon
          mars: '#CF4242',         // Rusty red
          venus: '#FFA07A',        // Soft orange
          jupiter: '#E8B36B',      // Gas giant tan
          
          // Orbital colors (for actions, buttons, highlights)
          orbit: '#64B5F6',        // Bright blue accent
          satellite: '#00BCD4',    // Teal secondary accent
          comet: '#9575CD',        // Purple tertiary accent
          
          // Space station neutrals (for cards, containers)
          station: {
            base: '#F7F9FC',       // Very light blue-gray
            hull: '#DFE3E8',       // Medium light gray
            panel: '#CBD5E1',      // Medium gray
            metal: '#94A3B8',      // Dark gray
          }
        },
        
        // User role-specific colors
        shelter: {
          primary: '#16A34A',      // A teal/green for shelters
          secondary: '#86EFAC',    // Lighter green
          light: '#DCFCE7',        // Very light green for backgrounds
          dark: '#166534',         // Dark green for text
        },
        
        donor: {
          primary: '#2563EB',      // Blue for donors
          secondary: '#93C5FD',    // Lighter blue
          light: '#DBEAFE',        // Very light blue for backgrounds
          dark: '#1E40AF',         // Dark blue for text
        }
      },
      
      // Custom font families
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'future': ['Orbitron', 'sans-serif'],
        'mono-space': ['Space Mono', 'monospace'],
      },
      
      // Space-themed box shadows
      boxShadow: {
        'orbit': '0 0 15px rgba(100, 181, 246, 0.5)',
        'cosmos': '0 4px 20px rgba(10, 14, 23, 0.3)',
        'glow': '0 0 8px rgba(255, 255, 255, 0.5)',
        'nebula': '0 4px 20px rgba(149, 117, 205, 0.4)',
      },
      
      // Space-themed gradients
      backgroundImage: {
        'cosmos-gradient': 'linear-gradient(to bottom, #0A0E17, #1E2A45)',
        'nebula-gradient': 'linear-gradient(to right, #1E2A45, #2D3B55)',
        'orbit-gradient': 'linear-gradient(to right, #64B5F6, #00BCD4)',
        'mars-gradient': 'linear-gradient(to right, #CF4242, #FF7043)',
      },
      
      // Space-themed border radius
      borderRadius: {
        'capsule': '40px',
        'crater': '30% 70% 70% 30% / 30% 30% 70% 70%',
      },
      
      // Animations for space themes
      keyframes: {
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(10px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(10px) rotate(-360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)' },
        },
      },
      animation: {
        'orbit': 'orbit 20s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};