import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductSalesPage } from './pages/ProductSalesPage';
import { ProductPreviewPage } from './pages/ProductPreviewPage';
import { useAuthStore } from './store/authStore';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, initialized } = useAuthStore();
  
  if (!initialized) {
    return null;
  }
  
  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/:mode" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/product/:productId"
          element={
            <ProtectedRoute>
              <ProductSalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/product/:productId/preview"
          element={
            <ProtectedRoute>
              <ProductPreviewPage />
            </ProtectedRoute>
          }
        />
        <Route path="/:username" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;