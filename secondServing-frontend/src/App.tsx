import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundImage from '../public/Images/bg-1.jpg'; // Import the image

function App() {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat h-screen flex flex-col justify-start items-center text-white"
      style={{ backgroundImage: `url(${BackgroundImage})` }} 
    >
      <Navbar />
      <Footer />
    </div>
  );
}

export default App;
