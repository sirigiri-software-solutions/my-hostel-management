import React, { useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist/webpack';
import TenantsIcon from '../../images/Icons (4).png'
import SearchIcon from '../../images/Icons (9).png'
import Table from '../../Elements/Table'
import { useState, useEffect } from 'react'
import { push, ref } from "../../firebase/firebase";

import { onValue, remove, set, update } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next'
import { useData } from '../../ApiData/ContextProvider';
import '../TenantsBoys/TenantsBoys.css'
import './TenantsGirls.css';
import Spinner from '../../Elements/Spinner'
import { jsPDF } from "jspdf";

import imageCompression from 'browser-image-compression';

const TenantsGirls = () => {
  const { t } = useTranslation();
  const { activeGirlsHostel, userUid, activeGirlsHostelButtons, firebase, fetchData, girlsTenants, girlsRooms, entireHMAdata} = useData();
  const role = localStorage.getItem('role');
  const { database, storage } = firebase;

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRoom, setSelectedRoom] = useState('');
  const [bedOptions, setBedOptions] = useState([]);
  const [selectedBed, setSelectedBed] = useState('');
  const [dateOfJoin, setDateOfJoin] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [status, setStatus] = useState('occupied');
  // const [tenants, setTenants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [errors, setErrors] = useState({});
  const [tenantImage, setTenantImage] = useState(null);
  const [tenantImageUrl, setTenantImageUrl] = useState('');
  const [tenantId, setTenantId] = useState(null);
  const [tenantIdUrl, setTenantIdUrl] = useState('');
  // const [girlsRoomsData, setGirlsRoomsData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [userDetailsTenantPopup, setUserDetailsTenantsPopup] = useState(false);
  const [singleTenantDetails, setSingleTenantDetails] = useState(false);
  const [dueDateOfTenant, setDueDateOfTenant] = useState("");

  const [exTenants, setExTenants] = useState([]);
  const [showExTenants, setShowExTenants] = useState(false);
  const [singleTenantProofId, setSingleTenantProofId] = useState("");

  const [fileName, setFileName] = useState('');

  const [hasBike, setHasBike] = useState(false);
  const [bikeNumber, setBikeNumber] = useState('NA');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showBikeFilter, setShowBikeFilter] = useState(true);

  const tenantImageInputRef = useRef(null);
  const tenantProofIdRef = useRef(null);
  const [permnentAddress, setPermnentAddress] = useState("");
  const [bikeImage, setBikeImage] = useState(null);
  const [bikeImageUrl, setBikeImageUrl] = useState('');
  const [bikeImageField, setBikeImageField] = useState('');
  const [bikeRcImage, setBikeRcImage] = useState('');
  const [bikeRcImageUrl, setBikeRcImageUrl] = useState('');
  const [bikeRcImageField, setBikeRcImageField] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [singleTenanantBikeNum,setSingleTenantBikeNum] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


   

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     setBikeImage(reader.result);
  //   };
  //   reader.readAsDataURL(file);
  // };


  // const handleRcChange = (e) => {
  //   const file1 = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setBikeRcImage(reader.result);
  //   }
  //   reader.readAsDataURL(file1);

  // }

  const handleCheckboxChange = (e) => {
    setHasBike(e.target.value === 'yes');
    if (e.target.value === 'no') {
      setHasBike(false);
      setBikeNumber('NA');
    } else {
      setBikeNumber('');
    }
  };



  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showModal && (event.target.id === "exampleModalTenantsGirls" || event.key === "Escape")) {
        setShowModal(false);
        setTenantId('')
      }
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleOutsideClick)
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const popup = document.getElementById('userDetailsTenantPopupIdGirl');
      if (popup && (!popup.contains(event.target) || event.key === "Escape")) {
        setUserDetailsTenantsPopup(false);
        tenantPopupClose()
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleClickOutside)
  }, []);

  useEffect(() => {
    if (entireHMAdata && typeof entireHMAdata === 'object') {
      // Extract the values from the data object
      const boysAndGirlsData = Object.values(entireHMAdata);
  
      // Ensure we have data and that it contains 'boys'
      if (boysAndGirlsData.length > 0 && boysAndGirlsData[0].boys) {
        const boysData = Object.values(boysAndGirlsData[0].girls);
  
        // Check if there's data in boysData
        if (boysData.length > 0) {
          // const tenantsData = boysData[0].tenants || {};
          // const roomsData = boysData[0].rooms || {};
          const extenantsData = boysData[0].extenants || {};
  
          // Map the data to the required format
          // const loadedTenants = Object.entries(tenantsData).map(([key, value]) => ({
          //   id: key,
          //   ...value,
          // }));
  
          // const loadedRooms = Object.entries(roomsData).map(([key, value]) => ({
          //   id: key,
          //   ...value,
          // }));
  
          const loadedExTenants = Object.entries(extenantsData).map(([key, value]) => ({
            id: key,
            ...value,
          }));
  
          // Update the state with the processed data
          // setTenants(loadedTenants); 
          // setGirlsRooms(loadedRooms);
          setExTenants(loadedExTenants);
        }
      }
    }
  }, [entireHMAdata]);
  


  // useEffect(() => {
  //   const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants`);
  //   onValue(tenantsRef, snapshot => {
  //     const data = snapshot.val() || {};
  //     const loadedTenants = Object.entries(data).map(([key, value]) => ({
  //       id: key,
  //       ...value,
  //     }));
  //     setTenants(loadedTenants);
  //   });
  // }, [activeGirlsHostel]);


  // const [girlsRooms, setGirlsRooms] = useState([]);
  // useEffect(() => {
  //   const roomsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/rooms`);
  //   onValue(roomsRef, (snapshot) => {
  //     const data = snapshot.val();
  //     const loadedRooms = [];
  //     for (const key in data) {
  //       loadedRooms.push({
  //         id: key,
  //         ...data[key]
  //       });
  //     }
  //     setGirlsRooms(loadedRooms);
  //   });
  // }, [activeGirlsHostel]);



  useEffect(() => {
    if (selectedRoom) {
      const room = girlsRooms.find(room => room.roomNumber === selectedRoom);
      if (room) {
        const options = Array.from({ length: room.numberOfBeds }, (_, i) => i + 1);
        setBedOptions(options);
      }
    } else {
      setBedOptions([]);
    }
  }, [selectedRoom, girlsRooms]);



  const validate = () => {
    let tempErrors = {};
    tempErrors.selectedRoom = selectedRoom ? "" : t('errors.roomNumberRequired');
    tempErrors.selectedBed = selectedBed ? "" : t('errors.bedNumberRequired');
    tempErrors.dateOfJoin = dateOfJoin ? "" : t('errors.dateOfJoinRequired');


    const phoneRegexWithCountryCode = /^\+\d{12}$/;
    const phoneRegexWithoutCountryCode = /^\d{10}$/;

    if (!name) {
      tempErrors.name = t('errors.nameRequired');
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      tempErrors.name = t('errors.nameInvalid');
    }

    if (!mobileNo) {
      tempErrors.mobileNo = t('errors.mobileNumberRequired');
    } else if (!phoneRegexWithCountryCode.test(mobileNo) && !phoneRegexWithoutCountryCode.test(mobileNo)) {
      tempErrors.mobileNo = t('errors.mobileNumberInvalid');
    }
    if (!idNumber) {
      tempErrors.idNumber = idNumber ? "" : t('errors.idNumberRequired');
    } else if (idNumber.length < 6) {
      tempErrors.idNumber = 'Id should be min 6 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(idNumber)) {
      tempErrors.idNumber = 'It does not allow special charecters';
    }

    if (!emergencyContact) {
      tempErrors.emergencyContact = t('errors.emergencyContactRequired');
    } else if (!phoneRegexWithCountryCode.test(emergencyContact) && !phoneRegexWithoutCountryCode.test(emergencyContact)) {
      tempErrors.emergencyContact = t('errors.emergencyContactInvalid');
    }

    const isBedOccupied = girlsTenants.some(tenant => {
      return tenant.roomNo === selectedRoom && tenant.bedNo === selectedBed && tenant.status === "occupied" && tenant.id !== currentId;
    });

    if (isBedOccupied) {
      tempErrors.selectedBed = t('errors.bedAlreadyOccupied');
    }
    if (!tenantImage && !tenantImageUrl) {
      tempErrors.tenantImage = t('errors.tenantImageRequired');
    }
    if (hasBike) {
      if (!bikeNumber) {
        tempErrors.bikeNumber = 'Bike number required';
      } else {
        // Remove spaces for validation
        const bikeNumberWithoutSpaces = bikeNumber.replace(/\s+/g, '');
        
        if (!/^[A-Za-z0-9]{6,10}$/.test(bikeNumberWithoutSpaces)) {
          tempErrors.bikeNumber = 'Enter a valid bike number (letters and numbers only)';
        }
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).every((key) => tempErrors[key] === "");
  };

  

 

  // const handleTenantImageChange = (e) => {
  //   if (e.target.files[0]) {
  //     setTenantImage(e.target.files[0]);
  //   }
  // };
  // const handleTenantIdChange = (e) => {
  //   if (e.target.files[0]) {
  //     const file = e.target.files[0]
  //     setFileName(file.name)
  //     setTenantId(e.target.files[0]);
  //   }
  // };

  // const handleTenantBikeChange = (e) => {
  //   if (e.target.files[0]) {
  //     setBikeImage(e.target.files[0]);
  //   }
  // };
  // const handleTenantBikeRcChange = (e) => {
  //   if (e.target.files[0]) {
  //     setBikeRcImage(e.target.files[0]);
  //   }
  // };



  // const handleTenantIdChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setTenantId(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, // Compress to a maximum of 1 MB (adjust as needed)
      maxWidthOrHeight: 1920, 
      useWebWorker: true, // Use a web worker for better performance
      fileType: 'image/jpeg',
    };
  
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing the image:', error);
    }
  };

  const checkImage = (type) =>  {
    return type === "image/jpeg"
  }


  const handleTenantImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png'];
      if (validFormats.includes(file.type)) {
        setTenantImage(file);
        setErrorMessage(''); 
      } else {
        setErrorMessage('Please upload a valid image file (JPG, JPEG, PNG).');
        e.target.value = null; 
      }
    }
  };
  

  const handleTenantIdChange = (e) => {
    const file = e.target.files[0];

    if (file) {

      const validFormat = 'application/pdf';
      const maxSize = 1 * 1024 * 1024;


      if (file.type === validFormat) {

        if (file.size <= maxSize) {

          setFileName(file.name);
          setTenantId(file);
          setTenantId(file);
          setErrorMessage('');
        } else {

          setErrorMessage('The file size exceeds the 1 MB limit. Please upload a smaller file.');
        e.target.value = null;


       
        }
      } else {

        setErrorMessage('Please upload a valid  file.');


        e.target.value = null;
      }
    }
  };
  const handleTenantBikeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const validFormats = ['image/jpeg', 'image/png'];

     
      if (validFormats.includes(file.type)) {
        
        setBikeImage(file);
        setErrorMessage('');
        
      } else {
        setErrorMessage('Please upload a valid  file.');
        

        
        e.target.value = null;
      }
    }
  };

  const handleTenantBikeRcChange = (e) => {
    const file = e.target.files[0];

    if (file) {
     
      const validFormat = 'application/pdf';
      const maxSize = 1 * 1024 * 1024; 

      
      if (file.type === validFormat) {
        
        if (file.size <= maxSize) {
          
          setBikeRcImage(file);
          setErrorMessage('');
        } else {
          
          setErrorMessage('The file size exceeds the 1 MB limit. Please upload a smaller file.');
          e.target.value = null; 
        }
      } else {
        
        setErrorMessage('Please upload a valid  file.');
        e.target.value = null; 
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
        e.target.querySelector('button[type="submit"]').disabled = true;
        if (!validate()) {
            e.target.querySelector('button[type="submit"]').disabled = false;
            return;
        }
    } else {
        if (!validate()) return;
    }

    setShowModal(false);
    setLoading(true);

    // Helper function to upload a file and return its URL
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

    const tasks = [];

    if (tenantImage) {
        tasks.push(
            (async () => {
                let fileToUpload = tenantImage;
                console.log(tenantImage, "whatisComing");
                if (checkImage(tenantImage.type)) {
                    console.log("Executing compression for tenantImage");
                    try {
                        fileToUpload = await compressImage(tenantImage);
                    } catch (error) {
                        console.error("Error compressing tenant image:", error);
                    }
                }
                return uploadFile(fileToUpload, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/images/tenantImage/${tenantImage.name}`);
            })()
        );
    }
    if (tenantId) {
      tasks.push(
          (async () => {
              let fileToUpload = tenantId;

              if (checkImage(tenantId.type)) {
                  console.log("Executing compression for tenantId");
                  try {
                      fileToUpload = await compressImage(tenantId);
                  } catch (error) {
                      console.error("Error compressing tenant ID image:", error);
                  }
              }

              return uploadFile(fileToUpload, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/images/tenantId/${tenantId.name}`);
          })()
      );
  }

   

    if (bikeImage) {
        tasks.push(
            (async () => {
                let fileToUpload = bikeImage;
                if (checkImage(bikeImage.type)) {
                    console.log("Executing compression for bikeImage");
                    try {
                        fileToUpload = await compressImage(bikeImage);
                    } catch (error) {
                        console.error("Error compressing bike image:", error);
                    }
                }
                return uploadFile(fileToUpload, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/images/bikeImage/${bikeImage.name}`);
            })()
        );
    }

    if (bikeRcImage) {
        tasks.push(
            (async () => {
                let fileToUpload = bikeRcImage;

                if (checkImage(bikeRcImage.type)) {
                    console.log("Executing compression for bikeRcImage");
                    try {
                        fileToUpload = await compressImage(bikeRcImage);
                    } catch (error) {
                        console.error("Error compressing bike RC image:", error);
                    }
                }
                return uploadFile(fileToUpload, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/images/bikeRcImage/${bikeRcImage.name}`);
            })()
        );
    }

    try {
        const [imageUrlToUpdate, idUrlToUpdate, bikeUrlToUpdate, bikeRcUrlToUpdate] = await Promise.all(tasks);

        const tenantData = {
            roomNo: selectedRoom,
            bedNo: selectedBed,
            dateOfJoin,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            mobileNo,
            idNumber,
            emergencyContact,
            status,
            tenantImageUrl: imageUrlToUpdate || tenantImageUrl,
            tenantIdUrl: idUrlToUpdate || tenantIdUrl,
            bikeNumber,
            permnentAddress,
            bikeImageUrl: bikeUrlToUpdate || bikeImageUrl,
            bikeRcImageUrl: bikeRcUrlToUpdate || bikeRcImageUrl,
        };

        if (isEditing) {
            await update(ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/${currentId}`), tenantData);
            toast.success(t('toastMessages.tenantUpdated'), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchData()
        } else {
            await push(ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants`), tenantData);
            toast.success(t('toastMessages.tenantAddedSuccess'), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchData()
            e.target.querySelector('button[type="submit"]').disabled = false;
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(t('toastMessages.errorSubmitting') + error.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } finally {
        setLoading(false);
        resetForm();
        setErrors({});
    }
};


  const handleEdit = (tenant) => {
    console.log(tenant, "ttt")
    setSelectedRoom(tenant.roomNo);
    setSelectedBed(tenant.bedNo);
    setDateOfJoin(tenant.dateOfJoin);
    setName(tenant.name);
    setMobileNo(tenant.mobileNo);
    setIdNumber(tenant.idNumber);
    setEmergencyContact(tenant.emergencyContact);
    setStatus(tenant.status);
    setIsEditing(true);
    setCurrentId(tenant.id);

    if(tenantImage){
      setTenantImage(tenant.tenantImageUrl)
    } else {
      setTenantImageUrl(tenant.tenantImageUrl)
    }
    if(tenantId){
      setTenantId(tenant.tenantIdUrl || '');
    } else {
      setTenantIdUrl(tenant.tenantIdUrl)
    }
    if(bikeImage){
      setBikeImage(tenant.bikeImageUrl || '')
    } else {
      setBikeImageUrl(tenant.bikeImageUrl || '')
    }
    if(bikeRcImage){
      setBikeRcImage(tenant.bikeRcImageUrl || '')
    } else {
      setBikeRcImageUrl(tenant.bikeRcImageUrl || '')
    }

    setFileName(tenant.fileName || '');
    setHasBike(false);
    setShowModal(true);
    setBikeNumber(tenant.bikeNumber);
    setPermnentAddress(tenant.permnentAddress);
    if (tenant.bikeNumber === 'NA') {
      setHasBike(false);
      setBikeNumber(tenant.bikeNumber);
    }
    else {
      setHasBike(true);
      setBikeNumber(tenant.bikeNumber);
    }
  };

  const handleAddNew = () => {
    if (activeGirlsHostelButtons.length === 0) {
      toast.warn("You have not added any girls hostel, please add your first Hostel in Settings", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else {

      resetForm();
      setIsEditing(false);
      setShowModal(true);
      setUserDetailsTenantsPopup(false);
      setHasBike(false);
    }
  };


  const resetForm = () => {
    setSelectedRoom('');
    setSelectedBed('');
    setDateOfJoin('');
    setName('');
    setMobileNo('');
    setIdNumber('');
    setEmergencyContact('');
    setStatus('occupied');
    setIsEditing(false);
    setCurrentId('');
    setErrors({});
    setTenantImage(null);
    setTenantImageUrl('');
    setTenantId(null);
    setTenantIdUrl('');
    setBikeImage(null)
    setBikeImageUrl('')
    setBikeRcImage(null)
    setBikeRcImageUrl('')    
    setTenantId('')
    setBikeNumber('NA');
    setPermnentAddress('')
    tenantImageInputRef.current.value = null;
    tenantProofIdRef.current.value = null;
  };



  const columnsEx = [
    t('tenantsPage.sNo'),
    t('tenantsPage.image'),
    t('tenantsPage.name'),
    t('tenantsPage.id'),
    t('tenantsPage.mobileNo'),
    t('tenantsPage.roomBedNo'),
    t('tenantsPage.joiningDate'),
    t('tenantsPage.status'),
  ]
  if (role === "admin") {
    columnsEx.push(t('tenantsPage.actions'))
  }
  const columns = [
    t('tenantsPage.sNo'),
    t('tenantsPage.image'),
    t('tenantsPage.name'),
    t('tenantsPage.id'),
    t('tenantsPage.mobileNo'),
    t('tenantsPage.roomBedNo'),
    t('tenantsPage.joiningDate'),
    t('tenantsPage.bike'),
    t('tenantsPage.status'),
    t('tenantsPage.actions'),
  ]

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const rows = girlsTenants.map((tenant, index) => ({
    s_no: index + 1,
    image: tenant.tenantImageUrl,
    name: capitalizeFirstLetter(tenant.name),
    id: tenant.idNumber,
    mobile_no: tenant.mobileNo,
    room_bed_no: `${tenant.roomNo}/${tenant.bedNo}`,
    joining_date: tenant.dateOfJoin,
    bike_number: tenant.bikeNumber,
    status: capitalizeFirstLetter(tenant.status),
    actions: <button
      style={{ backgroundColor: '#ff8a00', padding: '4px', borderRadius: '5px', color: 'white', border: 'none', }}
      onClick={() => handleEdit(tenant)}
    >
      Edit
    </button>,
  }));


  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  }

  const onChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };


  const filteredRows = rows.filter((row) => {
    const hasSearchQueryMatch = Object.values(row).some((value) =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedStatus === 'YES') {
      return row.bike_number !== 'NA' && hasSearchQueryMatch;
    } else if (selectedStatus === 'NA') {
      return row.bike_number === 'NA' && hasSearchQueryMatch;
    } else {
      return hasSearchQueryMatch;
    }
  });


  const handleClosePopUp = () => {
    setShowModal(false);
    setTenantId('')
    setHasBike(false);
    setBikeNumber("");
    setFileName('');
  }

  const handleTentantRow = (tenant) => {

    setUserDetailsTenantsPopup(true);
    setShowModal(false);
    setSingleTenantDetails(tenant);



    const [roomNo, bedNo] = tenant.room_bed_no.split('/');
    const singleUserDueDate = girlsTenants.find(eachTenant =>
      eachTenant.name === tenant.name &&
      eachTenant.mobileNo === tenant.mobile_no &&
      eachTenant.roomNo === roomNo &&
      eachTenant.bedNo === bedNo
    );

    if(singleUserDueDate && singleUserDueDate.bikeNumber){
      setSingleTenantBikeNum(singleUserDueDate.bikeNumber)
    }


    if (singleUserDueDate && singleUserDueDate.rents) {
      const dataWithDueDate = Object.values(singleUserDueDate.rents);
      const dueDate = dataWithDueDate[0].dueDate;
      setDueDateOfTenant(dueDate);
    } else {
      console.log("Tenant with due date not found or due date is missing");
    }

    if (singleUserDueDate && singleUserDueDate.tenantIdUrl) {
      setSingleTenantProofId(singleUserDueDate.tenantIdUrl)
    }

    if (singleUserDueDate && singleUserDueDate.permnentAddress) {
      setTenantAddress(singleUserDueDate.permnentAddress);
    }
    else {
      setTenantAddress("");
    }
    if (singleUserDueDate && singleUserDueDate.bikeImageUrl) {
      setBikeImageField(singleUserDueDate.bikeImageUrl);

    }
    else {
      setBikeImageField("");
    }
    if (singleUserDueDate && singleUserDueDate.bikeRcImageUrl) {
      setBikeRcImageField(singleUserDueDate.bikeRcImageUrl);

    }
    else {
      setBikeRcImageField("");
    }

  };

  const tenantPopupClose = () => {
    setUserDetailsTenantsPopup(false);
    setDueDateOfTenant("")
    setSingleTenantProofId("")
  }

  const handleVacate = async (id) => {
    const tenantRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/${currentId}`);
    const newTenantRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/extenants/${currentId}`);
    onValue(tenantRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        await set(newTenantRef, data);
        await remove(tenantRef).then(() => {
          toast.success("Tenant Vacated", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchData();
        }).catch(error => {
          toast.error("Error Tenant Vacate " + error.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
        // fetchExTenants()
      }
    }, {
      onlyOnce: true
    });

    setShowModal(false);
    resetForm();
    setErrors({});

  };
  const fetchExTenants = () => {
    const exTenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/extenants`);
    onValue(exTenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedExTenants = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
      setExTenants(loadedExTenants);
    });
  };
  useEffect(() => { fetchExTenants() }, []);


  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tenantIdToDelete, setTenantIdToDelete] = useState(null);

  const handleExTenantDelete = (id, name) => {
    setShowConfirmation(true);
    setTenantIdToDelete(id);
    setName(name);
  };

  const handleConfirmDelete = async () => {
    const removeRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/extenants/${tenantIdToDelete}`);
    remove(removeRef)
      .then(() => {
        toast.success('Tenant Deleted', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        toast.error('Error Deleting Tenant: ' + error.message, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };


  const exTenantRows = exTenants.map((tenant, index) => ({
    s_no: index + 1,
    image: tenant.tenantImageUrl,
    name: capitalizeFirstLetter(tenant.name),
    id: tenant.idNumber,
    mobile_no: tenant.mobileNo,
    room_bed_no: `${tenant.roomNo}/${tenant.bedNo}`,
    joining_date: tenant.dateOfJoin,
    status: 'Vacated',
    actions: role === 'admin' ? (
      <button
        style={{
          backgroundColor: '#ff8a00',
          padding: '4px',
          borderRadius: '5px',
          color: 'white',
          border: 'none',
        }}
        onClick={() => handleExTenantDelete(tenant.id, tenant.name)}
      >
        Delete
      </button>
    ) : null,
  }));

  const showExTenantsData = () => {
    setShowExTenants(!showExTenants)
    setShowBikeFilter(!showBikeFilter);
  }
  const handleChange = (event) => {
    const value = event.target.checked ? 'YES' : '';
    onChangeStatus({ target: { value } });
  };

  const handleTenantFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  //handleGirlTenantDownload
  const isPDF = (fileData) => fileData.startsWith('data:application/pdf');
  const isImage = (fileData) => fileData.startsWith('data:image/');
  
  const pdfToImages = async (pdfUrl) => {
    const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
    const numPages = pdf.numPages;
    const images = [];
  
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
  
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
  
      const imgData = canvas.toDataURL('image/png');
      images.push({ imgData, width: viewport.width, height: viewport.height });
    }
  
    return images;
  };
  
  const calculateFitDimensions = (imgWidth, imgHeight, maxWidth, maxHeight) => {
    const widthRatio = maxWidth / imgWidth;
    const heightRatio = maxHeight / imgHeight;
    const ratio = Math.min(widthRatio, heightRatio);
    return {
      width: imgWidth * ratio,
      height: imgHeight * ratio
    };
  };
  
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };
  
  const handleGirlTenantDownload = async () => {
    const doc = new jsPDF();
  
    // Page 1: Tenant Details
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Tenant Details", 80, 10);
    console.log(singleTenantDetails,"girlsData")
    if (singleTenantDetails.image) {
      doc.addImage(singleTenantDetails.image, 'JPEG', 130, 24, 50, 50); // Adjust the size and position accordingly
    }
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Name: ", 20, 25);
  
    doc.setFont("helvetica", "normal");
    doc.text(singleTenantDetails.name, 34, 25);
  
    doc.setFont("helvetica", "bold");
    doc.text("Mobile No: ", 20, 35);
  
    doc.setFont("helvetica", "normal");
    doc.text(singleTenantDetails.mobile_no, 43, 35);
  
    doc.setFont("helvetica", "bold");
    doc.text("Proof ID: ", 20, 45);
  
    doc.setFont("helvetica", "normal");
    doc.text(singleTenantDetails.id, 40, 45);
  
    doc.setFont("helvetica", "bold");
    doc.text("Room/Bed No: ", 20, 55);
  
    doc.setFont("helvetica", "normal");
    doc.text(singleTenantDetails.room_bed_no, 50, 55);
  
    doc.setFont("helvetica", "bold");
    doc.text("Joining Date: ", 20, 65);
  
    doc.setFont("helvetica", "normal");
    doc.text(singleTenantDetails.joining_date, 48, 65);
  
    if (dueDateOfTenant) {
      doc.setFont("helvetica", "bold");
      doc.text("Due Date: ", 20, 75);
  
      doc.setFont("helvetica", "normal");
      doc.text(dueDateOfTenant, 40, 75);
    }
  
    if (bikeNumber) {
      doc.setFont("helvetica", "bold");
      doc.text("Bike Number: ", 20, 85);
  
      doc.setFont("helvetica", "normal");
      doc.text(singleTenanantBikeNum, 48, 85);
    }
  
    if (tenantAddress) {
      doc.setFont("helvetica", "bold");
      doc.text("Address: ", 20, 95);
  
      doc.setFont("helvetica", "normal");
      doc.text(tenantAddress, 39, 95);
    }
  
    // Add a new page
    doc.addPage();
  
    // Page 2: ID Proof Image or PDF
    if (singleTenantProofId) {
      if (isImage(singleTenantProofId)) {
        try {
          const img = await loadImage(singleTenantProofId);
          const { width, height } = calculateFitDimensions(img.width, img.height, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);
          doc.addImage(img.src, 'JPEG', 20, 20, width, height);
        } catch (error) {
          console.error('Error loading image:', error);
        }
        doc.addPage();
      } else if (isPDF(singleTenantProofId)) {
        const images = await pdfToImages(singleTenantProofId);
        images.forEach((img, index) => {
          if (index > 0) doc.addPage();
          const { width, height } = calculateFitDimensions(img.width, img.height, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);
          doc.addImage(img.imgData, 'PNG', 20, 20, width, height);
        });
        doc.addPage();
      }
    }
  
    // Page 3: Bike Image or PDF
    if (bikeImageField) {
      if (isImage(bikeImageField)) {
        try {
          const img = await loadImage(bikeImageField);
          const { width, height } = calculateFitDimensions(img.width, img.height, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);
          doc.addImage(img.src, 'JPEG', 20, 20, width, height);
        } catch (error) {
          console.error('Error loading image:', error);
        }
        doc.addPage();
      } else if (isPDF(bikeImageField)) {
        const images = await pdfToImages(bikeImageField);
        images.forEach((img, index) => {
          if (index > 0) doc.addPage();
          const { width, height } = calculateFitDimensions(img.width, img.height, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);
          doc.addImage(img.imgData, 'PNG', 20, 20, width, height);
        });
        doc.addPage();
      }
    }
  
    // Page 4: Bike RC Image or PDF
    if (bikeRcImageField) {
      if (isImage(bikeRcImageField)) {
        try {
          const img = await loadImage(bikeRcImageField);
          const { width, height } = calculateFitDimensions(img.width, img.height, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);
          doc.addImage(img.src, 'JPEG', 20, 20, width, height);
        } catch (error) {
          console.error('Error loading image:', error);
        }
      } else if (isPDF(bikeRcImageField)) {
        const images = await pdfToImages(bikeRcImageField);
        images.forEach((img, index) => {
          if (index > 0) doc.addPage();
          const { width, height } = calculateFitDimensions(img.width, img.height, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);
          doc.addImage(img.imgData, 'PNG', 20, 20, width, height);
        });
      }
    }
  
    // Save the PDF
    doc.save(`${singleTenantDetails.name}_Complete_Details.pdf`);
  };




  


  return (
    <>
      <div className="row d-flex flex-wrap align-items-center justify-content-between">
        <div className="col-12 col-md-4 d-flex align-items-center mr-5 mb-2">
          <div className='roomlogo-container'>
            <img src={TenantsIcon} alt="RoomsIcon" className='roomlogo' />
          </div>
          <h1 className='management-heading'>{t('tenantsPage.tenantsManagement')}</h1>
        </div>
        <div className="col-12 col-md-4 search-wrapper">
          <input type="text" placeholder={t('common.search')} className='search-input' value={searchQuery} onChange={onChangeInput} />
          <img src={SearchIcon} alt="search-icon" className='search-icon' />
        </div>
        <div className='col-12 col-md-4 d-flex mt-2 justify-content-md-end'>
          <div className='d-flex align-items-center text-center'>
            {showBikeFilter ? (<div className="toggle-container">
              <label className="toggle-label" htmlFor="status-toggleGirl1">{t('tenantsPage.bike')}</label>
              <input
                type="checkbox"
                id="status-toggleGirl1"
                className="toggle-checkbox"
                checked={selectedStatus === 'YES'}
                onChange={handleChange}
              />
              <label className="toggle-switch" htmlFor="status-toggleGirl1">
                <span className="toggle-text">No</span>
                <span className="toggle-text">Yes</span>
              </label>
            </div>) : null}
            <div className='d-flex justify-content-center align-items-center'>
              <div className={showExTenants ? "col-1 bedPageFilterDropdown" : "col-5 bedPageFilterDropdown"}>
                {showExTenants ? '' : <button id="tenantAddButton" type="button" class="add-button" onClick={() => { handleAddNew(); }} >
                  {t('dashboard.addTenants')}
                </button>}

              </div>
              <div className={showExTenants ? "col-8 bedPageFilterDropdown" : "col-4 bedPageFilterDropdown"}>
                {showExTenants ? <button type="button" id="presentTenantBtn" class="add-button text-center" onClick={showExTenantsData} >
                  {t('tenantsPage.presentTenants')}
                </button> : <button id="tenantVacateButton" type="button" class="add-button" onClick={showExTenantsData} >
                  {t('tenantsPage.vacated')}
                </button>}

              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {showExTenants ? <Table columns={columnsEx} rows={exTenantRows} onClickTentantRow={handleTentantRow} /> : <Table columns={columns} rows={filteredRows} onClickTentantRow={handleTentantRow} />}
      </div>

      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="exampleModalTenantsGirls" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">{t('dashboard.addTenants')}</h1>
              <button onClick={handleClosePopUp} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="container-fluid">

                <form class="row lg-10" onSubmit={handleSubmit}>
                  <div class="col-md-6">
                    <label htmlFor='roomNo' class="form-label">
                      {t('dashboard.roomNo')}
                    </label>
                    <select id="roomNo" class="form-select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} name="selectedRoom" onFocus={handleTenantFocus}>
                      <option value="">{t('dashboard.selectRoom')}</option>
                      {girlsRooms.map((room) => (
                        <option key={room.roomNumber} value={room.roomNumber}>
                          {room.roomNumber}
                        </option>
                      ))}
                    </select>

                    {errors.selectedRoom && <p style={{ color: 'red' }}>{errors.selectedRoom}</p>}
                  </div>

                  <div class="col-md-6">
                    <label htmlFor='bedNo' class="form-label">
                      {t('dashboard.bedNo')}
                    </label>
                    <select id="bedNo" class="form-select" value={selectedBed} onChange={(e) => setSelectedBed(e.target.value)} name="selectedBed" onFocus={handleTenantFocus}>
                      <option value="">{t('dashboard.selectBed')}</option>
                      {bedOptions.map(bedNumber => (
                        <option key={bedNumber} value={bedNumber}>
                          {bedNumber}
                        </option>
                      ))}
                    </select>

                    {errors.selectedBed && <p style={{ color: 'red' }}>{errors.selectedBed}</p>}
                  </div>

                  <div class="col-md-6">
                    <label htmlFor='dataofJoin' class="form-label">
                      {t('dashboard.dateOfJoin')}
                    </label>
                    <input id="dataofJoin" class="form-control" type="date" value={dateOfJoin} onChange={(e) => setDateOfJoin(e.target.value)} name="dateOfJoin" onFocus={handleTenantFocus} />

                    {errors.dateOfJoin && <p style={{ color: 'red' }}>{errors.dateOfJoin}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantName' class="form-label">
                      {t('dashboard.name')}
                    </label>
                    <input id="tenantName" class="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')} name="name" onFocus={handleTenantFocus} />

                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                  </div>

                  <div class="col-md-6">
                    <label htmlFor='tenantMobileNo' class="form-label">
                      {t('dashboard.mobileNo')}
                    </label>
                    <input id="tenantMobileNo" class="form-control" type="text" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9 ]/g, '')} name="mobileNo" onFocus={handleTenantFocus} />

                    {errors.mobileNo && <p style={{ color: 'red' }}>{errors.mobileNo}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantIdNum' class="form-label">
                      {t('dashboard.idNumber')}
                    </label>
                    <input id="tenantIdNum" class="form-control" type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')} name="idNumber" onFocus={handleTenantFocus} />

                    {errors.idNumber && <p style={{ color: 'red' }}>{errors.idNumber}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantEmergency' class="form-label">
                      {t('dashboard.emergencyContact')}
                    </label>
                    <input id="tenantEmergency" class="form-control" type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9 ]/g, '')} name="emergencyContact" onFocus={handleTenantFocus} />

                    {errors.emergencyContact && <p style={{ color: 'red' }}>{errors.emergencyContact}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantStatus' class="form-label">
                      {t('dashboard.status')}
                    </label>
                    <select id="tenantStatus" class="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="occupied">Occupied</option>
                      <option value="unoccupied">Unoccupied</option>
                    </select>

                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantUpload' class="form-label">
                      {t('dashboard.uploadImage')}
                    </label>
                    {isEditing && tenantImageUrl && (
                      <div>
                        <img src={ tenantImageUrl} alt="Current Tenant" style={{ width: "100px", height: "100px" }} />
                        <p>{t('dashboard.currentImage')}</p>
                      </div>
                    )}
                    <input ref={tenantImageInputRef} id="tenantUpload" class="form-control" type="file" accept=".jpg, .jpeg, .png" onChange={handleTenantImageChange} required />
                    {errors.tenantImage && <p style={{ color: 'red' }}>{errors.tenantImage}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantUploadId' class="form-label">
                      {t('dashboard.uploadId')}:
                    </label>
                    {isEditing && tenantId && (
                      <div>
                        <p>{fileName}</p>
                      </div>
                    )}
                    <input ref={tenantProofIdRef} id="tenantUploadId" class="form-control" type="file"  accept=".jpg, .jpeg, .png, .pdf" onChange={handleTenantIdChange} />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    

                  </div>
                  <div className='col-md-12'>
                    <label htmlFor="permnentAddress" className='form-label'>{t('tenantsPage.PermanentAddress')}</label>
                    <textarea name='permnentAddress' value={permnentAddress} onChange={(e) => setPermnentAddress(e.target.value)} placeholder='Enter Address' className='form-control' />
                  </div>


                  <div className="col-12 col-sm-12 col-md-12" style={{ marginTop: '20px' }}>
                    <label className='col-sm-12 col-md-4' htmlFor="bikeCheck">{t('dashboard.doYouHaveBike')}</label>
                    <input
                      type="radio"
                      className="Radio"
                      id="bikeCheck"
                      name="bike"
                      value="yes"
                      onClick={handleCheckboxChange}
                      checked={hasBike}
                    />
                    <label htmlFor='bikeCheck' className='bike'>{t('dashboard.yes')}</label>
                    <input
                      type="radio"
                      id="bikeCheck1"
                      name="bike"
                      value="no"
                      onClick={handleCheckboxChange}
                      checked={!hasBike}
                      style={{ marginLeft: '30px' }}
                    />
                    <label htmlFor='bikeCheck1' className='bike'>{t('dashboard.no')}</label>
                  </div>

                  {hasBike && (
                    <div className='bikeField' >
                      <label class="bikenumber" htmlFor="bikeNumber" >{t('dashboard.bikeNumber')}</label>
                      <input
                        type="text"
                        id="bikeNumber"

                        className='form-control'
                        placeholder="Enter number plate ID"
                        value={bikeNumber}
                        onChange={(event) => setBikeNumber(event.target.value)}
                        onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')}
                        style={{ borderRadius: '5px', borderColor: 'beize', outline: 'none', marginTop: '0', borderStyle: 'solid', borderWidth: '1px', borderHeight: '40px' }}
                      />
                      {errors.bikeNumber && <p style={{ color: 'red' }}>{errors.bikeNumber}</p>}
                    </div>
                  )}

                  {hasBike && (
                    <>
                      <div className="col-md-6">
                        <label htmlFor="bikeimage" className="form-label">{t('tenantsPage.BikePic')}</label>
                        <input type="file" className="form-control" accept=".jpg, .jpeg, .png"  onChange={handleTenantBikeChange} />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="bikeRc" className="form-label">{t('tenantsPage.BikeRc')}</label>
                        <input type="file" className="form-control"accept=".jpg, .jpeg, .png, .pdf" onChange={handleTenantBikeRcChange} />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        
                      </div>
                    </>
                  )}

                  <div className='col-12 text-center mt-3'>
                    {isEditing ? (
                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <button type="button" className="btn btn-warning" onClick={handleSubmit}>{t('tenantsPage.updateTenant')}</button>
                        <button type="button" className="btn btn-warning" onClick={handleVacate}>{t('tenantsPage.vacateTenant')}</button>
                      </div>
                    ) : (
                      <button className="btn btn-warning" type="submit">{t('dashboard.addTenants')}</button>
                    )}
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </div>

      {loading && <Spinner />}

      {userDetailsTenantPopup &&
        <div id="userDetailsTenantPopupIdGirl" className='userDetailsTenantPopup'>
          <div className='tenants-dialog-container'>
            <h1 className="tenants-popup-heading">{t('tenantsPage.tenantDetails')} </h1>
            <div className='tenants-popup-mainContainer'>
              <div className='tenants-profile-container'>
                <img src={singleTenantDetails.image} alt="profile" className='tenants-popup-profile' />
              </div>
              <div className='tenants-popup-detailsContainer'>
                <p><strong>{t('tenantsPage.name')} :</strong> {singleTenantDetails.name}</p>
                <p><strong>{t('tenantsPage.mobileNo')} :</strong> {singleTenantDetails.mobile_no}</p>
                <p><strong>{t('tenantsPage.proofID')} :</strong> {singleTenantDetails.id}</p>
                <p><strong>{t('tenantsPage.roomBedNo')}:</strong> {singleTenantDetails.room_bed_no}</p>
                <p><strong>{t('tenantsPage.joiningDate')} :</strong> {singleTenantDetails.joining_date}</p>
                <p><strong>{t('tenantsPage.dueDate')} :</strong> {dueDateOfTenant}</p>
                <p><strong>{t('tenantsPage.idProof')} :</strong>


                  {singleTenantProofId ? (
                    <a className='downloadPdfText' href={singleTenantProofId} download> <FaDownload /> {t('tenantsPage.downloadPdf')}</a>
                  ) : (
                    <span className='NotUploadedText'>{t('tenantsPage.notUploaded')}</span>
                  )}
                </p>
                <p><strong>{t('tenantsPage.PermanentAddress')}</strong>{tenantAddress}</p>

                <p><strong>{t('tenantsPage.BikePic')}</strong>
                  {bikeImageField ? (
                    <a className="downloadPdfText" href={bikeImageField} download> <FaDownload />{t('tenantsPage.DownloadPic')}</a>
                  ) : (
                    <span className="NotUploadedText">{t('tenantsPage.NotUploaded')}</span>
                  )}
                </p>
                <p><strong>{t('tenantsPage.BikeRc')}</strong>
                  {bikeRcImageField ? (
                    <a className="downloadPdfText" href={bikeRcImageField} download> <FaDownload />{t('tenantsPage.DownloadRc')}</a>
                  ) : (
                    <span className="NotUploadedText">{t('tenantsPage.NotUploaded')}</span>
                  )}
                </p>
              </div>
            </div>
            <div className='popup-tenants-closeBtn'>
              <button className='btn btn-warning' onClick={tenantPopupClose}>{t('tenantsPage.close')}</button>
              <button id="downloadPdfBtn" className='btn btn-warning' onClick={handleGirlTenantDownload}><FaDownload /> {t('tenantsPage.downloadPdf')}</button>
            </div>
          </div>
        </div>
      }

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className='confirmation-card'>
            <p style={{ paddingBottom: '0px', marginBottom: '7px', fontSize: '20px' }}>{t('tenantsPage.confirmationMessage')} <span style={{ color: 'red' }}>{name}</span>?</p>
            <p style={{ color: 'red', fontSize: '15px', textAlign: 'center' }}>{t('tenantsPage.note')}</p>
            <div className="buttons">
              <button onClick={handleConfirmDelete}>{t('tenantsPage.yes')}</button>
              <button onClick={handleCancelDelete}>{t('tenantsPage.no')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TenantsGirls