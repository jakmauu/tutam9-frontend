import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <motion.nav 
      className="bg-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/calendar" className="flex-shrink-0 flex items-center">
              <span className="text-primary-600 text-2xl font-bold">AT</span>
              <span className="ml-2 text-gray-800 text-lg font-medium">Assignment Tracker</span>
            </Link>
          </div>
          
          {currentUser && (
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-primary-300 transition duration-150 ease-in-out">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as <br />
                      <span className="font-medium">{currentUser.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;