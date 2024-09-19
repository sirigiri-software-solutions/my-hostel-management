import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import Login from './pages/Login/Login';
import SubscriptionPage from './pages/Subscription';
import { ToastContainer } from 'react-toastify';
import { DataProvider } from './ApiData/ContextProvider';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Sections/Dashboard/Dashboard';
import Rooms from './Sections/Rooms/Rooms';
import Beds from './Sections/Beds/Beds';
import Tenants from './Sections/Tenants/Tenants';
import Rents from './Sections/Rents/Rents';
import Expenses from './Sections/Expenses/Expenses';
import Hostels from './Sections/Hostels/Hostels';
import Settings from './Sections/Settings/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <DataProvider>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<ProtectedRoute><MainPage /></ProtectedRoute>}>
            <Route path='dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='rooms' element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
            <Route path='beds' element={<ProtectedRoute><Beds /></ProtectedRoute>} />
            <Route path='tenants' element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
            <Route path='rents' element={<ProtectedRoute><Rents /></ProtectedRoute>} />
            <Route path='expenses' element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path='hostels' element={<ProtectedRoute><Hostels /></ProtectedRoute>} />
            <Route path='settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>
          <Route path="/subscribe" element={<SubscriptionPage />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
};

export default App;
