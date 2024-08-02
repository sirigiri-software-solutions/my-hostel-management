import React, { useEffect, useState } from 'react';


import 'react-toastify/dist/ReactToastify.css';
import LanguageSwitch from '../../LanguageSwitch';
import { useTranslation } from 'react-i18next';
import './settings.css';
import { push, ref, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { useData } from '../../ApiData/ContextProvider';
import { Button, Modal } from 'react-bootstrap';
import Reports from './Reports';


const Settings = () => {

  const { t } = useTranslation();

  const { userUid, firebase, activeBoysHostelButtons, activeGirlsHostelButtons, hostelData , girlsTenantsData, boysTenantsData} = useData();
  const { database } = firebase;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBoysHostelName, setNewBoysHostelName] = useState('');
  const [newBoysHostelAddress, setNewBoysHostelAddress] = useState('');
  const [newGirlsHostelName, setNewGirlsHostelName] = useState('');
  const [newGirlsHostelAddress, setNewGirlsHostelAddress] = useState('');

  const [boysHostelImage, setBoysHostelImage] = useState('');
  const [girlsHostelImage, setGirlsHostelImage] = useState('');
  const [isBoysModalOpen, setIsBoysModalOpen] = useState(false);
  const [isGirlsModalOpen, setIsGirlsModalOpen] = useState(false);
  const [tenantsData, setTenantsData] = useState()

console.log(hostelData, "dataaa") 

  const capitalizeFirstLetter = (string) => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

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

  const addNewHostel = (e, isBoys) => {
    e.preventDefault();
    setIsSubmitting(true);
    const name = isBoys ? capitalizeFirstLetter(newBoysHostelName) : capitalizeFirstLetter(newGirlsHostelName);
    const address = isBoys ? capitalizeFirstLetter(newBoysHostelAddress) : capitalizeFirstLetter(newGirlsHostelAddress);
    const hostelImage = isBoys ? boysHostelImage : girlsHostelImage;

    if (name.trim() === '' || address.trim() === '' || hostelImage.trim() === '') {
      toast.error("Hostel name, address and image cannot be empty.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Create a new reference with a unique ID
    const newHostelRef = push(ref(database, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}`));
    const hostelDetails = {
      id: newHostelRef.key, // Store the unique key if needed
      name,
      address,
      hostelImage
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
          setIsBoysModalOpen(false);
        } else {
          setNewGirlsHostelName('');
          setGirlsHostelImage('');
          setNewGirlsHostelAddress('');
          setIsGirlsModalOpen(false);
        }
      })
      .catch(error => {
        toast.error("Failed to add new hostel: " + error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setIsSubmitting(false); // Reset isSubmitting to false when submission completes
      });
  };
  const handleModalClose = (isBoys) => {
    if (isBoys) {
      setNewBoysHostelName('');
      setNewBoysHostelAddress('');
      setBoysHostelImage('');
      setIsBoysModalOpen(false);
    } else {
      setNewGirlsHostelName('');
      setNewGirlsHostelAddress('');
      setGirlsHostelImage('');
      setIsGirlsModalOpen(false);
    }
  };


  return (
    <div className="settings">
      <h1 className='settingsPageHeading'>{t('menuItems.settings')}</h1>
      <div className="settings-top">
        <div className="language-switch-section">
          <label className="languageLabel" htmlFor="language-selector">{t("settings.languages")} </label>
          <LanguageSwitch id="language-selector" />
        </div>
        <div>
        <Reports/>
      </div>
      </div>
      <div className='mt-4'>
        {
          activeBoysHostelButtons.length > 0 ? '' :
            <div className='d-flex  align-items-center'>
              <h5 className="addHostelTextBtn">Add Your Boys Hostel</h5><button className="addHostelBtn" onClick={() => setIsBoysModalOpen(true)}>{t("settings.addHostel")}</button>
            </div>
        }
        {
          activeGirlsHostelButtons.length > 0 ? '' :
            <div className='d-flex  align-items-center'>
              <h5 className="addHostelTextBtn">Add Your Girls Hostel</h5><button className="addHostelBtn" onClick={() => setIsGirlsModalOpen(true)}>{t("settings.addHostel")}</button>
            </div>
        }

        {/* ================== */}

        <Modal show={isBoysModalOpen} onHide={() => handleModalClose(true)}>
          <Modal.Header closeButton>
            <Modal.Title>{t("settings.addboysHostel")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => addNewHostel(e, true)}>
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
                <input type="file" className="form-control" onChange={(e) => handleHostelChange(e, true)} />
              </div>
              <div className='mt-3 d-flex justify-content-between'>
                <Button variant="primary" style={{ marginRight: '10px' }} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : t("settings.addHostel")}</Button>
                <Button variant="secondary" onClick={() => handleModalClose(true)}>{t("settings.close")}</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        <Modal show={isGirlsModalOpen} onHide={() => handleModalClose(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{t("settings.addGirlsHostel")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => addNewHostel(e, false)}>
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
                <input type="file" className="form-control" onChange={(e) => handleHostelChange(e, false)} />
              </div>
              <div className='mt-3 d-flex justify-content-between'>
                <Button variant="primary" type="submit" style={{ marginRight: '10px' }} disabled={isSubmitting}>{isSubmitting ? 'Adding...' : t("settings.addHostel")}</Button>
                <Button variant="secondary" onClick={() => handleModalClose(false)}>{t("settings.close")}</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
     
    </div>
  );
};

export default Settings;
