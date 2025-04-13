import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-green-500 via-teal-500 to-green-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl transition-transform duration-300 group-hover:rotate-12">🌟</span>
            <span className="text-2xl font-extrabold tracking-wide">IntelliHelper</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 font-medium text-sm tracking-wide">
            <Link to="/" className="hover:text-teal-200 transition-colors duration-200">Home</Link>
            <Link to="/chat" className="hover:text-teal-200 transition-colors duration-200">Chat</Link>
            <Link to="/notes" className="hover:text-teal-200 transition-colors duration-200">Notes</Link>
            <Link to="/news" className="hover:text-teal-200 transition-colors duration-200">News</Link>
            <Link to="/todo" className="hover:text-teal-200 transition-colors duration-200">Todo</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4 text-sm">
            <Link 
              to="/auth/login" 
              className="hover:text-teal-200 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;