import React, { useEffect, useState } from 'react';
import { useData } from '../../ApiData/ContextProvider';
import { set, ref, remove, onValue, update, get, push } from 'firebase/database';

import { toast } from 'react-toastify';
import './Hostels.css';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RoomsIcon from '../../images/Icons (2).png';
import Table from '../../Elements/Table';
import './Hostels.css'

const Hostels = ({ onTabSelect, activeTab }) => {
  const { t } = useTranslation();
  const { userUid, firebase } = useData();
  const { database } = firebase;
  const [isEditing, setIsEditing] = useState(null);
  const [hostels, setHostels] = useState({ boys: [], girls: [] });
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [hostelToDelete, setHostelToDelete] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  // =================================
  const [newBoysHostelName, setNewBoysHostelName] = useState('');
  const [newBoysHostelAddress, setNewBoysHostelAddress] = useState('');
  const [newGirlsHostelName, setNewGirlsHostelName] = useState('');
  const [newGirlsHostelAddress, setNewGirlsHostelAddress] = useState('');

  const [isBoysModalOpen, setIsBoysModalOpen] = useState(false);
  const [isGirlsModalOpen, setIsGirlsModalOpen] = useState(false);
  const [boysHostels, setBoysHostels] = useState([]);
  const [girlsHostels, setGirlsHostels] = useState([]);
  const [boysHostelImage, setBoysHostelImage] = useState('');
  const [girlsHostelImage, setGirlsHostelImage] = useState('');

  useEffect(() => {
    const boysRef = ref(database, `Hostel/${userUid}/boys`);
    const girlsRef = ref(database, `Hostel/${userUid}/girls`);

    const fetchBoysHostels = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          address: data[key].address,
          hostelImage: data[key].hostelImage,
        }));
        setHostels(prev => ({ ...prev, boys: formattedData }));
      } else {
        setHostels(prev => ({ ...prev, boys: [] }));
      }
    });

    const fetchGirlsHostels = onValue(girlsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          address: data[key].address,
          hostelImage: data[key].hostelImage,
        }));
        setHostels(prev => ({ ...prev, girls: formattedData }));
      } else {
        setHostels(prev => ({ ...prev, girls: [] }));
      }
    });

    return () => {
      fetchBoysHostels();
      fetchGirlsHostels();
    };
  }, [userUid, database]);

  const submitHostelEdit = async (e) => {
    e.preventDefault();
    const { id, name, address, hostelImage, isBoys } = isEditing;
    const basePath = `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${id}`;
    let updatedImageUrl = hostelImage;

    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        updatedImageUrl = reader.result;
        const updateData = {
          name, 
          address, 
          hostelImage: updatedImageUrl, 
        };
        const hostelRef = ref(database, basePath);
        update(hostelRef, updateData)
          .then(() => {
            toast.success("Hostel updated successfully.", {
              position: "top-center",
              autoClose: 3000,
            });
            cancelEdit();
          })
          .catch(error => {
            toast.error("Failed to update hostel: " + error.message, {
              position: "top-center",
              autoClose: 3000,
            });
          });
      };
      reader.readAsDataURL(selectedImage);
    } else {
      const updateData = {
        name, 
        address, 
      };

      const hostelRef = ref(database, basePath);
      update(hostelRef, updateData)
        .then(() => {
          toast.success("Hostel updated successfully.", {
            position: "top-center",
            autoClose: 3000,
          });
          cancelEdit();
        })
        .catch(error => {
          toast.error("Failed to update hostel: " + error.message, {
            position: "top-center",
            autoClose: 3000,
          });
        });
    }
  };





  const deleteHostel = (id) => {
    const isBoys = activeTab === 'boys';
    setIsDeleteConfirmationOpen(true);
    setHostelToDelete({ isBoys, id });
  };

  const confirmDeleteHostel = () => {
    const { isBoys, id } = hostelToDelete;
    const path = `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${id}`;
    remove(ref(database, path))
      .then(() => {
        toast.success("Hostel deleted successfully.", {
          position: "top-center",
          autoClose: 3000,
        });
        setIsDeleteConfirmationOpen(false);
        setHostelToDelete(null);
      })
      .catch(error => {
        toast.error("Failed to delete hostel: " + error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  const cancelDeleteHostel = () => {
    setIsDeleteConfirmationOpen(false);
    setHostelToDelete(null);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setSelectedImage(null);
  };

  const startEdit = (id, name, address, hostelImage, isBoys) => {
    setIsEditing({ id, name, originalName: name, address, hostelImage, isBoys });
    setSelectedImage(null); 
  };

  const handleEditChange = (field, value) => {
    setIsEditing(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const getHostelColumns = () => [
    t('tenantsPage.image'),
    t("hostels.name"),
    t("hostels.address"),
    t("hostels.actions"),
    t("hostels.deleteData")
  ];

  const getHostelRows = (hostels, isBoys) => hostels.map(hostel => {
    return {
      image: hostel.hostelImage,
      name: hostel.name,
      address: hostel.address,
      edit: <button
        style={{ backgroundColor: '#ff8a00', padding: '4px', borderRadius: '5px', color: 'white', border: 'none' }}
        onClick={() => startEdit(hostel.id, hostel.name, hostel.address, hostel.hostelImage, isBoys)}
      >Edit</button>,
      delete: <button
        style={{ backgroundColor: "#ff8a00", padding: '4px', borderRadius: '5px', color: 'white', border: 'none' }}
        onClick={() => deleteHostel(hostel.id)}
      >Delete</button>
    };
  });

  const handleTabSelect = (tab) => {
    onTabSelect(tab);
  };

  // ================================


  useEffect(() => {
    if (userUid) {
      // Fetch boys hostels
      const boysHostelsRef = ref(database, `Hostel/${userUid}/boys`);
      onValue(boysHostelsRef, (snapshot) => {
        const hostels = [];
        snapshot.forEach((childSnapshot) => {
          hostels.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setBoysHostels(hostels);
      });

      // Fetch girls hostels
      const girlsHostelsRef = ref(database, `Hostel/${userUid}/girls`);
      onValue(girlsHostelsRef, (snapshot) => {
        const hostels = [];
        snapshot.forEach((childSnapshot) => {
          hostels.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setGirlsHostels(hostels);
      });
    }
  }, []);

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
    <div className='container'>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className=" mb-3 tabs-nav">
        <Tab eventKey="boys" title={t('dashboard.mens')}>
          <div className=" row d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-12  col-md-4 d-flex justify-content-between align-items-center mr-5 mb-2 w-100">
              <div className='d-flex align-items-center'>
                <div className='roomlogo-container'>
                  <img src={RoomsIcon} alt="RoomsIcon" className='roomlogo' />
                </div>
                <text className='management-heading2'>{t('roomsPage.HostelsManagement')}</text>
              </div>
              <div>
                <button className="addHostelBtn" onClick={() => setIsBoysModalOpen(true)}>{t("settings.addHostel")}</button>
              </div>
            </div>
          </div>
          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(hostels.boys, true)}
              onClickTentantRow={(row) => console.log(row)}
            />
          </div>
        </Tab>
        <Tab eventKey="girls" title={t('dashboard.womens')}>
          <div className="row d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-12 col-md-4 d-flex justify-content-between align-items-center mr-5 mb-2 w-100">
              <div className='d-flex align-items-center'>
                <div className='roomlogo-container'>
                  <img src={RoomsIcon} alt="RoomsIcon" className='roomlogo' />
                </div>
                <text className='management-heading2'>{t('roomsPage.HostelsManagement')}</text>
              </div>
              <div>
                <button className="addHostelBtn" onClick={() => setIsGirlsModalOpen(true)}>{t("settings.addHostel")}</button>
              </div>
            </div>
          </div>

          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(hostels.girls, false)}
              onClickTentantRow={(row) => console.log(row)}
            />
          </div>
        </Tab>
      </Tabs>
      <Modal show={isEditing !== null} onHide={cancelEdit}>
        <Modal.Header closeButton>
          <Modal.Title>{t("hostels.editHostel")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing && (
            <div>
              <p>{t("hostels.editName")}</p>
              <input
                type="text"
                value={isEditing.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                className="edit-hostel-input"
              /><br />
              <p>{t("hostels.editAddress")}</p>
              <input
                type="text"
                value={isEditing.address}
                onChange={(e) => handleEditChange('address', e.target.value)}
                className="edit-hostel-input"
              />

              <div >
                <label htmlFor="Hostel Image" className="form-label">{t('settings.hostelImage')}</label>
                <input type="file" className="form-control" onChange={handleImageChange} />
                <img src={isEditing.hostelImage} alt='hostel image' style={{ width: '100px', borderRadius: '8px', margin: '10px 0' }} />
              </div>
            </div>
          )}

          <div className='mt-3 d-flex justify-content-between'>
            <Button variant="primary" onClick={submitHostelEdit}>
              {t("hostels.save")}
            </Button>
            <Button variant="secondary" onClick={cancelEdit}>
              {t("hostels.cancel")}
            </Button>

          </div>
        </Modal.Body>
      </Modal>
      <Modal show={isDeleteConfirmationOpen} onHide={cancelDeleteHostel}>
        <Modal.Header closeButton>
          <Modal.Title>{t("hostels.confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("hostels.confirmMsg")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteHostel}>
            {t("hostels.cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDeleteHostel}>
            {t("hostels.delete")}
          </Button>
        </Modal.Footer>
      </Modal>

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
              <Button variant="primary" style={{ marginRight: '10px' }} type="submit">{t("settings.addHostel")}</Button>
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
              <Button variant="primary" type="submit" style={{ marginRight: '10px' }}>{t("settings.addHostel")}</Button>
              <Button variant="secondary" onClick={() => handleModalClose(false)}>{t("settings.close")}</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Hostels;