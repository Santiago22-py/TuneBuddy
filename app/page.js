import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="flex flex-col bg-black min-h-screen">
      <Navbar />

      {/* Hero Section - Centered container */}
      <div className="flex flex-1 bg-black text-white p-8 max-w-6xl mx-auto w-full"> 
        
        {/* Left Column: Text and Button (w-1/2) */}
        <div className="flex flex-col justify-center p-4"> 
          
          {/* Inner div to apply a larger max-width to the text content */}
          <div className="max-w-3xl"> {/* Changed from max-w-md to max-w-lg */}
            <h1 className="text-5xl font-extrabold text-green-300 mb-4 leading-tight">
              Tired of losing track of your favorite songs?
            </h1>
            <p className="text-2xl font-semibold mb-8">
              Tune Buddy is here to help you!
            </p>
          </div>
          
          <button className="self-start px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg shadow-lg transition duration-300">
            Start Tracking
          </button>
        </div>

        {/* Right Column: Hero Image Placeholder (w-1/2) */}
        <div className="flex justify-center items-center w-1/2 p-4"> 
          <div className="w-full h-80 bg-gray-700 rounded-lg flex items-center justify-center text-xl font-medium">
            [Hero Image Placeholder]
          </div>
          
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-500 p-8 flex-1">
        <h2 className="text-3xl font-bold mb-4">Content Section</h2>
        <p>Whatever</p>
      </div>

      <Footer />
    </div>
  );
}