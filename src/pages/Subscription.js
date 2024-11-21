// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ref, update } from 'firebase/database';
// import { useData } from '../ApiData/ContextProvider';
// import moment from 'moment';
// import './SubscriptionPage.css'; // Importing the CSS file for styling

// const SubscriptionPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   useEffect(() => {
//     let area = localStorage.getItem('userarea')
  
//     if (!area) {
//       navigate('/login');
//     }else{
//       let accessEnd = localStorage.getItem('accessEnd');
//       let time = new Date();
  
//       if (accessEnd) {
//         let accessEndDate = new Date(accessEnd);
//         if (time < accessEndDate) {
//           navigate('/');
//         } else {
         
//           navigate('/subscribe');
//         }
//       } else {
       
//         navigate('/subscribe');
//       }
//     }
//   }, [location.pathname]);

//   const CallUseData = () => {
//     useData();
//   }

//   const handleSubscription = (days) => {
//     const uid = localStorage.getItem('userUid');
//     if (!uid) {
//       navigate('/login');
//       return;
//     }
//     const { firebase } = CallUseData();
//     const { database } = firebase;

//     const newAccessEnd = moment().add(days, 'days').toISOString();

//     const userRef = ref(database, `register/${uid}`);
//     update(userRef, {
//       subscriptionPlan: days,
//       accessEnd: newAccessEnd,
//     })
//       .then(() => {
//         localStorage.setItem('accessEnd', newAccessEnd);
//         navigate('/');
//       })
//       .catch((error) => {
//         console.error('Error updating subscription:', error);
//         // Handle the error appropriately
//       });
//   };

//   const handleOnClickBackBtn = () => {
//     navigate('/login')
//   }

//   return (
//     <div className="subscription-container">
//       <h1 className="subscription-title">Choose Your Subscription Plan</h1>
//       <div className="subscription-cards">
//         <div className="subscription-card">
//           <h2>1 Month</h2>
//           <button onClick={() => handleSubscription(30)}>Subscribe</button>
//         </div>
//         <div className="subscription-card">
//           <h2>3 Months</h2>
//           <button onClick={() => handleSubscription(90)}>Subscribe</button>
//         </div>
//         <div className="subscription-card">
//           <h2>6 Months</h2>
//           <button onClick={() => handleSubscription(180)}>Subscribe</button>
//         </div>
//         <div className="subscription-card">
//           <h2>12 Months</h2>
//           <button onClick={() => handleSubscription(365)}>Subscribe</button>
//         </div>
//       </div>
//       <div className="backBtnContainer">
//         <button onClick={handleOnClickBackBtn} className='backBtn'>Back</button>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPage;
