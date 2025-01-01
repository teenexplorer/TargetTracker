import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TodoList from './components/TodoList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-purple-600 to-pink-500 py-12 px-4 overflow-auto">
                <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
                  <TodoList />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;