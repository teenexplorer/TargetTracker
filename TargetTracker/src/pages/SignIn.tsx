import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function SignIn() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-purple-600 to-pink-500 py-12 px-4">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}
        <h2 className="text-3xl font-bold text-center mb-8">Your ToDo List</h2>
        <AuthForm mode="signin" />
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}