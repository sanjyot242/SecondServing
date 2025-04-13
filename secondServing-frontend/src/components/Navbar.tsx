import Logo from './Logo'; // Import the Logo component

function Navbar() {
  return (
    <div className="w-full py-2 px-4 bg-teal-900 text-white flex items-center justify-between fixed top-0 left-0 z-20 shadow-sm">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Logo className="h-10" /> {/* Adjust logo size */}
        <span className="text-lg font-semibold">Second Serving</span>
      </div>

      {/* Navigation links */}
      <div className="space-x-4 hidden md:flex">
        <a href="/dashboard" className="text-sm hover:text-teal-300 transition">Dashboard</a>
        <a href="/about" className="text-sm hover:text-teal-300 transition">About</a>
        <a href="/contact" className="text-sm hover:text-teal-300 transition">Contact</a>
      </div>
    </div>
  );
}

export default Navbar;
