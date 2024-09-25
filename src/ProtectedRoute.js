// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import moment from 'moment';

// const ProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   const isAuthenticated = localStorage.getItem('userUid'); // Check if user is authenticated
//   const accessEnd = localStorage.getItem('accessEnd');

//   if (!isAuthenticated) {
//     // Redirect to login page if not authenticated
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   if (accessEnd) {
//     const now = moment();
//     const endTime = moment(accessEnd);

//     if (now.isAfter(endTime)) {
//       // If the subscription has expired, redirect to subscription page
//       return <Navigate to="/subscribe" state={{ from: location }} replace />;
//     }
//   } else {
//     // Redirect to subscription page if no accessEnd is found
//     return <Navigate to="/subscribe" state={{ from: location }} replace />;
//   }

//   return children; // Render the protected component if authenticated and subscription is valid
// };

// export default ProtectedRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import moment from 'moment';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('userUid'); // Check if user is authenticated
  const accessEnd = localStorage.getItem('accessEnd');

  const now = moment();
  const endTime = moment(accessEnd);

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!accessEnd || now.isAfter(endTime)) {
    // If the subscription has expired or no accessEnd is found, redirect to subscription page
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return children; // Render the protected component if authenticated and subscription is valid
};

export default ProtectedRoute;
