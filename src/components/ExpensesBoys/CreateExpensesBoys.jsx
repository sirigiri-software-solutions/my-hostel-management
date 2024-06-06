
import React, { useState } from 'react';
import ExpensesBoys from './ExpensesBoys';
 
const CreateExpensesBoys = () => {
  const [showCreateExpensesBoys, setShowCreateExpensesBoys] = useState(false);
  const [errors, setErrors] = useState({});
 
  const toggleCreateExpensesBoys = () => {
    setShowCreateExpensesBoys(!showCreateExpensesBoys);
    setErrors({}); // Clear errors when toggling
  };
 
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const newErrors = {};
 
    // Required field validation
    ['inputName', 'inputDate', 'inputMonth', 'inputAmount', 'inputYear', 'inputMobile', 'inputdes', 'inputCreatedOn'].forEach((field) => {
      if (!formData.get(field)) {
        newErrors[field] = 'This field is required';
      }
    });
 
    // Mobile number format validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.get('inputMobile'))) {
      newErrors['inputMobile'] = 'Mobile number must be 10 digits';
    }
 
    // Amount validation
    if (formData.get('inputAmount') <= 0) {
      newErrors['inputAmount'] = 'Amount must be greater than zero';
    }
 
    // Due date validation
    const currentDate = new Date().toISOString().split('T')[0];
    if (formData.get('inputDate') < currentDate) {
      newErrors['inputDate'] = 'Due date must be after today';
    }
 
    if (Object.keys(newErrors).length === 0) {
      // Submit form if there are no errors
      // console.log('Form submitted successfully');
      form.reset(); // Reset form after successful submission
    } else {
      setErrors(newErrors); // Set errors state to trigger re-render with error messages
    }
  };
 
  return (
    <div className="h-100" style={{backgroundColor:"hsla(30, 100%, 50%, 0.41)"}}>
      {!showCreateExpensesBoys ? (
        <>
          <div className="container-fluid">
            <h1 className="fs-5" onClick={toggleCreateExpensesBoys}>
              &lt;--Back
            </h1>
            <h1 className="text-center mb-2 fs-5">Create Expenses</h1>
            <form className="row g-3" onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="col-md-6">
                <label htmlFor="inputName" className="form-label">
                  Name
                </label>
                <input type="text" className="form-control" id="inputName" name="inputName" />
                {errors['inputName'] && <div className="text-danger">{errors['inputName']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputDate" className="form-label">
                  Due Date
                </label>
                <input type="date" className="form-control" id="inputDate" name="inputDate" />
                {errors['inputDate'] && <div className="text-danger">{errors['inputDate']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputMonth" className="form-label">
                  Month
                </label>
                <input type="date" className="form-control" id="inputMonth" name="inputMonth" />
                {errors['inputMonth'] && <div className="text-danger">{errors['inputMonth']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputAmount" className="form-label">
                  Amount
                </label>
                <input type="number" className="form-control" id="inputAmount" name="inputAmount" />
                {errors['inputAmount'] && <div className="text-danger">{errors['inputAmount']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputYear" className="form-label">
                  Year
                </label>
                <input type="date" className="form-control" id="inputYear" name="inputYear" />
                {errors['inputYear'] && <div className="text-danger">{errors['inputYear']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputMobile" className="form-label">
                  Mobile
                </label>
                <input type="tel" className="form-control" id="inputMobile" name="inputMobile" />
                {errors['inputMobile'] && <div className="text-danger">{errors['inputMobile']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputdes" className="form-label">
                  Small Description
                </label>
                <textarea type="textarea" className="form-control" id="inputdes" name="inputdes" />
                {errors['inputdes'] && <div className="text-danger">{errors['inputdes']}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputCreatedOn" className="form-label">
                  Created On
                </label>
                <input type="date" className="form-control" id="inputCreatedOn" name="inputCreatedOn" />
                {errors['inputCreatedOn'] && <div className="text-danger">{errors['inputCreatedOn']}</div>}
              </div>
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-warning">
                  Create
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <ExpensesBoys />
      )}
    </div>
  );
};
 
export default CreateExpensesBoys;
 
