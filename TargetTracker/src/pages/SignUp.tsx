import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-purple-600 to-pink-500 py-12 px-4">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        <AuthForm mode="signup" />
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}