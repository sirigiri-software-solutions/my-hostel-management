import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { useData } from '../ApiData/ContextProvider';
import moment from 'moment';
import './SubscriptionPage.css'; // Importing the CSS file for styling

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { firebase } = useData();
  const { database } = firebase;

  const handleSubscription = (days) => {
    const uid = localStorage.getItem('userUid');
    if (!uid) {
      navigate('/');
      return;
    }

    const newAccessEnd = moment().add(days, 'days').toISOString();

    const userRef = ref(database, `register/${uid}`);
    update(userRef, {
      subscriptionPlan: days,
      accessEnd: newAccessEnd,
    })
    .then(() => {
      localStorage.setItem('accessEnd', newAccessEnd);
      navigate('/mainPage');
    })
    .catch((error) => {
      console.error('Error updating subscription:', error);
      // Handle the error appropriately
    });
  };

  const handleOnClickBackBtn = () => {
    navigate('/')
  }

  return (
    <div className="subscription-container">
      <h1 className="subscription-title">Choose Your Subscription Plan</h1>
      <div className="subscription-cards">
        <div className="subscription-card">
          <h2>1 Month</h2>
          <button onClick={() => handleSubscription(30)}>Subscribe</button>
        </div>
        <div className="subscription-card">
          <h2>3 Months</h2>
          <button onClick={() => handleSubscription(90)}>Subscribe</button>
        </div>
        <div className="subscription-card">
          <h2>6 Months</h2>
          <button onClick={() => handleSubscription(180)}>Subscribe</button>
        </div>
        <div className="subscription-card">
          <h2>12 Months</h2>
          <button onClick={() => handleSubscription(365)}>Subscribe</button>
        </div>
      </div>
      <div className="backBtnContainer">
      <button onClick={handleOnClickBackBtn} className='backBtn'>Back</button>
      </div>
    </div>
  );
};

export default SubscriptionPage;
