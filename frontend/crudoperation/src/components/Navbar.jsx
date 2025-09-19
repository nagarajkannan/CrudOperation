import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold hover:text-gray-300">Home</Link>
      </div>

      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          </>
        )}

        {user && (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="hover:text-gray-300">Admin Dashboard</Link>
            )}
            {user.role === 'user' && (
              <Link to="/dashboard" className="hover:text-gray-300">User Dashboard</Link>
            )}
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
