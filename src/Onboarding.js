// // SuggestionModal.js
// import React, { useState } from 'react';
// import { Modal, Button } from 'react-bootstrap';

// const Onboarding = ({ show, handleClose }) => {
//     const suggestions = [
//         "Welcome to Madhu Boys Hostel!",
//         "You can manage rooms and tenants easily.",
//         "Use the Add Rooms button to add new rooms.",
//         "Track the total number of rooms and tenants here.",
//         "click on the menu bar to navigate different pages."
//     ];

//     const [currentSuggestion, setCurrentSuggestion] = useState(0);

//     const handleNext = () => {
//         if (currentSuggestion < suggestions.length - 1) {
//             setCurrentSuggestion(currentSuggestion + 1);
//         } else {
//             handleClose();
//         }
//     };

//     return (
//         <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Suggestions</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {suggestions[currentSuggestion]}
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Skip
//                 </Button>
//                 <Button variant="primary" onClick={handleNext}>
//                     Next
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default Onboarding;
