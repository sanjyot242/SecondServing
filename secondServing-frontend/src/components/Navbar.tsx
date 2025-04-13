import Logo from './Logo'; 

function Navbar() {
  return (
    <div className="w-full p-4 bg-black bg-opacity-60 flex items-center text-white text-lg font-bold absolute top-0 left-0 z-10">

      <Logo /> 
      <span>Second Serving</span>
    </div>
  );
}

export default Navbar;
