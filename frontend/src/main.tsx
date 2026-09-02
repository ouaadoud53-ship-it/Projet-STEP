import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Marches } from './pages/Marches';
import { Series } from './pages/Series';
import { Ouvrages } from './pages/Ouvrages';
import { LibellesProduction } from './pages/LibellesProduction';
import { Decompositions } from './pages/Decompositions';
import { Hierarchie } from './pages/Hierarchie';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/marches" element={<Marches />} />
                  <Route path="/series" element={<Series />} />
                  <Route path="/ouvrages" element={<Ouvrages />} />
                  <Route path="/production" element={<LibellesProduction />} />
                  <Route path="/decompositions" element={<Decompositions />} />
                  <Route path="/hierarchie" element={<Hierarchie />} />
                </Routes>
              </DashboardLayout>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
