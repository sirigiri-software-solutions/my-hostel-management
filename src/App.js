import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import { ToastContainer } from 'react-toastify';
import { DataProvider } from './ApiData/ContextProvider';
import ProtectedRoute from './ProtectedRoute';
// import AllHostels from './Sections/Hostels/HostelsData';

const App = () => {
  return (
    <BrowserRouter>
      <DataProvider> 
      <ToastContainer />
      <Routes>
        {/* <Route path='/allhostels'index  element={<AllHostels/>}/> */}
        <Route index element={<Login />} />
        <Route path="/mainPage" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>} />
      </Routes>
      </DataProvider>
    </BrowserRouter>
  );
};



export default App;
