import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';

const Header = ({ user, setUser }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Star Electricals
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to={`/${user.username}/home`} className="hover:text-blue-600">
                {user.name}
              </Link>
              <Link to="/cart" className="hover:text-blue-600">
                Cart
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        setUser={setUser}
      />
    </header>
  );
};

export default Header;