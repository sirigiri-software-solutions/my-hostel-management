import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { isPlatform } from '@ionic/react';

const BackButtonHandler = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // const handleBackButton = () => {
     
       if (location.pathname === '/dashboard') {
        CapacitorApp.exitApp(); 
       }
       
    // };
    // let backButtonListener;
    // if (isPlatform('android')) {
    //    backButtonListener = CapacitorApp.addListener('backButton', handleBackButton);
    // }

   
    // return () => {
    //   if (backButtonListener) {
    //     backButtonListener.remove();
    //   }

    // };
  }, [location,navigate]);

  return null;
};

export default BackButtonHandler;



// old code 
// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { App as CapacitorApp } from '@capacitor/app';
// import { isPlatform } from '@ionic/react';

// const BackButtonHandler = ({ showModal, setShowModal }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleBackButton = () => {
//       // if (showModal) {
//       //   // Close the popup without navigating back
//       //   setShowModal(false);
//       // }
//        if (location.pathname === '/dashboard') {
//         CapacitorApp.exitApp(); // Exit the app if the back button is pressed on the dashboard
//        }
//         // else {
//       //   navigate(-1); // Go back to the previous page for all other routes
//       // }
//     };
//     let backButtonListener;
//     if (isPlatform('android')) {
//        backButtonListener = CapacitorApp.addListener('backButton', handleBackButton);
//     }

//     // return () => {
//     //   if (isPlatform('android')) {
//     //     // CapacitorApp.removeAllListeners();
//     //     CapacitorApp.removeListener('backButton', handleBackButton);
//     //   }
//     // };
//     return () => {
//       backButtonListener.remove(); // Correct way to remove a specific listener
//     };
//   }, [location, navigate]);

//   return null;
// };

// export default BackButtonHandler;



