import { push, ref, set } from 'firebase/database';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useData } from '../../ApiData/ContextProvider';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './MainPage.css'
import { Capacitor } from '@capacitor/core';
import imageCompression from 'browser-image-compression';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';




const DefaultModal = ({ show, handleClose }) => {
    const { firebase, userUid, fetchData } = useData();
    const { t } = useTranslation();
    const [selectedForms, setSelectedForms] = useState({
        men: false,
        women: false,
    });
    const [currentForm, setCurrentForm] = useState('');
    const [mensFormData, setMensFormData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const[isCameraUsed,setIsCameraUsed]=useState(false);
    const isMobile = Capacitor.isNativePlatform(); // Detect if running on mobile
    const [errorMessage, setErrorMessage] = useState('');
 
     
    const takePicture = async (isBoys, name) => {
        if (!isMobile) {
            console.error("Camera access is not supported on your device.");
            return;
        }
        if (isFileUploaded) {
            setErrorMessage((prevErrors) => ({
                ...prevErrors,
                hostelImage: "You've already uploaded a photo from the file manager.",
            }));
            return;
        }
        try {
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri
            });
    
            const response = await fetch(photo.webPath);
            const blob = await response.blob();
    
            // Set image state based on whether it's a boys' or girls' hostel
            if (isBoys) {
                setBoysHostelImage(blob);
            } else {
                setGirlsHostelImage(blob);
            }
    
            const uploadFile = async (file, path) => {
                try {
                    const imageRef = storageRef(storage, path);
                    const snapshot = await uploadBytes(imageRef, file);
                    return await getDownloadURL(snapshot.ref);
                } catch (error) {
                    console.error(`Error uploading file ${file.name}:`, error);
                    throw error;
                }
            };
    
            // Construct the path for storage
            const uploadedUrl = await uploadFile(blob, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${name}`);
            setPhotoUrl(uploadedUrl); // Set the uploaded URL to display the image
    
            // After successful upload
            setIsCameraUsed(true);
            setIsFileUploaded(false); // Indicate that a file has been uploaded from the camera
        } catch (error) {
            console.error("Error accessing the camera", error);
            // Optionally show a toast error message here
        }
    };
    
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedForms((prev) => ({ ...prev, [name]: checked }));
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        if (selectedForms.men) {
            setCurrentForm('men');
        } else if (selectedForms.women) {
            setCurrentForm('women');
        }
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.6, // Compress to a maximum of 600 KB
            maxWidthOrHeight: 1920,
            useWebWorker: true, // Use a web worker for better performance
            fileType: 'image/jpeg',
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing the image:', error);
            return null;
        }
    };

    const handleMenFormSubmit = async (e) => {
        e.preventDefault();
        // Prevent multiple submissions
        if (isSubmitting) return;

        setIsSubmitting(true);

        let boysHostelImageUrlToUpdate = boysHostelImageUrl;

        if (boysHostelImage) { // Ensure that boysHostelImage is defined before proceeding
            try {
                const compressedImage = await compressImage(boysHostelImage); // Renamed to avoid conflict

                if (compressedImage) {
                    const imageRef = storageRef(storage, `Hostel/${userUid}/boys/${newBoysHostelName}`);
                    const snapshot = await uploadBytes(imageRef, compressedImage);
                    boysHostelImageUrlToUpdate = await getDownloadURL(snapshot.ref);
                    console.log(boysHostelImageUrlToUpdate, "boysHostelImageUrlToUpdate");
                }
            } catch (error) {
                console.error("Error uploading boys hostel image:", error);
            }
        }

        const mensData = {
            name: newBoysHostelName,
            address: newBoysHostelAddress,
            hostelImage: boysHostelImageUrlToUpdate,
        };

        setMensFormData(mensData);

        if (selectedForms.women) {
            setCurrentForm('women');
        } else {
            submitHostelData(mensData, true);
        }
        // Allow further submissions only after the process is completed
        setIsSubmitting(false);
    };


    const handleWomenFormSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

        let girlsHostelImageUrlToUpdate = girlsHostelImageUrl;
        if (girlsHostelImage) {

            try {
                const compressedImage = await compressImage(girlsHostelImage); // Renamed to avoid conflict

                if (compressedImage) {
                    const imageRef = storageRef(storage, `Hostel/${userUid}/girls/${newGirlsHostelName}`);
                    const snapshot = await uploadBytes(imageRef, compressedImage);
                    girlsHostelImageUrlToUpdate = await getDownloadURL(snapshot.ref);
                    console.log(girlsHostelImageUrlToUpdate, "girlsHostelImageUrlToUpdate");
                }
            } catch (error) {
                console.error("Error uploading boys hostel image:", error);
            }


        }

        const womensData = {
            name: newGirlsHostelName,
            address: newGirlsHostelAddress,
            hostelImage: girlsHostelImageUrlToUpdate,
        };

        if (mensFormData) {
            submitHostelData(mensFormData, true);
        }
        submitHostelData(womensData, false);
         // Allow further submissions only after the process is completed
    setIsSubmitting(false);
    };

    const [newBoysHostelName, setNewBoysHostelName] = useState('');
    const [newBoysHostelAddress, setNewBoysHostelAddress] = useState('');
    const [newGirlsHostelName, setNewGirlsHostelName] = useState('');
    const [newGirlsHostelAddress, setNewGirlsHostelAddress] = useState('');
    const [boysHostelImage, setBoysHostelImage] = useState('');
    const [boysHostelImageUrl, setBoysHostelImageUrl] = useState('');
    const [girlsHostelImage, setGirlsHostelImage] = useState('');
    const [girlsHostelImageUrl, setGirlsHostelImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { database, storage } = firebase;

    const validateAlphanumeric = (input) => {
        const regex = /^[A-Za-z\s]*$/;
        return regex.test(input);
    };

    const handleHostelNameChange = (e, isBoys) => {
        const value = e.target.value;
        if (validateAlphanumeric(value)) {
            if (isBoys) {
                setNewBoysHostelName(value);
            } else {
                setNewGirlsHostelName(value);
            }
        } else {
            toast.error("Hostel name must contain only alphabets.", {
                position: "top-center",
                autoClose: 3000,
                toastId: "empty-fields-error",
            });
        }
    };

    // const handleHostelChange = (e, isBoys) => {
    //     const file = e.target.files[0];
    //     if (!file) {
    //         toast.error("Please select a file.", {
    //             position: "top-center",
    //             autoClose: 3000,
    //         });
    //         return;
    //     }
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         const dataUrl = reader.result;
    //         if (isBoys) {
    //             setBoysHostelImage(dataUrl);
    //         } else {
    //             setGirlsHostelImage(dataUrl);
    //         }
    //     };
    //     reader.onerror = () => {
    //         toast.error("Failed to read file.", {
    //             position: "top-center",
    //             autoClose: 3000,
    //         });
    //     };
    //     reader.readAsDataURL(file);
    // };

    const isImageFile = (file) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return file && allowedImageTypes.includes(file.type);
      };

    const handleHostelChange = (e, isBoys) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select a file.", {
                position: "top-center",
                autoClose: 3000,
                toastId: "empty-fields-error",
            });
            return;
        }
        if (!isImageFile(file)) {
            toast.error("Please upload a valid image file (JPEG, PNG, GIF).", {
              position: "top-center",
              autoClose: 3000,
              toastId: "empty-fields-error",
            });
            e.target.value = ''; 
            return;
          }
          const reader = new FileReader();
         reader.onloadend = () => {
         setPhotoUrl(reader.result); // Preview the uploaded image
        };
      reader.readAsDataURL(file);
      setIsFileUploaded(true); // Mark the file as uploaded
      setIsCameraUsed(false);


        if (isBoys) {
            setBoysHostelImage(file); // Store file directly
        } else {
            setGirlsHostelImage(file); // Store file directly
        }
        setPhotoUrl(''); // Reset photoUrl if file is uploaded
       
        setErrorMessage('');
    };

    const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    };

    const submitHostelData = async (hostelData, isBoys) => {
        
        const name = capitalizeFirstLetter(hostelData.name);
        const address = capitalizeFirstLetter(hostelData.address);
        const hostelImage = hostelData.hostelImage;

        if (name.trim() === '' || address.trim() === '' || hostelImage.trim() === '') {
            toast.error("Hostel name, address, and image cannot be empty.", {
                position: "top-center",
                autoClose: 3000,
                toastId: "empty-fields-error",
            });
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        const newHostelRef = push(ref(database, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}`));

        const hostelDetails = {
            id: newHostelRef.key,
            name,
            address,
            hostelImage,
        };

        set(newHostelRef, hostelDetails)
            .then(() => {
                toast.success(`New ${isBoys ? "men's" : "women's"} hostel '${name}' added successfully.`, {
                    position: "top-center",
                    autoClose: 3000,
                    toastId: "empty-fields-error",
                });
                fetchData();
                if (isBoys) {
                    setNewBoysHostelName('');
                    setBoysHostelImage('');
                    setNewBoysHostelAddress('');
                    if (!selectedForms.women) {
                        handleClose();
                    }
                } else {
                    setNewGirlsHostelName('');
                    setGirlsHostelImage('');
                    setNewGirlsHostelAddress('');
                    handleClose();
                }
            })
            .catch(error => {
                toast.error("Failed to add new hostel: " + error.message, {
                    position: "top-center",
                    autoClose: 3000,
                    toastId: "empty-fields-error",
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleModalClose = (isBoys) => {
        if (isBoys) {
            setNewBoysHostelName('');
            setNewBoysHostelAddress('');
            setBoysHostelImage('');
        } else {
            setNewGirlsHostelName('');
            setNewGirlsHostelAddress('');
            setGirlsHostelImage('');
        }
        handleClose();
    };

    return (

        <div className='defaultPopUpComponent'>
            <div className='defaultPopUp'>
                {!currentForm && (
                    <div>
                        <div className='defaultPopUpHead'>
                            <text>Add Your Hostels</text>
                        </div>

                        <Form onSubmit={handleInitialSubmit}>
                            <div className='defaultPopUpText'>
                                <text>Please select your hostel types</text>
                            </div>
                            <Form.Check
                                type="checkbox"
                                label="Men"
                                name="men"
                                checked={selectedForms.men}
                                onChange={handleCheckboxChange}
                                className="custom-checkbox"
                            />
                            <Form.Check
                                type="checkbox"
                                label="Women"
                                name="women"
                                checked={selectedForms.women}
                                onChange={handleCheckboxChange}
                                className="custom-checkbox"
                            />
                            <button className='defaultPageButton' type="submit">Next</button>
                        </Form>
                    </div>
                )}
                {currentForm === 'men' && (
                    <div>
                        <div className='defaultPopUpHead'>
                            <text>Add Your Boys Hostel</text>
                        </div>
                        <Form onSubmit={handleMenFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="newBoysHostelName">{t("settings.hostelName")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newBoysHostelName"
                                    placeholder={t("settings.hostelName")}
                                    value={newBoysHostelName}
                                    onChange={(e) => handleHostelNameChange(e, true)}
                                    onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newBoysHostelAddress">{t("settings.hostelAddress")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newBoysHostelAddress"
                                    placeholder={t("settings.hostelAddress")}
                                    value={newBoysHostelAddress}
                                    onChange={(e) => setNewBoysHostelAddress(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Hostel Image" className="form-label">{t('settings.hostelImage')}</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => handleHostelChange(e, true)}
                                    disabled={isCameraUsed} />
                                { isMobile && !isFileUploaded && (
                                <div>
                                <p>{t('tenantsPage.or')}</p>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                <p>{t('tenantsPage.takePhoto')}</p>
                                <FontAwesomeIcon icon={faCamera} size="2x" onClick={takePicture} style={{marginTop:'-7px',paddingLeft:'30px'}}
                                disabled={isFileUploaded} 

                                />
                               {photoUrl && <img src={photoUrl} alt="Captured" style={{ marginTop: 50,marginRight:40, Width: '100px', height: '100px' }} />}
                                </div>
                                 </div>
                                 )}
                            </div>
                            <div className='mt-3 d-flex justify-content-between'>
                                <button
                                    // variant="primary"
                                    style={{ marginRight: '10px' }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className='defaultPageButton'
                                >
                                    {isSubmitting ? 'Adding...' : t("settings.addHostel")}
                                </button>

                            </div>
                        </Form>
                    </div>
                )}
                {currentForm === 'women' && (
                    <div>
                        <div className='defaultPopUpHead'>
                            <text>Add Your Womens Hostel</text>
                        </div>

                        <Form onSubmit={handleWomenFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="newGirlsHostelName">{t("settings.hostelName")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newGirlsHostelName"
                                    placeholder={t("settings.hostelName")}
                                    value={newGirlsHostelName}
                                    onChange={(e) => handleHostelNameChange(e, false)}
                                    onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newGirlsHostelAddress">{t("settings.hostelAddress")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newGirlsHostelAddress"
                                    placeholder={t("settings.hostelAddress")}
                                    value={newGirlsHostelAddress}
                                    onChange={(e) => setNewGirlsHostelAddress(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Hostel Image" className="form-label">{t('settings.hostelImage')}</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => handleHostelChange(e, false)}
                                    disabled={isCameraUsed}/>
                                { isMobile && !isFileUploaded && (
                                 <div>
                                 <p>{t('tenantsPage.or')}</p>
                                 <div style={{display:'flex',flexDirection:'row'}}>
                                 <p>{t('tenantsPage.takePhoto')}</p>
                                 <FontAwesomeIcon icon={faCamera} size="2x" onClick={takePicture} style={{marginTop:'-7px',paddingLeft:'30px'}}
                                 disabled={isFileUploaded} 

                                />
                              {photoUrl && <img src={photoUrl} alt="Captured" style={{ marginTop: 50,marginRight:40, Width: '100px', height: '100px' }} />}
                              </div>
                              </div>
                              )}
                            </div>
                            <div className='mt-3 d-flex justify-content-between'>
                                <button
                                    variant="primary"
                                    style={{ marginRight: '10px' }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className='defaultPageButton'
                                >
                                    {isSubmitting ? 'Adding...' : t("settings.addHostel")}
                                </button>
                            </div>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DefaultModal;
