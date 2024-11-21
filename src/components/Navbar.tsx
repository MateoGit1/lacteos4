import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, LogIn, User, Home } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-green-600 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="w-8 h-8" />
            <span className="font-bold text-xl">Lácteos Andinos</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 hover:text-green-200 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </Link>
            <Link
              to="/pqrsf"
              className="flex items-center space-x-1 hover:text-green-200 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>PQRSF</span>
            </Link>
            {!token ? (
              <Link
                to="/login"
                className="flex items-center space-x-1 hover:text-green-200 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            ) : (
              <>
                {role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 hover:text-green-200 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors"
                >
                  <LogIn className="w-5 h-5 transform rotate-180" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;