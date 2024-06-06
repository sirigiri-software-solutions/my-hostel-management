import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage/MainPage';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import { ToastContainer } from 'react-toastify';
import { DataProvider } from './ApiData/ContextProvider';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <DataProvider> 
      <ToastContainer />
      <Routes>
        <Route index element={<Login />} />
        <Route path="/mainPage" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
      </DataProvider>
    </BrowserRouter>
  );
};



export default App;
