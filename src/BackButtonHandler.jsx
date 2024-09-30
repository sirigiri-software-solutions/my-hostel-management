import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { isPlatform } from '@ionic/react';

const BackButtonHandler = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      // if (showModal) {
      //   // Close the popup without navigating back
      //   setShowModal(false);
      // }
       if (location.pathname === '/dashboard') {
        CapacitorApp.exitApp(); // Exit the app if the back button is pressed on the dashboard
      } else {
        navigate(-1); // Go back to the previous page for all other routes
      }
    };

    if (isPlatform('android')) {
      CapacitorApp.addListener('backButton', handleBackButton);
    }

    return () => {
      if (isPlatform('android')) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [location, navigate]);

  return null;
};

export default BackButtonHandler;



