import { push, ref, set } from 'firebase/database';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useData } from '../../ApiData/ContextProvider';
import './MainPage.css'
const DefaultModal = ({ show, handleClose }) => {
    const { firebase, userUid } = useData();
    const { t } = useTranslation();
    const [selectedForms, setSelectedForms] = useState({
        men: false,
        women: false,
    });
    const [currentForm, setCurrentForm] = useState('');
    const [mensFormData, setMensFormData] = useState(null);

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

    const handleMenFormSubmit = (e) => {
        e.preventDefault();
        const mensData = {
            name: newBoysHostelName,
            address: newBoysHostelAddress,
            hostelImage: boysHostelImage,
        };
        setMensFormData(mensData);
        if (selectedForms.women) {
            setCurrentForm('women');
        } else {
            submitHostelData(mensData, true);
        }
    };

    const handleWomenFormSubmit = (e) => {
        e.preventDefault();
        const womensData = {
            name: newGirlsHostelName,
            address: newGirlsHostelAddress,
            hostelImage: girlsHostelImage,
        };

        if (mensFormData) {
            submitHostelData(mensFormData, true);
        }
        submitHostelData(womensData, false);
    };

    const [newBoysHostelName, setNewBoysHostelName] = useState('');
    const [newBoysHostelAddress, setNewBoysHostelAddress] = useState('');
    const [newGirlsHostelName, setNewGirlsHostelName] = useState('');
    const [newGirlsHostelAddress, setNewGirlsHostelAddress] = useState('');
    const [boysHostelImage, setBoysHostelImage] = useState('');
    const [girlsHostelImage, setGirlsHostelImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { database } = firebase;

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
            });
        }
    };

    const handleHostelChange = (e, isBoys) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select a file.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            if (isBoys) {
                setBoysHostelImage(dataUrl);
            } else {
                setGirlsHostelImage(dataUrl);
            }
        };
        reader.onerror = () => {
            toast.error("Failed to read file.", {
                position: "top-center",
                autoClose: 3000,
            });
        };
        reader.readAsDataURL(file);
    };

    const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    };

    const submitHostelData = (hostelData, isBoys) => {
        setIsSubmitting(true);
        const name = capitalizeFirstLetter(hostelData.name);
        const address = capitalizeFirstLetter(hostelData.address);
        const hostelImage = hostelData.hostelImage;

        if (name.trim() === '' || address.trim() === '' || hostelImage.trim() === '') {
            toast.error("Hostel name, address, and image cannot be empty.", {
                position: "top-center",
                autoClose: 3000,
            });
            setIsSubmitting(false);
            return;
        }

        const newHostelRef = push(ref(database, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}`));
        const hostelDetails = {
            id: newHostelRef.key,
            name,
            address,
            hostelImage,
        };

        set(newHostelRef, hostelDetails)
            .then(() => {
                toast.success(`New ${isBoys ? 'boys' : 'girls'} hostel '${name}' added successfully.`, {
                    position: "top-center",
                    autoClose: 3000,
                });
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
                                />
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
                                />
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
