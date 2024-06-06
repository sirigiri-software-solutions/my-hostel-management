import React, { useState } from 'react';
import TenantsBoys from './TenantsBoys';

const CreateTenantsBoys = () => {
  const [showCreateTenantsBoys, setShowCreateTenantsBoys] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleCreateTenantsBoys = () => {
    setShowCreateTenantsBoys(!showCreateTenantsBoys);
    setErrors({}); // Clear errors when toggling
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newErrors = {};

    // Required field validation
    ['inputImg', 'inputName', 'inputEmergencycon', 'inputRent', 'inputMobile', 'inputUpdatedt', 'inputId', 'inputBed'].forEach((field) => {
      if (!formData.get(field)) {
        newErrors[field] = 'This field is required';
      }
    });

    // Image file validation
    const imageFile = formData.get('inputImg');
    if (imageFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5 MB

      if (!allowedTypes.includes(imageFile.type)) {
        newErrors['inputImg'] = 'Invalid file type. Only JPG, JPEG, PNG, or GIF files are allowed.';
      }

      if (imageFile.size > maxSize) {
        newErrors['inputImg'] = 'File size exceeds the limit of 5 MB.';
      }
    }


    // Set errors state
    setErrors(newErrors);

    // If there are no errors, you can proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      // You can submit the form data or perform other actions here
    }
  };

  return (
    <div className='h-100'>
      {!showCreateTenantsBoys ? (
        <>
          <div className="container-fluid">
            <h1 className='fs-5' onClick={toggleCreateTenantsBoys}>&lt;-- Back</h1>
            <h1 className='text-center mb-2 fs-5'>Create Beds</h1>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="inputImg" className="form-label">Image</label>
                <input type="file" className="form-control" id="inputImg" name='inputImg' />
                {errors['inputImg'] && (
                  <div className="text-danger">{errors['inputImg']}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputName" className="form-label">Name</label>
                <input type="text" className="form-control" id="inputName" name='inputName' />
                {errors['inputName'] && (
                  <div className="text-danger">{errors['inputName']}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputEmergencycon" className="form-label">Emergency Contact</label>
                <input type="tel" className="form-control" id="inputEmergencycon" name='inputEmergencycon' />
                {errors['inputEmergencycon'] && (
                  <div className="text-danger">{errors['inputEmergencycon']}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputRent" className="form-label">Status</label>
                <input type="text" className="form-control" id="inputRent" name='inputRent' />
                {errors['inputRent'] && (
                  <div className="text-danger">{errors['inputRent']}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputMobile" className="form-label">Mobile</label>
                <input type="tel" className="form-control" id="inputMobile" name='inputMobile' />
                {errors['inputMobile'] && (
                  <div className="text-danger">{errors['inputMobile']}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputUpdatedt" className="form-label">Updated By</label>
                <input type="date" className="form-control" id="inputUpdatedt" name='inputUpdatedt' />
                {errors['inputUpdatedt'] && (
                  <div className="text-danger">{errors['inputUpdatedt']}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputId" className="form-label">ID</label>
                <input type="number" className="form-control" id="inputId" name='inputId' />
                {errors['inputId'] && (
                  <div className="text-danger">{errors['inputId']}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="inputBed" className="form-label">Bed</label>
                <input type="number" className="form-control" id="inputBed" name='inputBed' />
                {errors['inputBed'] && (
                  <div className="text-danger">{errors['inputBed']}</div>
                )}
              </div>
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-warning">Create</button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <TenantsBoys />
      )}
    </div>
  );
};

export default CreateTenantsBoys;
