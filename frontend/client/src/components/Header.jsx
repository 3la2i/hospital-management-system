import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X} from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useDispatch,  useSelector } from 'react-redux';
import { logout } from '../redux/slices/authslice';


const ToothIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 6c-3.31 0-6 2.69-6 6 0 3.31 2.69 6 6 6s6-2.69 6-6c0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("user");
    localStorage.removeItem("user_id"); // Optional
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Conditional menu items based on authentication status
  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/DoctorsPage', label: 'Doctors' },
    // { to: '/DoctorPostsPage', label: 'Doctor Posts' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    // Only show Profile if the user is authenticated
    ...(isAuthenticated ? [{ to: '/profile', label: 'Profile' }] : []),
  ];

  return (
    <header className="bg-white text-[#34a5b1] py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ToothIcon />
            <h1 className="text-2xl font-bold text-[#34a5b1]">DentalCare Pro</h1>
          </Link>
        </div>
        <nav className="hidden md:flex justify-center space-x-8 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-lg hover:bg-blue-50 px-4 py-2 rounded-full hover:text-[#34a5b1] transition duration-300 ease-in-out"
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center hover:bg-blue-50 px-4 py-2 rounded-full hover:text-[#34a5b1] transition duration-300 ease-in-out ml-10"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:bg-blue-100 px-4 py-2 rounded-full text-lg hover:text-[#34a5b1] transition duration-300 ease-in-out ml-10 bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:bg-blue-100 px-4 py-2 rounded-full text-lg hover:text-[#34a5b1] transition duration-300 ease-in-out bg-blue-50"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
        <div className="flex justify-center mt-4">
          <button
            className="md:hidden text-blue-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white border-t border-blue-100">
          <nav className="flex flex-col items-center space-y-4 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:bg-blue-50 px-4 py-2 rounded-full text-lg hover:text-[#34a5b1] transition duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center hover:bg-blue-100 px-4 py-2 rounded-full hover:text-[#34a5b1] transition duration-300 ease-in-out bg-blue-50"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
