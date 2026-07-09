import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">

        {/* Left Section */}
        <div>
          <h1 className="text-[120px] md:text-[170px] font-extrabold leading-none text-[#5F6FFF]">
            404
          </h1>

          <h2 className="text-4xl font-bold text-[#5F6FFF] mt-2">
            Page Not Found
          </h2>

          <p className="text-gray-500 mt-5 text-lg leading-relaxed">
            Looks like the page you're trying to visit doesn't exist or has
            been moved.
          </p>

          <p className="text-gray-500 mt-2">
            Let's help you find a doctor and book your appointment instead.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">
            <Link
              to="/"
              className="bg-[#5F6FFF] text-white px-8 py-3 rounded-xl font-semibold transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              Back to Home
            </Link>

            <Link
              to="/doctors"
              className="border-2 border-[#5F6FFF] text-[#5F6FFF] px-8 py-3 rounded-xl font-semibold transition duration-300 hover:bg-[#5F6FFF] hover:text-white"
            >
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex justify-center">

          {/* Decorative Circle */}
          <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-[#5F6FFF]/10 rounded-full animate-pulse"></div>

          {/* Medical Cross */}
          <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
            <div className="absolute w-24 h-72 bg-[#5F6FFF] rounded-full"></div>
            <div className="absolute h-24 w-72 bg-[#5F6FFF] rounded-full"></div>

            <div className="absolute bg-white w-56 h-56 rounded-full shadow-2xl flex items-center justify-center">
              <span className="text-7xl font-black text-[#5F6FFF]">
                ?
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Error;