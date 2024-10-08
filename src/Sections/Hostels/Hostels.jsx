import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../../ApiData/ContextProvider';
import { set, ref, remove, onValue, update, get, push } from 'firebase/database';

import { toast } from 'react-toastify';
import './Hostels.css';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RoomsIcon from '../../images/Icons (2).png';
import Table from '../../Elements/Table';
import './Hostels.css'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { useLocation, useNavigate } from 'react-router-dom';

const Hostels = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userUid, firebase, activeFlag,  changeActiveFlag, activeBoysHostelButtons, activeGirlsHostelButtons,fetchData } = useData();
  const { database, storage } = firebase;
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
  const [hostelImageUrl, setHostelImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [btnDisabledStatus,setBtnDisabledStatus] = useState(false)
  

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

const submitHostelEdit = async (e) => {
  e.preventDefault();
  setBtnDisabledStatus(true)
  const { id, name, address, hostelImage, isBoys } = isEditing;

  if (name.trim() === '' || address.trim() === '' || !hostelImage) {
    toast.error(t('hostels.hostelDetailsCannotBeEmpty'), {
      position: "top-center",
      autoClose: 3000,
      toastId: "empty-fields-error",
    });
    setBtnDisabledStatus(false)
    return;
  }
 
  const basePath = `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${id}`;
  let updatedImageUrl = hostelImage;
  let compressedImage = await compressImage(selectedImage)
  if (compressedImage) {
    const imageRef = storageRef(storage, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${name}`);
    try {
      const snapshot = await uploadBytes(imageRef, compressedImage);
      updatedImageUrl = await getDownloadURL(snapshot.ref);
    } catch (error) {
      toast.error(t('hostels.errorUploadingImage') + error.message, {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty-fields-error",
      });
      return;
    }
  }

  const updateData = { name, address, hostelImage: updatedImageUrl };
  const hostelRef = ref(database, basePath);

  update(hostelRef, updateData)
    .then(() => {
      toast.success(t('hostels.hostelUpdatedSuccessfully'), {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty-fields-error",
      });
      cancelEdit();
      fetchData();
      setBtnDisabledStatus(false)
    })
    .catch(error => {
      toast.error(t('hostels.failedToUpdateHostel')+ error.message, {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty-fields-error",
      });
      setBtnDisabledStatus(false)
    });
  
};

  const deleteHostel = (id) => {
    const isBoys = activeFlag === 'boys';
    setIsDeleteConfirmationOpen(true);
    window.history.pushState(null, null,location.pathname);
    console.log(isBoys,id,"hostelPage")
    setHostelToDelete((prev) =>({...prev, isBoys, id }));
    console.log("deletedStatus","hostelPage2")
  };

  const confirmDeleteHostel =async () => {
    setBtnDisabledStatus(true)
    console.log(hostelToDelete,"hostelPage")
    try{
      const { isBoys, id } = hostelToDelete;
    
      try{
        const path = `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${id}`;
        const hostelSnapshot = await get(ref(database,path));
        if(hostelSnapshot.exists()){
          const hostelData = hostelSnapshot.val();
          console.log(hostelData,"inHostelPage")
          const hasTenants = hostelData.tenants && Object.keys(hostelData.tenants).length > 0;
          const hasExTenants = hostelData.extenants && Object.keys(hostelData.extenants).length > 0;
          if(!hasTenants && !hasExTenants){
            await remove(ref(database, path))
       
            toast.success(t('hostels.hostelDeletedSuccessfully'), {
              position: "top-center",
              autoClose: 3000,
              toastId: "empty-fields-error",
            });
            fetchData();
            setIsDeleteConfirmationOpen(false);
            
            setHostelToDelete(null);
            setBtnDisabledStatus(false)
          }else{
            toast.error(t('hostels.hostelCannotBeDeleted'),{
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              toastId: "empty-fields-error",
            })
            setIsDeleteConfirmationOpen(false);
            
            setHostelToDelete(null);
            setBtnDisabledStatus(false)
          }
          navigate(-1)
        }
        
      }catch(error){
        const path = `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${id}`;
  
        await remove(ref(database, path))
       
          toast.success(t('hostels.hostelDeletedSuccessfully'), {
            position: "top-center",
            autoClose: 3000,
            toastId: "empty-fields-error",
          });
          setIsDeleteConfirmationOpen(false);
          navigate(-1)
          setHostelToDelete(null);
          setBtnDisabledStatus(false)
      }
     
    }catch(err){
      setBtnDisabledStatus(false)
    }
    
  };

  const cancelDeleteHostel = () => {
    setBtnDisabledStatus(true)
    setIsDeleteConfirmationOpen(false);
    setHostelToDelete(null);
    console.log("deletedStatus","hostelPage1")
    navigate(-1);
    setBtnDisabledStatus(false);
  };

  

  const cancelEdit = () => {
    setBtnDisabledStatus(true)
    setIsEditing(null);
    setSelectedImage(null);
    navigate(-1)
  //  setTimeout(()=>{
    setBtnDisabledStatus(false);
  //  },1000)
  };

  const [crossBtnStatus,setCrossbtnStatus] = useState(false)

  const closePopupForm = () => {
    console.log("called CloseBtn")
    setCrossbtnStatus(true)
    setIsEditing(null);
    setSelectedImage(null);
    navigate(-1)
    setTimeout(()=>{
      setCrossbtnStatus(false)
    },1000)
  }

  const startEdit = (id, name, address, hostelImage, isBoys) => {
    setIsEditing({ id, name, originalName: name, address, hostelImage, isBoys });
    setSelectedImage(null); 
    window.history.pushState(null, null, location.pathname);
  };

  const handleEditChange = (field, value) => {
    setIsEditing(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];

      if (allowedTypes.includes(file.type)) {
        setSelectedImage(file);
        setErrorMessage(''); // Clear error message
      } else {
        setErrorMessage("Only JPEG and PNG images are allowed.");
        e.target.value = ''; // Clear the file input
        setSelectedImage(null); // Clear selected image
      }
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

    changeActiveFlag(tab)
  };

  console.log(handleTabSelect , "aaaff")
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
      toast.error(t('hostels.hostelNameMustContainAlphabets'), {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty-fields-error",
      });
    }
  };

 
 

  const isImageFile = (file) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return file && allowedImageTypes.includes(file.type);
  };

  const handleHostelChange = (e, isBoys) => {
    const file = e.target.files[0];
    
    if (!file) {
        // No file selected
        toast.error(t('hostels.pleaseSelectAFile'), {
            position: "top-center",
            autoClose: 3000,
            toastId: "empty-fields-error",
        });
        return;
    }
    if (!isImageFile(file)) {
      toast.error(t('hostels.pleaseUploadValidImage'), {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty-fields-error",
      });
      e.target.value = ''; // Clear the input
      return;
    }

    const validFormats = ['image/jpeg', 'image/png'];
    if (validFormats.includes(file.type)) {
        
        if (isBoys) {
            setBoysHostelImage(file); 
        } else {
            setGirlsHostelImage(file); 
        }
        setErrorMessage(''); 
    } else {
        
        setErrorMessage('Please upload a valid image file (JPG, JPEG, PNG).');
        e.target.value = null; 
    }
};


  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewHostel = async (e, isBoys) => {
    e.preventDefault();
    
    const name = isBoys ? capitalizeFirstLetter(newBoysHostelName) : capitalizeFirstLetter(newGirlsHostelName);
    const address = isBoys ? capitalizeFirstLetter(newBoysHostelAddress) : capitalizeFirstLetter(newGirlsHostelAddress);
    const hostelImage = isBoys ? boysHostelImage : girlsHostelImage;

    if (name.trim() === '' || address.trim() === '' || !hostelImage) {
      toast.error(t('hostels.hostelDetailsCannotBeEmpty'), {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty-fields-error",
      });
      return;
    }
    setIsSubmitting(true);
    let hostelImageUrlToUpdate = hostelImageUrl;
    // console.log(isBoys ? boysHostelImage : girlsHostelImage, "kkk")
    const hostelImageFile = isBoys ? boysHostelImage : girlsHostelImage;
    let compressedHostelImageFile = await compressImage(hostelImageFile);
    if (compressedHostelImageFile) {
      const imageRef = storageRef(storage, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${name}`);
      try {
        const snapshot = await uploadBytes(imageRef, compressedHostelImageFile);
        hostelImageUrlToUpdate = await getDownloadURL(snapshot.ref);
        console.log(hostelImageUrlToUpdate, "hostelImageUrlToUpdate")
      } catch (error) {
        console.error("Error uploading tenant image:", error);
      }
    }
    

    // Create a new reference with a unique ID
    const newHostelRef = push(ref(database, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}`));
    const hostelDetails = {
      id: newHostelRef.key, // Store the unique key if needed
      name,
      address,
      hostelImage: hostelImageUrlToUpdate
    };

    set(newHostelRef, hostelDetails)
      .then(() => {
        toast.success(`New ${isBoys ? "men's" : "women's"} hostel '${name}' added successfully.`, {
          position: "top-center",
          autoClose: 3000,
          toastId: "empty-fields-error",
        });
        fetchData()
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
        navigate(-1)
      })
      .catch(error => {
        toast.error(t('hostels.failedToAddNewHostel') + error.message, {
          position: "top-center",
          autoClose: 3000,
          toastId: "empty-fields-error",
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
    navigate(-1)
  };
  useEffect(() => {
    const handlePopState = () => {
      if (isBoysModalOpen) {
        setIsBoysModalOpen(false); // Close the popup
      }
      if(isGirlsModalOpen){
        setIsGirlsModalOpen(false)
      }
      if(isDeleteConfirmationOpen){
        setIsDeleteConfirmationOpen(false)
      }
      if(isEditing !== null){
        setIsEditing(null)
      }
    };

    window.addEventListener('popstate', handlePopState);


  }, [isEditing,isBoysModalOpen,isGirlsModalOpen,isDeleteConfirmationOpen, location.pathname]);


  return (
    <div className='h-100'>
    <div className='container'>
      <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className=" mb-3 tabs-nav custom-tabs">
        {
          activeBoysHostelButtons.length > 0 ?
          <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
          <div className=" row d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-6  col-md-6 d-flex align-items-center mr-5 mb-2">
             
                <div className='roomlogo-container'>
                  <img src={RoomsIcon} alt="RoomsIcon" className='roomlogo' />
                </div>
                <text className='management-heading2'>{t('roomsPage.HostelsManagement')}</text>
            </div>
            <div className='col-6 col-md-6 d-flex justify-content-end'>
                <button className="add-button" onClick={() => {setIsBoysModalOpen(true); window.history.pushState(null, null, location.pathname);}}>{t("settings.addHostel")}</button>
              </div>
          </div>
          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(hostels.boys, true)}
              onClickTentantRow={(row) => console.log(row)}
            />
          </div>
        </Tab> : ''
        }
        
        {
          activeGirlsHostelButtons.length > 0 ?
          <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
          <div className="row d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-6 col-md-6 d-flex align-items-center mr-5 mb-2">
    
                <div className='roomlogo-container'>
                  <img src={RoomsIcon} alt="RoomsIcon" className='roomlogo' />
                </div>
                <text className='management-heading2'>{t('roomsPage.HostelsManagement')}</text>
              
             
            </div>
            <div className='col-6 col-md-6 d-flex justify-content-end'>
                <button className="add-button" onClick={() => {setIsGirlsModalOpen(true); window.history.pushState(null, null,location.pathname);}}>{t("settings.addHostel")}</button>
              </div>
          </div>

          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(hostels.girls, false)}
              onClickTentantRow={(row) => console.log(row)}
            />
          </div>
        </Tab>: ''
        }
        
      </Tabs>
      <Modal show={isEditing !== null} >
        <Modal.Header >
          <Modal.Title>{t("hostels.editHostel")}</Modal.Title>
          <Button disabled={crossBtnStatus} variant="close" aria-label="Close" onClick={closePopupForm} />
        </Modal.Header>
        <Modal.Body>
          {isEditing && (
            <div>
              <p>{t("hostels.editName")}</p>
              <input
                type="text"
                value={isEditing.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')}
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
                <input type="file" className="form-control" accept="image/jpeg, image/png" onChange={handleImageChange} />
                {errorMessage && <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>}
                <img src={isEditing.hostelImage} alt='hostel image' style={{ width: '100px', borderRadius: '8px', margin: '10px 0' }} />
              </div>
            </div>
          )}

          <div className='mt-3 d-flex justify-content-between'>
            <Button disabled={btnDisabledStatus} variant="primary" onClick={submitHostelEdit}>
              {t("hostels.save")}
            </Button>
            <Button disabled={btnDisabledStatus} variant="secondary" onClick={cancelEdit}>
              {t("hostels.cancel")}
            </Button>

          </div>
        </Modal.Body>
      </Modal>
      <Modal show={isDeleteConfirmationOpen} >
        <Modal.Header >
          <Modal.Title>{t("hostels.confirmDelete")}</Modal.Title>
          <Button disabled={crossBtnStatus} variant="close" aria-label="Close" onClick={closePopupForm} />
        </Modal.Header>
        <Modal.Body>{t("hostels.confirmMsg")}</Modal.Body>
        <Modal.Footer>
          <Button disabled={btnDisabledStatus}  variant="secondary" onClick={cancelDeleteHostel}>
            {t("hostels.cancel")}
          </Button>
          <Button  disabled={btnDisabledStatus} variant="danger" onClick={confirmDeleteHostel}>
            {t("hostels.delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================== */}

      <Modal show={isBoysModalOpen} >
        <Modal.Header>
          <Modal.Title>{t("settings.addboysHostel")}</Modal.Title>
          <Button disabled={crossBtnStatus} variant="close" aria-label="Close" onClick={closePopupForm} />
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
              <input type="file" className="form-control" accept=".jpg, .jpeg, .png"  onChange={(e) => handleHostelChange(e, true)} />
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
            <div className='mt-3 d-flex justify-content-between'>
              <Button variant="primary" style={{ marginRight: '10px' }} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : t("settings.addHostel")}</Button>
              <Button variant="secondary" onClick={() => handleModalClose(true)}>{t("settings.close")}</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={isGirlsModalOpen} >
        <Modal.Header >
          <Modal.Title>{t("settings.addGirlsHostel")}</Modal.Title>
          <Button disabled={crossBtnStatus} variant="close" aria-label="Close" onClick={closePopupForm} />
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
              <input type="file" className="form-control"  accept=".jpg, .jpeg, .png"  onChange={(e) => handleHostelChange(e, false)} />
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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

export default Hostels;