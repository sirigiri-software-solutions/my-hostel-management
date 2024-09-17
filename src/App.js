import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
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
          <Route index element={<Login />} />
          <Route path='/' element={<MainPage />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='rooms' element={<Rooms />} />
            <Route path='beds' element={<Beds />} />
            <Route path='tenants' element={<Tenants />} />
            <Route path='rents' element={<Rents />} />
            <Route path='expenses' element={<Expenses />} />
            <Route path='hostels' element={<Hostels />} />
            <Route path='settings' element={<Settings />} />
          </Route>
          {/* <ProtectedRoute path="/dashboard" component={Dashboard} /> */}
          {/* <Route path="/mainPage" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>} /> */}
          <Route path="/subscribe" element={<SubscriptionPage />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
};
 
export default App;
 
 