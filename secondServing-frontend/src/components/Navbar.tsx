function Navbar() {
    return (
      <div className="w-full p-4 bg-black bg-opacity-60 flex items-center text-white text-lg font-bold absolute top-0 left-0 z-10">
        {/* Logo */}
        <img src="/assets/logo.png" alt="Logo" className="h-10 mr-4" />
        <span>Second Serving</span>
      </div>
    );
  }
  
  export default Navbar;
  