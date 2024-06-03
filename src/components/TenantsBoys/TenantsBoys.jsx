import React, { useEffect, useRef } from 'react'
import TenantsIcon from '../../images/Icons (4).png'
import SearchIcon from '../../images/Icons (9).png'
import Table from '../../Elements/Table'
import ImageIcon from '../../images/Icons (10).png'
import { useState, useContext } from 'react'
import { database, push, ref, storage } from "../../firebase";
import './TenantsBoys.css';
import { DataContext } from '../../ApiData/ContextProvider'
import { FetchData } from '../../ApiData/FetchData'
import { onValue, remove, set, update } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next'
import { useData } from '../../ApiData/ContextProvider';

const TenantsBoys = () => {
  const { t } = useTranslation();
  const { activeBoysHostel } = useData();
  const role = localStorage.getItem('role');


  const [selectedRoom, setSelectedRoom] = useState('');
  const [bedOptions, setBedOptions] = useState([]);
  const [selectedBed, setSelectedBed] = useState('');
  const [dateOfJoin, setDateOfJoin] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [status, setStatus] = useState('occupied');
  const [tenants, setTenants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [errors, setErrors] = useState({});
  const [tenantImage, setTenantImage] = useState(null);
  const [tenantImageUrl, setTenantImageUrl] = useState(''); // For the image URL from Firebase Storage
  const [tenantId, setTenantId] = useState(null);
  const [tenantIdUrl, setTenantIdUrl] = useState('');
  // const imageInputRef = useRef(null);
  // const idInputRef = useRef(null);
  // const [boysRoomsData, setBoysRoomsData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [userDetailsTenantPopup, setUserDetailsTenantsPopup] = useState(false);
  const [singleTenantDetails, setSingleTenantDetails] = useState(false);
  const [dueDateOfTenant, setDueDateOfTenant] = useState("");
  const [tenantAddress, setTenantAddress] = useState("");
  const [singleTenantProofId, setSingleTenantProofId] = useState("");

  const [fileName, setFileName] = useState('');

  const [boysRooms, setBoysRooms] = useState([]);
  const [exTenants, setExTenants] = useState([]);
  const [showExTenants, setShowExTenants] = useState(false);
  const [hasBike, setHasBike] = useState(false);
  const [bikeNumber, setBikeNumber] = useState('NA');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showBikeFilter,setShowBikeFilter] = useState(true);

  const [permnentAddress, setPermnentAddress] = useState("");

  const tenantImageInputRef = useRef(null);
  const tenantProofIdRef = useRef(null);
  const [bikeImage, setBikeImage] = useState(null);
  const [bikeImageField, setBikeImageField] = useState('');
  const [bikeRcImage,setBikeRcImage]=useState('');
  const [bikeRcImageField,setBikeRcImageField]=useState('');
  
  


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    const reader = new FileReader();

    reader.onload = () => {
      // Once the file is loaded, set the image in state
      setBikeImage(reader.result);
      
    };
    // console.log(file,"file created");
    

    reader.readAsDataURL(file);
    console.log(file,"file created");
  };
  
  
  const handleRcChange=(e)=>{
    const file1=e.target.files[0];
    const reader=new FileReader();
    reader.onload=()=>{
      setBikeRcImage(reader.result);
    }
    reader.readAsDataURL(file1);
    console.log(file1,"file1 created");

  }
  // const uploadImage = async () => {
  //   if (bikeImage) {
  //     const imageRef = storageRef(storage, `Hostel/boys/tenants/images/bikeImage/${bikeImage.name}`);
  //     try {
  //       const snapshot = await uploadBytes(imageRef, bikeImage);
  //       const bikeimageUrl = await getDownloadURL(snapshot.ref);
  //       setBikeImageField(bikeimageUrl);

  //       // Optionally, send the URL to your backend for further processing
  //       // For demonstration purposes, let's just log the image URL
  //       console.log("Image URL:", bikeImageField);
  //     } catch (error) {
  //       console.error("Error uploading bike image:", error);
  //     }
  //   }
  // };
  // uploadImage();

  const handleCheckboxChange = (e) => {
    setHasBike(e.target.value == 'yes');
    if (e.target.value == 'no') {
      setHasBike(false);
      setBikeNumber('NA');
    }
    // } 
    else {
      setBikeNumber('');
    }
  };
  // handleTentantRow

  useEffect(() => {
    const handleOutsideClick = (event) => {
      console.log("Triggering")
      if (showModal && (event.target.id === "exampleModalTenantsBoys" || event.key === "Escape")) {
        setShowModal(false);
        setTenantIdUrl('')
      }
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleOutsideClick);

  }, [showModal]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      const popup = document.getElementById('userDetailsTenantPopupIdBoy');
      if (popup && (!popup.contains(event.target) || event.key === "Escape")) {
        setUserDetailsTenantsPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleClickOutside)
  }, []);


 


  useEffect(() => {
    const roomsRef = ref(database, `Hostel/boys/${activeBoysHostel}/rooms`);
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRooms = [];
      for (const key in data) {
        loadedRooms.push({
          id: key,
          ...data[key]
        });
      }
      setBoysRooms(loadedRooms);
    });
    // Fetch tenants
  }, [activeBoysHostel]);

  useEffect(() => {
    if (selectedRoom) {
      const room = boysRooms.find(room => room.roomNumber === selectedRoom);
      if (room) {
        const options = Array.from({ length: room.numberOfBeds }, (_, i) => i + 1);
        setBedOptions(options);
      }
    } else {
      setBedOptions([]);
    }

  }, [selectedRoom, boysRooms]);


  // ================================
  const { data } = useContext(DataContext);
  const [boysTenants, setBoysTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // let boysTenants = null;
  if (data != null && data) {

    // console.log(data && data, "fetchApidata")
  }

  useEffect(() => {
    const tenantsRef = ref(database, `Hostel/boys/${activeBoysHostel}/tenants`);
    onValue(tenantsRef, snapshot => {
      const data = snapshot.val() || {};
      const loadedTenants = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTenants(loadedTenants);
    });
  }, [activeBoysHostel]);
 

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        if (data) {
          const boysTenantsData = Object.values(data.boys.tenants);
          setBoysTenants(boysTenantsData);
        } else {
          const apiData = await FetchData();
          const boysTenantsData = Object.values(apiData.boys.tenants);
          setBoysTenants(boysTenantsData)
        }
      } catch (error) {
        console.error('Error fetching tenants data:', error);
      }
    };
    fetchDataFromAPI();

  }, [data]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.selectedRoom = selectedRoom ? "" :  t('errors.roomNumberRequired');
    tempErrors.selectedBed = selectedBed ? "" : t('errors.bedNumberRequired');
    tempErrors.dateOfJoin = dateOfJoin ? "" : t('errors.dateOfJoinRequired');
    if (!name) {
      tempErrors.name = t('errors.nameRequired');
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      tempErrors.name =  t('errors.nameInvalid');
    }
    // Validate mobile number
    if (!mobileNo) {
      tempErrors.mobileNo = t('errors.mobileNumberRequired');
    } else if (!/^\d{10,13}$/.test(mobileNo)) {
      tempErrors.mobileNo = t('errors.mobileNumberInvalid');
    }
    tempErrors.idNumber = idNumber ? "" : t('errors.idNumberRequired');
    // Validate emergency contact
    if (!emergencyContact) {
      tempErrors.emergencyContact = t('errors.emergencyContactRequired');
    } else if (!/^\d{10,13}$/.test(emergencyContact)) {
      tempErrors.emergencyContact = t('errors.emergencyContactInvalid');
    }

    // Check if the selected bed is already occupied
    const isBedOccupied = tenants.some(tenant => {
      return tenant.roomNo === selectedRoom && tenant.bedNo === selectedBed && tenant.status === "occupied" && tenant.id !== currentId;
    });

    if (isBedOccupied) {
      tempErrors.selectedBed = t('errors.bedAlreadyOccupied');
    }
    if (!tenantImage && !tenantImageUrl) {
      tempErrors.tenantImage = t('errors.tenantImageRequired');
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).every((key) => tempErrors[key] === "");
  };

  const handleTenantImageChange = (e) => {

    // tryin to compress code

    // previous code
    if (e.target.files[0]) {
      setTenantImage(e.target.files[0]);
    }
  };
  const handleTenantIdChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      console.log(file, "filename");
      setFileName(file.name)
      setTenantId(e.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      e.target.querySelector('button[type="submit"]').disabled = true;
      if (!validate()) {
        e.target.querySelector('button[type="submit"]').disabled = false;
        return
      };
    } else {
      if (!validate()) return;
    }


    let imageUrlToUpdate = tenantImageUrl;

    if (tenantImage) {
      const imageRef = storageRef(storage, `Hostel/boys/${activeBoysHostel}/tenants/images/tenantImage/${tenantImage.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, tenantImage);
        imageUrlToUpdate = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading tenant image:", error);

      }
    }



    let idUrlToUpdate = tenantIdUrl;
    if (tenantId) {
      const imageRef = storageRef(storage, `Hostel/boys/${activeBoysHostel}/tenants/images/tenantId/${tenantId.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, tenantId);
        idUrlToUpdate = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading tenant image:", error);
      }
    }

    // const uploadBikeImage = async (file) => {
    //   const storage = getStorage(); // Initialize Firebase storage
    //   const imageRef = storageRef(storage, `Hostel/boys/tenants/images/bikeImage/${file.name}`);

    //   try {
    //     const snapshot = await uploadBytes(imageRef, file);
    //     const downloadURL = await getDownloadURL(snapshot.ref);
    //     return downloadURL;
    //   } catch (error) {
    //     console.error("Error uploading bike image:", error);
    //     return null;
    //   }
    // };
    // const saveTenantData = async () => {
    //   let bikeImageUrl = '';

    //   if (bikeImage) {
    //     bikeImageUrl = await uploadBikeImage(bikeImage);
    //     setBikeImageField(bikeImageUrl); // Update the state with the URL
    //   }


    // const uploadFile = async (file) => {
    //   // This is a placeholder function. Replace with your actual file upload logic.
    //   const formData = new FormData();
    //   formData.append('file', file);

    //   const response = await fetch('your-upload-url', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   const data = await response.json();
    //   return data.fileUrl; // Adjust based on your response structure
    // };
    // const bikeImageUrl = bikeImage ? await uploadFile(bikeImage) : '';

    // const saveTenantData = async () => {
    //   let bikeImageUrl = '';

    //   if (bikeImage) {
    //     bikeImageUrl = await uploadFile(bikeImage);
    //     setBikeImageField(bikeImageUrl); // Update the state with the URL
    //   }


    const tenantData = {
      roomNo: selectedRoom,
      bedNo: selectedBed,
      dateOfJoin,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      mobileNo,
      idNumber,
      emergencyContact,
      status,
      tenantImageUrl: imageUrlToUpdate,
      tenantIdUrl: idUrlToUpdate,
      bikeNumber,
      // fileName: fileName,
      permnentAddress,
      bikeImage,
      bikeRcImage
      //  bikeImage,
      // tenantIdUrl,
    };

    console.log(permnentAddress, "addressWhileSubmiting")
    console.log(tenantData, "addressWhileSubmiting1")

    if (isEditing) {
      await update(ref(database, `Hostel/boys/${activeBoysHostel}/tenants/${currentId}`), tenantData).then(() => {
        toast.success(t('toastMessages.tenantUpdated'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      }).catch(error => {
        toast.error(t('toastMessages.errorUpdatingTenant') + error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    } else {
      await push(ref(database, `Hostel/boys/${activeBoysHostel}/tenants`), tenantData).then(() => {
        toast.success(t('toastMessages.tenantAddedSuccess'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        e.target.querySelector('button[type="submit"]').disabled = false;
      }).catch(error => {
        toast.error(t('toastMessages.errorAddingTenant') + error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    }
    setShowModal(false);

    resetForm();
    setErrors({});
  };

  const handleEdit = (tenant) => {
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
    setTenantImageUrl(tenant.tenantImageUrl);
    setTenantIdUrl(tenant.tenantIdUrl || '');
    setBikeNumber("");
    setHasBike(false);
    setFileName(tenant.fileName|| '');
    setShowModal(true);
    setBikeNumber(tenant.bikeNumber);
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
    // Reset any previous data
    resetForm();
    // Set modal for a new entry
    setIsEditing(false);
    // Open the modal
    setShowModal(true);
    setUserDetailsTenantsPopup(false);
    setTenantIdUrl('')
    setHasBike(false);

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
    setTenantId(null);
    setTenantImageUrl('');
    setTenantIdUrl('');
    setBikeNumber('NA');
    tenantImageInputRef.current.value = null;
    tenantProofIdRef.current.value = null;

  };

  // Filter tenants based on search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
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
  if(role === "admin"){
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


  const rows = tenants.map((tenant, index) => ({
    s_no: index + 1,
    image: tenant.tenantImageUrl,
    name: tenant.name, // Assuming 'name' property exists in the fetched data
    id: tenant.idNumber, // Assuming 'id' property exists in the fetched data
    mobile_no: tenant.mobileNo, // Assuming 'mobile_no' property exists in the fetched data
    room_bed_no: `${tenant.roomNo}/${tenant.bedNo}`, // Assuming 'room_bed_no' property exists in the fetched data
    joining_date: tenant.dateOfJoin,
    bike_number: tenant.bikeNumber ? tenant.bikeNumber : '-',
    status: capitalizeFirstLetter(tenant.status),
    actions: <button
      style={{ backgroundColor: '#ff8a00', padding: '4px', borderRadius: '5px', color: 'white', border: 'none', }}
      onClick={() => { handleEdit(tenant); }}
    // data-bs-toggle="modal"
    // data-bs-target="#exampleModalTenantsBoys"
    >
      Edit
    </button>
  }));

  

  // const filteredRows = rows.filter((row) => {
  //   const hasSearchQueryMatch = Object.values(row).some((value) =>
  //     value.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  
  //   if (selectedStatus === 'Yes') {
  //     return row.bike_number !== 'NA' && hasSearchQueryMatch;
  //   } else if (selectedStatus === 'NA') {
  //     return row.bike_number === 'NA' && hasSearchQueryMatch;
  //   } else {
  //     return hasSearchQueryMatch;
  //   }
  // });

  const filteredRows = rows.filter((row) => {
    // Check if any value in the row matches the search query
    const hasSearchQueryMatch = Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Apply additional filtering based on the selected status
    if (selectedStatus === 'YES') {
      // Include only rows with a bike number that is not 'NA' and matches the search query
      return row.bike_number !== 'NA' && hasSearchQueryMatch;
    } else if (selectedStatus === 'NA') {
      // Include only rows with a bike number that is 'NA' and matches the search query
      return row.bike_number === 'NA' && hasSearchQueryMatch;
    } else {
      // Include all rows that match the search query, regardless of bike number
      return hasSearchQueryMatch;
    }
  });
  

  const handleClosePopUp = () => {
    setShowModal(false);
    setTenantIdUrl('')
    setHasBike(false);
    setBikeNumber('');
    console.log("popupclosed");
    setFileName('');
  }


  const handleTentantRow = (tenant) => {

    setUserDetailsTenantsPopup(true);
    setShowModal(false);
    setSingleTenantDetails(tenant);


    const [roomNo, bedNo] = tenant.room_bed_no.split('/');
    const singleUserDueDate = tenants.find(eachTenant => 
      eachTenant.name === tenant.name && 
      eachTenant.mobileNo === tenant.mobile_no &&
      eachTenant.roomNo === roomNo &&
      eachTenant.bedNo === bedNo
    );
    console.log(tenants, "tenantdetails5")
    if (singleUserDueDate && singleUserDueDate.rents) {
      const dataWithDueDate = Object.values(singleUserDueDate.rents);
      const dueDate = dataWithDueDate[0].dueDate;
      console.log("Due date:", dueDate);
      setDueDateOfTenant(dueDate);
    } else {
      console.log("Tenant with due date not found or due date is missing");
    }

    if (singleUserDueDate && singleUserDueDate.tenantIdUrl) {
      setSingleTenantProofId(singleUserDueDate.tenantIdUrl)
    }

    if (singleUserDueDate && singleUserDueDate.permnentAddress) {
      console.log("permnent", "address")
      setTenantAddress(singleUserDueDate.permnentAddress);
    }
    else {
      setTenantAddress("");
    }
    if (singleUserDueDate && singleUserDueDate.bikeImage) {
      setBikeImageField(singleUserDueDate.bikeImage);

    }
    else {
      setBikeImageField("");
    }
    if (singleUserDueDate && singleUserDueDate.bikeRcImage) {
      setBikeRcImageField(singleUserDueDate.bikeRcImage);

    }
    else {
      setBikeRcImageField("");
    }

  };


  const tenantPopupClose = () => {
    setUserDetailsTenantsPopup(false);
    setDueDateOfTenant("")
    setSingleTenantProofId("");
  }

  //=====Vacate tenant ===========
  const handleVacate = async (id) => {
    const tenantRef = ref(database, `Hostel/boys/${activeBoysHostel}/tenants/${currentId}`);
    const newTenantRef = ref(database, `Hostel/boys/${activeBoysHostel}/extenants/${currentId}`);
    // Retrieve the data from the original location
    onValue(tenantRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Write the data to the new location
        await set(newTenantRef, data);
        // Remove the data from the original location
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
        fetchExTenants()
      }
    }, {
      onlyOnce: true // This ensures the callback is only executed once
    });

    setShowModal(false);
    resetForm();
    setErrors({});
    // imageInputRef.current.value = "";
    // idInputRef.current.value = "";
  };
  const fetchExTenants = () => {
    const exTenantsRef = ref(database, `Hostel/boys/${activeBoysHostel}/extenants`);
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
    const removeRef = ref(database, `Hostel/boys/${activeBoysHostel}/extenants/${tenantIdToDelete}`);
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
    s_no: index + 1, // Assuming `id` is a unique identifier for each tenant
    image: tenant.tenantImageUrl,
    name: tenant.name,
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
        onClick={() => handleExTenantDelete(tenant.id, tenant.name)} // Pass the `id` of the tenant
      >
        Delete
      </button>
    ) : null,
  
  }));
  
  const showExTenantsData = () => {
    setShowExTenants(!showExTenants)
    setShowBikeFilter(!showBikeFilter);
  }

  const onChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleChange = (event) => {
    const value = event.target.checked ? 'YES' : 'NA';
    onChangeStatus({ target: { value } });
  };
  const handleTenantFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',  
    }));
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
          <input type="text" placeholder={t('common.search')} className='search-input' value={searchQuery} onChange={handleSearchChange} />
          <img src={SearchIcon} alt="search-icon" className='search-icon' />
        </div>
        <div className='col-12 col-md-4 d-flex mt-2 justify-content-md-end '>
          <div className='d-flex align-items-center text-center'>
          {showBikeFilter?( <div className="toggle-container">
                <label className="toggle-label" htmlFor="status-toggleGirl">{t('tenantsPage.bike')}</label>
                <input
                  type="checkbox"
                  id="status-toggleGirl"
                  className="toggle-checkbox"
                  checked={selectedStatus === 'YES'}
                  onChange={handleChange}
                />
                <label className="toggle-switch" htmlFor="status-toggleGirl">
                  <span className="toggle-text">No</span>
                  <span className="toggle-text">Yes</span>
                </label>
              </div>) :null}
      <div className='d-flex justify-content-center align-items-center'>
            <div className={showExTenants ? "col-1 bedPageFilterDropdown" : "col-5 bedPageFilterDropdown"}>
              {showExTenants ? '' : <button id="tenantAddButton" type="button" class="add-button" onClick={() => { handleAddNew(); }} >
               {t('dashboard.addTenants')}
              </button>}
              
            </div>
            <div className={showExTenants ? "col-4 bedPageFilterDropdown" : "col-4 bedPageFilterDropdown"}>
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
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="exampleModalTenantsBoys" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}  >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fs-5" id="exampleModalLabel"> {t('dashboard.addTenants')}</h5>
              <button onClick={handleClosePopUp} className="btn-close" aria-label="Close"></button>
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
                      {boysRooms.map((room) => (
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
                    <input id="dataofJoin" class="form-control" type="date" value={dateOfJoin} onChange={(e) => setDateOfJoin(e.target.value)} name="dateOfJoin" onFocus={handleTenantFocus}  />

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
                    <input id="tenantMobileNo" class="form-control" type="text" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} name="mobileNo" onFocus={handleTenantFocus} />

                    {errors.mobileNo && <p style={{ color: 'red' }}>{errors.mobileNo}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantIdNum' class="form-label">
                    {t('dashboard.idNumber')}
                    </label>
                    <input id="tenantIdNum" class="form-control" type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} name="idNumber" onFocus={handleTenantFocus} />
                    {errors.idNumber && <p style={{ color: 'red' }}>{errors.idNumber}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantEmergency' class="form-label">
                    {t('dashboard.emergencyContact')}
                    </label>
                    <input id="tenantEmergency" class="form-control" type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} name="emergencyContact" onFocus={handleTenantFocus} />
                    {errors.emergencyContact && <p style={{ color: 'red' }}>{errors.emergencyContact}</p>}
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantStatus' class="form-label">
                    {t('dashboard.status')}
                    </label>
                    <select id="tenantStatus" class="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="occupied">{t('dashboard.occupied')}</option>
                      <option value="unoccupied">{t('dashboard.unoccupied')}</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label htmlFor='tenantUpload' class="form-label">
                    {t('dashboard.uploadImage')}
                    </label>
                    {isEditing && tenantImageUrl && (
                      <div>
                        <img src={tenantImageUrl} alt="Current Tenant" style={{ width: "100px", height: "100px" }} />
                        <p>{t('dashboard.currentImage')}</p>
                      </div>
                    )}
                    <input ref={tenantImageInputRef} id="tenantUpload" class="form-control" type="file" onChange={handleTenantImageChange} required />
                    {errors.tenantImage && <p style={{ color: 'red' }}>{errors.tenantImage}</p>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor='tenantUploadId' className="form-label">
                    {t('dashboard.uploadId')}:
                    </label>
                    {isEditing && tenantIdUrl && (
                      <div>
                        <p>{fileName}</p>
                      </div>
                    )}
                    {/* Show input for uploading ID only if not editing or tenantIdUrl doesn't exist */}

                    <input ref={tenantProofIdRef} id="tenantUploadId" className="form-control" type="file" onChange={handleTenantIdChange} />

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
                    <div className='bikeField' style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
                      <label class="bikenumber" htmlFor="bikeNumber" >{t('dashboard.bikeNumber')}</label>
                      <input
                        type="text"
                        id="bikeNumber"

                        className='form-control'
                        placeholder="Enter number plate ID"
                        value={bikeNumber}
                        onChange={(event) => setBikeNumber(event.target.value)}
                        style={{ flex: '2', borderRadius: '5px', borderColor: 'beize', outline: 'none', marginTop: '0', borderStyle: 'solid', borderWidth: '1px', borderHeight: '40px', marginLeft: '8px' }}
                      />
                    </div>
                  )
                }
                 

                  {/* <div className="col-md-6">
                    <label htmlFor="bikeimage" className='form-label'>BikeImage:</label>
                    <input type='file' className='form-control' value={bikeImage} onChange={(e)=>setBikeImage(e.target.value)}/>
                  </div> */}
                 {hasBike && (
  <>
    <div className="col-md-6">
      <label htmlFor="bikeimage" className="form-label">{t('tenantsPage.BikePic')}</label>
      <input type="file" className="form-control" onChange={handleImageChange} />
    </div>
    <div className="col-md-6">
      <label htmlFor="bikeRc" className="form-label">{t('tenantsPage.BikeRc')}</label>
      <input type="file" className="form-control" onChange={handleRcChange} />
    </div>
  </>
)}





                  {/* =============== */}
                  <div className='col-12 text-center mt-3'>
                    {isEditing ? (
                      <div className="d-flex justify-content-center gap-2">
                        <button type="button" className="btn btn-warning" onClick={handleSubmit}>{t('tenantsPage.updateTenant')}</button>
    
                        <button type="button" className="btn btn-warning" onClick={handleVacate}>{t('tenantsPage.vacateTenant')}</button>
                      
                      </div>
                    ) : (
                      <button id="tenantAddBtn" className="btn btn-warning" type="submit">{t('dashboard.addTenants')}</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>




     
      {userDetailsTenantPopup &&
        <div id="userDetailsTenantPopupIdBoy" className='userDetailsTenantPopup'>
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
            </div>
          </div>
        </div>
      }
      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className='confirmation-card'>
          <p style={{paddingBottom:'0px',marginBottom:'7px',fontSize:'20px'}}>{t('tenantsPage.confirmationMessage')} <span style={{color:'red'}}>{name}</span>?</p>
          <p style={{color:'red',fontSize:'15px',textAlign:'center'}}>{t('tenantsPage.note')}</p>
          <div className="buttons">
            <button onClick={handleConfirmDelete}>{t('tenantsPage.yes')}</button>
            <button onClick={handleCancelDelete}>{t('tenantsPage.no')}</button>
          </div>
          </div>
        </div>
      )}

    </>
  );

}

export default TenantsBoys;