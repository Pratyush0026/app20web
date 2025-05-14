import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/home/Home';
import ShowList from './components/showlist/ShowList';
import GetPaid from './components/getPaid/GetPaid';
import Analytics from './components/analytics/Analytics';
import Showanalytics from './components/analytics/Showanalytics';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './utils/axiosConfig'; 

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/showlist/:offer" 
            element={
              <ProtectedRoute>
                <ShowList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/getpaid" 
            element={
              <ProtectedRoute>
                <GetPaid />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics/:offer" 
            element={
              <ProtectedRoute>
                <Showanalytics />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;