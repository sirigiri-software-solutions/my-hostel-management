import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguageSwitch from '../../LanguageSwitch';
import { useTranslation } from 'react-i18next';
import './settings.css';
import { Modal, Button } from 'react-bootstrap';

const Settings = () => {
  const [newBoysHostelName, setNewBoysHostelName] = useState('');
  const [newBoysHostelAddress, setNewBoysHostelAddress] = useState('');
  const [newGirlsHostelName, setNewGirlsHostelName] = useState('');
  const [newGirlsHostelAddress, setNewGirlsHostelAddress] = useState('');
  const { t } = useTranslation();
  const [isBoysModalOpen, setIsBoysModalOpen] = useState(false);
  const [isGirlsModalOpen, setIsGirlsModalOpen] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

  const addNewHostel = (e, isBoys) => {
    e.preventDefault();
    const name = isBoys ? capitalizeFirstLetter(newBoysHostelName) : capitalizeFirstLetter(newGirlsHostelName);
    const address = isBoys ? capitalizeFirstLetter(newBoysHostelAddress) : capitalizeFirstLetter(newGirlsHostelAddress);

    if (name.trim() === '' || address.trim() === '') {
      toast.error("Hostel name and address cannot be empty.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const hostelRef = ref(database, `Hostel/${isBoys ? 'boys' : 'girls'}/${name}`);
    const hostelDetails = { name, address };

    set(hostelRef, hostelDetails)
      .then(() => {
        toast.success(`New ${isBoys ? 'boys' : 'girls'} hostel '${name}' added successfully.`, {
          position: "top-center",
          autoClose: 3000,
        });
        if (isBoys) {
          setNewBoysHostelName('');
          setNewBoysHostelAddress('');
          setIsBoysModalOpen(false);
        } else {
          setNewGirlsHostelName('');
          setNewGirlsHostelAddress('');
          setIsGirlsModalOpen(false);
        }
      })
      .catch(error => {
        toast.error("Failed to add new hostel: " + error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="settings">
      <h1 className='settingsPageHeading'>{t('menuItems.settings')}</h1>
      <div className="settings-top">
        <div className="language-switch-section">
          <label className="languageLabel" htmlFor="language-selector">{t("settings.languages")} </label>
          <LanguageSwitch id="language-selector" />
        </div>
        <div className="settingPageHostelSection">
          <div className="add-hostel-form">
              <h4 className="settingPageSideHeading">{t("settings.boysHostels")}</h4>
              <button className="addHostelBtn" onClick={() => setIsBoysModalOpen(true)}>{t("settings.addHostel")}</button>
          </div>
          <div className="add-hostel-form">
              <h4 className="settingPageSideHeading">{t("settings.girlsHostels")}</h4>
              <button className="addHostelBtn" onClick={() => setIsGirlsModalOpen(true)}>{t("settings.addHostel")}</button>
          </div>
        </div>
      </div>

      <Modal show={isBoysModalOpen} onHide={() => setIsBoysModalOpen(false)}>
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
                onChange={(e) => setNewBoysHostelName(e.target.value)}
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
            <div className='settingsBtn'>
            <Button variant="primary"style={{marginRight:'10px' }} type="submit">{t("settings.addHostel")}</Button>
            <Button variant="secondary" onClick={() => setIsBoysModalOpen(false)}>{t("settings.close")}</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={isGirlsModalOpen} onHide={() => setIsGirlsModalOpen(false)}>
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
                onChange={(e) => setNewGirlsHostelName(e.target.value)}
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
            <Button variant="primary" type="submit" style={{marginRight:'10px' }}>{t("settings.addHostel")}</Button>
            <Button variant="secondary" onClick={() => setIsGirlsModalOpen(false)}>{t("settings.close")}</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Settings;

