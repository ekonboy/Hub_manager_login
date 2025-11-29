import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Stores from './pages/Stores';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/stores" 
          element={
            <ProtectedRoute>
              <Stores />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/stores" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
