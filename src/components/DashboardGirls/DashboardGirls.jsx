import React, { useContext, useEffect, useRef, useState } from 'react'
import Rooms from '../../images/Icons (2).png'
import Beds from '../../images/Icons (3).png'
import Tenants from '../../images/Icons (4).png'
import Expenses from '../../images/Icons (5).png'
import './DashboardGirls.css'
import SmallCard from '../../Elements/SmallCard'
import PlusIcon from '../../images/Icons (8).png'
import { database, push, ref, storage } from "../../firebase";
import { onValue, update } from 'firebase/database';
import { DataContext } from '../../ApiData/ContextProvider';
import { FetchData } from '../../ApiData/FetchData';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import Table from '../../Elements/Table'
import { Modal, Button } from 'react-bootstrap';
import { useData } from '../../ApiData/ContextProvider';
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const DashboardGirls = () => {
  const { t } = useTranslation();

   // created by admin or subAdmin 
   const  role = localStorage.getItem('role');
   let adminRole = "";
   if(role === "admin"){
     adminRole = "Admin";
   }else if(role === "subAdmin"){
     adminRole = "Sub-admin"
   }
   const isUneditable = role === 'admin' || role === 'subAdmin';


  const { activeGirlsHostel, setActiveGirlsHostel, activeGirlsHostelButtons } = useData();
  const [modelText, setModelText] = useState('');
  const [formLayout, setFormLayout] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [numberOfBeds, setNumberOfBeds] = useState('');
  const [rooms, setRooms] = useState([]);
  const [bedRent, setBedRent] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [createdBy, setCreatedBy] = useState(adminRole); // Default to 'admin'
  const [updateDate, setUpdateDate] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([])

  //=====================================================
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
  const [currentTenantId, setCurrentTenantId] = useState('');
  const [tenatErrors, setTenantErrors] = useState({});
  const [tenantImage, setTenantImage] = useState(null);
  const [tenantImageUrl, setTenantImageUrl] = useState(''); // For the image URL from Firebase Storage
  const [tenantId, setTenantId] = useState(null);
  const [tenantIdUrl, setTenantIdUrl] = useState('');
  const imageInputRef = useRef(null);
  const idInputRef = useRef(null);
  const [girlsRoomsData, setGirlsRoomsData] = useState([]);
  // const { data } = useContext(DataContext);
  const [showForm, setShowForm] = useState(true);


  // expenses related 

  const [hasBike, setHasBike] = useState(false);
  const [bikeNumber, setBikeNumber] = useState('NA');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [notify, setNotify] = useState(false);
  const [notifyUserInfo, setNotifyUserInfo] = useState(null);
  const [totalTenantsData,setTotalTenantData] = useState({});
  const [permnentAddress, setPermnentAddress] = useState("");
  const [bikeImage, setBikeImage] = useState(null);
  const [bikeImageField, setBikeImageField] = useState('');
  const [bikeRcImage, setBikeRcImage] = useState('');
  const [bikeRcImageField, setBikeRcImageField] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      // Once the file is loaded, set the image in state
      setBikeImage(reader.result);

    };
    // console.log(file,"file created");


    reader.readAsDataURL(file);
    console.log(file, "file created");
  };


  const handleRcChange = (e) => {
    const file1 = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBikeRcImage(reader.result);
    }
    reader.readAsDataURL(file1);
    console.log(file1, "file1 created");

  }

  useEffect(()=>{
    const tenantsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/tenants`);
    onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTenants = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setTotalTenantData(loadedTenants)
    })
   
    
  },[selectedTenant])

  const sendMessage = (tenant, rentRecord) => {

    console.log(tenant,"sendMessages")
    console.log(tenant,"sendMessages")


    const totalFee = rentRecord.totalFee;
    const tenantName = tenant.name;
  const amount = rentRecord.due;
  const dateOfJoin = tenant.dateOfJoin;
  const dueDate = rentRecord.dueDate;
  const paidAmount = rentRecord.paidAmount;
  const paidDate = rentRecord.paidDate;

  const message = `Hi ${tenantName},\n
Hope you are doing fine.\n
Your total fee is ${totalFee}.\n
You have paid ${paidAmount} so far.\n
Therefore, your remaining due amount is ${amount}.\n
You joined on ${dateOfJoin}, and your due date is ${dueDate}.\n
Please note that you made your last payment on ${paidDate}.\n`

    const phoneNumber = tenant.mobileNo; // Replace with the recipient's phone number

    // Check if the phone number starts with '+91' (India's country code)
    const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

    const encodedMessage = encodeURIComponent(message);


    // Use web link for non-mobile devices
    let whatsappLink = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;


    // Open the WhatsApp link
    window.open(whatsappLink, '_blank');
  };

  // Event handler for the notify checkbox
  const handleNotifyCheckbox = (rentData) => {
    // Toggle the state of the notify checkbox

    console.log(notify,notifyUserInfo,"addedToNotify")
    if (notify && notifyUserInfo) {
      // const { tenant, rentRecord } = notifyUserInfo;
      // console.log(tenant, "InNotify")
      sendMessage(notifyUserInfo, rentData); // If checkbox is checked and tenant info is available, send WhatsApp message
    }
    setNotify(!notify);
  };


  const getCurrentMonth = () => {
    const monthNames = [
      t('months.jan'),
      t('months.feb'),
      t('months.mar'),
      t('months.apr'),
      t('months.may'),
      t('months.jun'),
      t('months.jul'),
      t('months.aug'),
      t('months.sep'),
      t('months.oct'),
      t('months.nov'),
      t('months.dec')
    ];
    const currentMonth = new Date().getMonth(); // getMonth returns month index (0 = January, 11 = December)
    return monthNames[currentMonth];
  };

  const getCurrentYear = () => {
    return new Date().getFullYear().toString(); // getFullYear returns the full year (e.g., 2024)
  };

  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const handleCheckboxChange = (e) => {
    setHasBike(e.target.value == 'yes');
    if (e.target.value == 'no') {
      setHasBike(false);
      setBikeNumber('NA');
    } else {
      setBikeNumber('');
    }
  };

  const [formData, setFormData] = useState({
    expenseName: '',
    expenseAmount: '',
    expenseDate: '',
    createdBy: 'admin'
  });

  const [formErrors, setFormErrors] = useState({
    number: '',
    rent: '',
    rooms: '',
    status: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
        if (showModal && (event.target.id === "exampleModalRoomsGirls" || event.key === "Escape")) {
            setShowModal(false);
            setHasBike(false);
            setBikeNumber('NA');
            handleCloseModal();
        }
       
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleOutsideClick)

  }, [showModal]);




  const handleRoomsIntegerChange = (event) => {
    const { name, value } = event.target;
    // const re = /^[0-9\b]+$/; // Regular expression to allow only numbers

    let sanitizedValue = value;

    if (name === 'floorNumber' || name === 'roomNumber') {
      // Allow alphanumeric characters and hyphens only
      sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
    } else if (name === 'numberOfBeds' || name === 'bedRent') {
      // Allow numbers only
      sanitizedValue = value.replace(/[^0-9]/g, '');
    }

    // if (value === '' || re.test(sanitizedValue)) {
    switch (name) {
      case 'floorNumber':
        setFloorNumber(sanitizedValue);
        break;
      case 'roomNumber':
        setRoomNumber(sanitizedValue);
        break;
      case 'numberOfBeds':
        setNumberOfBeds(sanitizedValue);
        break;
      case 'bedRent':
        setBedRent(sanitizedValue);
        break;
      default:
        break;
    }
    // }
  };
  const handleGirlsRoomsSubmit = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();  // Get current date-time in ISO format
    // Initialize an object to collect errors
    const newErrors = {};
    // Validation checks
    if (!floorNumber.trim()) newErrors.floorNumber = t('errors.floorNumberRequired');
    if (!roomNumber.trim()) newErrors.roomNumber =  t('errors.roomNumberRequired');
    else if (rooms.some(room => room.roomNumber === roomNumber && room.id !== currentId)) {
      newErrors.roomNumber = t('errors.roomNumberExists') ;
    }
    if (!numberOfBeds) newErrors.numberOfBeds = t('errors.numberOfBedsRequired') ;
    if (!bedRent) newErrors.bedRent =t('errors.bedRentRequired');

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent form submission if there are errors
    }

    const roomsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/rooms`);
    push(roomsRef, {
      floorNumber,
      roomNumber,
      numberOfBeds,
      bedRent,
      createdBy,
      updateDate: now
    }).then(() => {
      toast.success(t('toastMessages.roomAddedSuccessfully'), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(error => {
      toast.error(t('toastMessages.errorAddingRoom') + error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    // }

    // Reset form
    setFloorNumber('');
    setRoomNumber('');
    setNumberOfBeds('');
    setBedRent('');
    setCurrentId('');
    setUpdateDate(now); // Update state with current date-time
    setErrors({}); // Clear errors
    setShowModal(false);
  };

  useEffect(() => {
    const roomsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/rooms`);
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRooms = [];
      for (const key in data) {
        loadedRooms.push({
          id: key,
          ...data[key]
        });
      }
      setRooms(loadedRooms);
    });
  }, [activeGirlsHostel]);
  // Calculate the total number of beds
  const totalBeds = rooms.reduce((acc, room) => acc + Number(room.numberOfBeds), 0);


  //-======================================

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const formattedMonth = month.slice(0, 3).toLowerCase();
    const expensesRef = ref(database, `Hostel/girls/${activeGirlsHostel}/expenses/${year}-${formattedMonth}`);
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      let total = 0; // Variable to hold the total expenses
      const expensesArray = [];
      for (const key in data) {
        const expense = {
          id: key,
          ...data[key],
          expenseDate: formatDate(data[key].expenseDate)
        };
        total += expense.expenseAmount; // Add expense amount to total
        expensesArray.push(expense);
      }
      setCurrentMonthExpenses(expensesArray);
      setTotalExpenses(total); // Set total expenses state
    });
  }, [activeGirlsHostel]);


  useEffect(() => {
    const tenantsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/tenants`);
    onValue(tenantsRef, snapshot => {
      const data = snapshot.val() || {};
      const loadedTenants = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setTenants(loadedTenants);
    });
  }, [activeGirlsHostel]);


  const [girlsRooms, setGirlsRooms] = useState([]);
  useEffect(() => {
    const roomsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/rooms`);
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRooms = [];
      for (const key in data) {
        loadedRooms.push({
          id: key,
          ...data[key]
        });
      }
      setGirlsRooms(loadedRooms);
    });
    // Fetch tenants
  }, [activeGirlsHostel]);



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
  }, [selectedRoom, girlsRooms, activeGirlsHostel]);


  const validate = () => {
    let tempErrors = {};
    tempErrors.selectedRoom = selectedRoom ? "" : t('errors.roomNumberRequired');
    tempErrors.selectedBed = selectedBed ? "" : t('errors.bedNumberRequired');
    tempErrors.dateOfJoin = dateOfJoin ? "" : t('errors.dateOfJoinRequired');
    if (!name) {
      tempErrors.name = t('errors.nameRequired');
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      tempErrors.name = t('errors.nameInvalid');
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
      return tenant.roomNo === selectedRoom && tenant.bedNo === selectedBed && tenant.status === "occupied" && tenant.id !== currentTenantId;
    });

    if (isBedOccupied) {
      tempErrors.selectedBed = t('errors.bedAlreadyOccupied');
    }
    if (!tenantImage && !tenantImageUrl) {
      tempErrors.tenantImage = t('errors.tenantImageRequired');
    }
    setTenantErrors(tempErrors);
    return Object.keys(tempErrors).every((key) => tempErrors[key] === "");
  };

  const handleTenantImageChange = (e) => {
    if (e.target.files[0]) {
      setTenantImage(e.target.files[0]);
    }
  };
  const handleTenantIdChange = (e) => {
    if (e.target.files[0]) {
      setTenantId(e.target.files[0]);
    }
  };
  const handleTenantSubmit = async (e) => {
    e.preventDefault();

    // if (!validate()) return;
    e.target.querySelector('button[type="submit"]').disabled = true;
    if (!validate()) {
      e.target.querySelector('button[type="submit"]').disabled = false;
      return
    };

    let imageUrlToUpdate = tenantImageUrl;

    if (tenantImage) {
      const imageRef = storageRef(storage, `Hostel/girls/${activeGirlsHostel}/tenants/images/tenantImage/${tenantImage.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, tenantImage);
        imageUrlToUpdate = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading tenant image:", error);

      }
    }

    let idUrlToUpdate = tenantIdUrl;
    if (tenantId) {
      const imageRef = storageRef(storage, `Hostel/girls/${activeGirlsHostel}/tenants/images/tenantId/${tenantId.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, tenantId);
        idUrlToUpdate = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading tenant image:", error);
      }
    }

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
      permnentAddress,
      bikeImage,
      bikeRcImage

      // tenantIdUrl,
    };
    console.log(tenantData,"dashtenant");

    if (isEditing) {
      await update(ref(database, `Hostel/girls/${activeGirlsHostel}/tenants/${currentTenantId}`), tenantData).then(() => {
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
      await push(ref(database, `Hostel/girls/${activeGirlsHostel}/tenants`), tenantData).then(() => {
        toast.success(t('toastMessages.tenantAddedSuccess'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
    // setShowModal(false);
    setShowModal(false);
    resetForm();
    imageInputRef.current.value = "";
    idInputRef.current.value = "";
  };

  //===============================

  //handle add rent==============================================

 
  const [bedNumber, setBedNumber] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [due, setDue] = useState('');
  const [tenantsWithRents, setTenantsWithRents] = useState([]);
  const [paidDate, setPaidDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingRentId, setEditingRentId] = useState(null);
  const [availableTenants, setAvailableTenants] = useState([]);

  useEffect(() => {
    const updateTotalFeeFromRoom = () => {
      // Convert the rooms object into an array of its values
      const roomsArray = Object.values(rooms);
      // Find the room that matches the roomNumber
      const matchingRoom = roomsArray.find(room => room.roomNumber === roomNumber);

      if (matchingRoom && matchingRoom.bedRent) {
        setTotalFee(matchingRoom.bedRent.toString());
      } else {
        // Reset totalFee if no matching room is found
        setTotalFee('');
      }
    };

    if (roomNumber) {
      updateTotalFeeFromRoom();
    }
  }, [roomNumber, rooms]);


  useEffect(() => {
    if (selectedTenant) {
      const tenant = tenants.find(t => t.id === selectedTenant);
      if (tenant) {
        setRoomNumber(tenant.roomNo || '');
        setBedNumber(tenant.bedNo || '');
        setDateOfJoin(tenant.dateOfJoin || '');
      }
    } else {
      // Reset these fields if no tenant is selected
      setRoomNumber('');
      setBedNumber('');
      setPaidAmount('');
      setDue('');
      setDateOfJoin('');
      setDueDate('');
    }
  }, [selectedTenant, tenants, activeGirlsHostel]);

  useEffect(() => {
    // Assuming tenantsWithRents already populated
    const tenantIdsWithRents = tenantsWithRents.flatMap(tenant =>
      tenant.rents.length > 0 ? [tenant.id] : []
    );

    const availableTenants = tenants.filter(
      tenant => !tenantIdsWithRents.includes(tenant.id)
    );

    // Optionally, you can store availableTenants in a state if you need to use it elsewhere
    setAvailableTenants(availableTenants);
  }, [tenants, tenantsWithRents, activeGirlsHostel]);


  useEffect(() => {
    // Recalculate due when paid amount changes
    const calculatedDue = Math.max(parseFloat(totalFee) - parseFloat(paidAmount), 0).toString();
    setDue(calculatedDue);
  }, [paidAmount, totalFee]);

  useEffect(() => {
    // Fetch tenants data once when component mounts
    const tenantsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/tenants`);
    onValue(tenantsRef, (snapshot) => {
      const tenantsData = snapshot.val();
      const tenantIds = tenantsData ? Object.keys(tenantsData) : [];

      // Initialize an array to hold promises for fetching each tenant's rents
      const rentsPromises = tenantIds.map(tenantId => {
        return new Promise((resolve) => {
          const rentsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/tenants/${tenantId}/rents`);
          onValue(rentsRef, (rentSnapshot) => {
            const rents = rentSnapshot.val() ? Object.keys(rentSnapshot.val()).map(key => ({
              id: key,
              ...rentSnapshot.val()[key],
            })) : [];
            resolve({ id: tenantId, ...tenantsData[tenantId], rents });
          }, {
            onlyOnce: true // This ensures the callback is only executed once.
          });
        });
      });

      // Wait for all promises to resolve and then set the state
      Promise.all(rentsPromises).then(tenantsWithTheirRents => {
        setTenantsWithRents(tenantsWithTheirRents);
      });
    });
  }, []);

  const validateRentForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!selectedTenant) {
      formIsValid = false;
      errors["selectedTenant"] = t('errors.selectedTenantRequired');
    }

    // Paid Amount
    if (!paidAmount) {
      formIsValid = false;
      errors["paidAmount"] = t('errors.paidAmountRequired');
    }

    // Paid Date
    if (!paidDate) {
      formIsValid = false;
      errors["paidDate"] = t('errors.paidDateRequired');
    }

    // Due Date
    if (!dueDate) {
      formIsValid = false;
      errors["dueDate"] = t('errors.dueDateRequired');
    }

    setErrors(errors);
    return formIsValid;
  };


  const handleRentSubmit = async (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateRentForm()) {
      // If validation fails, stop form submission
      return;
    }

    const rentData = {
      roomNumber,
      bedNumber,
      totalFee,
      paidAmount,
      due,
      dateOfJoin,
      paidDate,
      dueDate,
      status: parseFloat(due) <= 0 ? t('rentPage.paid') : t('rentPage.unpaid'),
    };

    if (isEditing) {
      // Update the existing rent record
      const rentRef = ref(database, `Hostel/girls/${activeGirlsHostel}/tenants/${selectedTenant}/rents/${editingRentId}`);
      await update(rentRef, rentData).then(() => {
        toast.success(t('toastMessages.rentUpdatedSuccess'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsEditing(false); // Reset editing state
        if (notify) {
          handleNotifyCheckbox(rentData);
        }
        setNotify(false)
      }).catch(error => {
        toast.error(t('toastMessages.errorUpdatingRent') + error.message, {
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
      // Create a new rent record
      const rentRef = ref(database, `Hostel/girls/${activeGirlsHostel}/tenants/${selectedTenant}/rents`);
      await push(rentRef, rentData).then(() => {
        toast.success(t('toastMessages.rentAddedSuccess'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsEditing(false); // Reset editing state
        if (notify) {
          handleNotifyCheckbox(rentData);
        }
        setNotify(false)
      }).catch(error => {
        toast.error(t('toastMessages.errorAddingRent') + error.message, {
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

  };
  //---------------------------------

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
    setFloorNumber('');
    setRoomNumber('');
    setNumberOfBeds('');
    setBedRent('');
    setTenantErrors({});
    setSelectedTenant('');
    setRoomNumber('');
    setBedNumber('');
    setTotalFee('');
    setPaidAmount('');
    setDue('');
    setDateOfJoin('');
    setPaidDate('');
    setDueDate('');
    setErrors({});
    setIsEditing(false);
    setFormErrors({
      number: '',
      rent: '',
      rooms: '',
      status: ''
    });
    setFormData({
      expenseName: '',
      expenseAmount: '',
      expenseDate: '',
      createdBy: 'admin'
    })
  };

  const menu = [
    {
      image: Rooms,
      heading: t('dashboard.totalRooms'),
      number: `${rooms.length}`,
      btntext: t('dashboard.addRooms'),
    },

    {
      image: Tenants,
      heading: t('dashboard.totalTenants'),
      number: `${tenants.length}`,
      btntext: t('dashboard.addTenants'),
    },
    {
      image: Beds,
      heading: t('dashboard.totalBeds'),
      number: `${totalBeds}/${totalBeds-tenants.length}`,
      btntext: t('dashboard.addRent'),
    },
    {
      image: Expenses,
      heading: t('dashboard.totalExpenses'),
      number: `${totalExpenses}`,
      btntext: t('dashboard.addExpenses'),
    },
  ];
  
  const Buttons = ['Add Rooms', 'Add Tenants', 'Add Rent', 'Add Expenses'];

  const handleClick = (text) => {
    setModelText(text);
    setFormLayout(text);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setModelText('');
    setFormLayout('');
    resetForm();
    setShowModal(false);
    setHasBike(false);
    setBikeNumber("");
  };


  const getMonthYearKey = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // get short month name
    const year = date.getFullYear();
    return `${year}-${month}`;
  };

  const expensesHandleSubmit = (e) => {
    e.preventDefault();
    // Validate the necessary fields
    let errors = {};
    let formIsValid = true;

    if (!formData.expenseName.match(/^[a-zA-Z\s]+$/)) {
      errors.expenseName = t('errors.expenseNameAlphabetsAndSpaces');
      formIsValid = false;
    }


    if (!formData.expenseAmount.match(/^\d+(\.\d{1,2})?$/)) {
      errors.expenseAmount =t('errors.expenseAmountValidNumber');
      formIsValid = false;
    }


    if (!formData.expenseName) {
      errors.expenseName =  t('errors.expenseNameRequired');
      formIsValid = false;
    }

    if (!formData.expenseAmount) {
      errors.expenseAmount = t('errors.expenseAmountRequired');
      formIsValid = false;
    }

    if (!formData.expenseDate) {
      errors.expenseDate =t('errors.expenseDateRequired');
      formIsValid = false;
    }

    // Only proceed if form is valid
    if (formIsValid) {
      const monthYear = getMonthYearKey(formData.expenseDate);
      const expensesRef = ref(database, `Hostel/girls/${activeGirlsHostel}/expenses/${monthYear}`);
      push(expensesRef, {
        ...formData,
        expenseAmount: parseFloat(formData.expenseAmount),
        expenseDate: new Date(formData.expenseDate).toISOString() // Proper ISO formatting
      }).then(() => {
        toast.success(t('toastMessages.expenseAddedSuccessfully'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // setIsEditing(false); // Reset editing state
      }).catch(error => {
        toast.error(t('toastMessages.errorAddingExpense') + error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
      setShowModal(false);
      setFormErrors({
        number: '',
        rent: '',
        rooms: '',
        status: ''
      });
      setFormData({
        expenseName: '',
        expenseAmount: '',
        expenseDate: '',
        createdBy: 'admin'
      });
    } else {
      // Set errors in state if form is not valid
      setFormErrors(errors);
    }
  };

  useEffect(() => {
    if (selectedTenant) {
      const tenant = tenants.find(t => t.id === selectedTenant);
      if (tenant) {
        // Set the date of join
        setDateOfJoin(tenant.dateOfJoin || '');

        // Calculate the due date (one day less than adding one month)
        const currentDate = new Date(tenant.dateOfJoin); // Get the join date
        const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(-1)); // Add one month and subtract one day
        const formattedDueDate = dueDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        setDueDate(formattedDueDate);
      }
    }
  }, [selectedTenant, tenants]);

  const onClickCheckbox = () => {
    setNotify(!notify)
    const singleTenant = totalTenantsData.filter(tenant =>
      tenant.id === selectedTenant 
    );
    const singleTenantData = singleTenant[0];
    console.log(singleTenantData,"addedToNotify")
    setNotifyUserInfo(singleTenantData)
    
  }

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',  
    }));
  };

  const handleTenantFocus = (e) => {
    const { name } = e.target;
    setTenantErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',  // Clear the error message for the focused field
    }));
  };

  const handleExpensesFocus = (e) => {
    const fieldName = e.target.name;
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: ''
    }));
  };
  
 
  const renderFormLayout = () => {
    switch (formLayout) {
      case t('dashboard.addRooms'):
        return (

          <form className="row g-3" onSubmit={handleGirlsRoomsSubmit}>
            <div className="col-md-6">
              <label htmlFor="inputNumber" className="form-label">{t('dashboard.floorNumber')}</label>
              <input type="text" className="form-control" id="inputNumber" name="floorNumber" value={floorNumber} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
              {errors.floorNumber && <div style={{ color: 'red' }}>{errors.floorNumber}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="inputRent" className="form-label">{t('dashboard.roomNumber')}</label>
              <input type="text" className="form-control" id="inputRent" name="roomNumber" value={roomNumber} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
              {errors.roomNumber && <div style={{ color: 'red' }}>{errors.roomNumber}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="inputRooms" className="form-label">{t('dashboard.numberOfBeds')}</label>
              <input type="text" className="form-control" id="inputRooms" name="numberOfBeds" value={numberOfBeds} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
              {errors.numberOfBeds && <div style={{ color: 'red' }}>{errors.numberOfBeds}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="inputStatus" className="form-label">{t('dashboard.bedRent')}</label>
              <input type="text" className="form-control" id="inputStatus" name="bedRent" value={bedRent} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
              {errors.bedRent && <div style={{ color: 'red' }}>{errors.bedRent}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="inputRole" className="form-label">{t('dashboard.createdBy')}</label>
              {/* <select className="form-select" id="inputRole" name="role" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}>

                <option value="admin">{t('dashboard.admin')}</option>
                <option value="sub-admin">{t('dashboard.subAdmin')}</option>
              </select> */}
              <input disabled={isUneditable} type="text" className='form-control' id="inputRole" value={createdBy} />
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-warning" onClick={handleGirlsRoomsSubmit}>{t('dashboard.createRoom')}</button>
            </div>
          </form>
        )
      case t('dashboard.addRent'):
        return (
          <div >
            <div className='monthlyDailyButtons'>
              <div className={showForm ? 'manageRentButton active' : 'manageRentButton'} onClick={() => setShowForm(true)}>
                <text>{t('dashboard.monthly')}</text>
              </div>
              <div className={!showForm ? 'manageRentButton active' : 'manageRentButton'} onClick={() => setShowForm(false)}>
                <text>{t('dashboard.daily')}</text>
              </div>
            </div>
            {showForm ?
              <div className='monthlyAddForm'>
                <form class="row lg-10" onSubmit={handleRentSubmit}>
                  <div class='col-12 mb-3'>
                    <select id="bedNo" class="form-select" value={selectedTenant} onChange={e => setSelectedTenant(e.target.value)} disabled={isEditing} name="selectedTenant" onFocus={handleFocus}>
                      <option value="">{t('dashboard.selectTenant')} *</option>
                      {/* {availableTenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))} */}

                      {isEditing ? (
                        <option key={selectedTenant} value={selectedTenant}>{tenantsWithRents.find(tenant => tenant.id === selectedTenant)?.name}</option>
                      ) : (
                        availableTenants.map(tenant => (
                          <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                        ))
                      )}
                    </select>
                    {errors.selectedTenant && <div style={{ color: 'red' }}>{errors.selectedTenant}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='roomNo' class="form-label">{t('dashboard.roomNumber')}:</label>
                    <input id="roomNo" class="form-control" type="text" value={roomNumber} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='BedNumber' class="form-label">{t('dashboard.bedNumber')}:</label>
                    <input id="BedNumber" class="form-control" type="text" value={bedNumber} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='TotalFee' class="form-label">{t('dashboard.totalFee')}:</label>
                    <input id="TotalFee" class="form-control" type="number" value={totalFee} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="PaidAmount" class="form-label">{t('dashboard.paidAmount')}:</label>
                    <input id="PaidAmount" class="form-control" type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} name="paidAmount" onFocus={handleFocus} />
                    {errors.paidAmount && <div style={{ color: 'red' }}>{errors.paidAmount}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="Due" class="form-label">{t('dashboard.due')}:</label>
                    <input id="Due" class="form-control" type="number" value={due} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='DateOfJoin' class="form-label">{t('dashboard.dateOfJoin')}:</label>
                    <input id="DateOfJoin" class="form-control" type="date" value={dateOfJoin} readOnly // Make this field read-only since it's auto-populated 
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='PaidDate' class="form-label">{t('dashboard.paidDate')}:</label>
                    <input
                      id="PaidDate"
                      class="form-control"
                      type="date"
                      value={paidDate}
                      onChange={e => setPaidDate(e.target.value)}
                      name="paidDate"
                      onFocus={handleFocus}
                    />
                    {errors.paidDate && <div style={{ color: 'red' }}>{errors.paidDate}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="DueDate" class="form-label">{t('dashboard.dueDate')}</label>
                    <input
                      id="DueDate"
                      class="form-control"
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      name="dueDate"
                      onFocus={handleFocus}
                    />
                    {errors.dueDate && <div style={{ color: 'red' }}>{errors.dueDate}</div>}
                  </div>
                  <div className="col-12 mb-3" >
                    <div className="form-check">
                      <input
                        id="notifyCheckbox"
                        className="form-check-input"
                        type="checkbox"
                      checked={notify}
                      onChange={onClickCheckbox} // Toggle the state on change
                      />
                      <label className="form-check-label" htmlFor="notifyCheckbox">
                      {t('dashboard.notify')}
                      </label>
                      <FaWhatsapp style={{ backgroundColor: 'green', color: 'white', marginLeft: '7px', marginBottom: '4px' }} />
                    </div>
                  </div>
                  <div class="col-12 text-center mt-2">
                    <button type="submit" className="btn btn-warning">{isEditing ? t('dashboard.updateRent') : t('dashboard.submitRentDetails')}</button>
                  </div>
                </form>
              </div> :
              <div className='monthlyAddForm'>
                <form class="row lg-10" onSubmit={handleRentSubmit}>
                  <div class='col-12 mb-3'>
                    <select id="bedNo" class="form-select" value={selectedTenant} onChange={e => setSelectedTenant(e.target.value)} disabled={isEditing} name="selectedTenant" onFocus={handleFocus}>
                      <option value="">{t('dashboard.selectTenant')} *</option>
                      {/* {availableTenants.map(tenant => (
                                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                  ))} */}

                      {isEditing ? (
                        <option key={selectedTenant} value={selectedTenant}>{tenantsWithRents.find(tenant => tenant.id === selectedTenant)?.name}</option>
                      ) : (
                        availableTenants.map(tenant => (
                          <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                        ))
                      )}


                    </select>
                    {errors.selectedTenant && <div style={{ color: 'red' }}>{errors.selectedTenant}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='roomNo' class="form-label">{t('dashboard.roomNumber')}</label>
                    <input id="roomNo" class="form-control" type="text" value={roomNumber} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='BedNumber' class="form-label">{t('dashboard.bedNumber')}</label>
                    <input id="BedNumber" class="form-control" type="text" value={bedNumber} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='TotalFee' class="form-label">{t('dashboard.totalFee')}</label>
                    <input id="TotalFee" class="form-control" type="number" value={totalFee} onChange={e => setTotalFee(e.target.value)} />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="PaidAmount" class="form-label">{t('dashboard.paidAmount')}</label>
                    <input id="PaidAmount" class="form-control" type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} name="paidAmount" onFocus={handleFocus} />
                    {errors.paidAmount && <div style={{ color: 'red' }}>{errors.paidAmount}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="Due" class="form-label">{t('dashboard.due')}</label>
                    <input id="Due" class="form-control" type="number" value={due} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='DateOfJoin' class="form-label">{t('dashboard.dateOfJoin')}</label>
                    <input id="DateOfJoin" class="form-control" type="date" value={dateOfJoin} readOnly // Make this field read-only since it's auto-populated 
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='PaidDate' class="form-label">{t('dashboard.paidDate')}</label>
                    <input
                      id="PaidDate"
                      class="form-control"
                      type="date"
                      value={paidDate}
                      onChange={e => setPaidDate(e.target.value)}
                      name="paidDate"
                      onFocus={handleFocus}
                    />
                    {errors.paidDate && <div style={{ color: 'red' }}>{errors.paidDate}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="DueDate" class="form-label">{t('dashboard.dueDate')}</label>
                    <input
                      id="DueDate"
                      class="form-control"
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      name="dueDate"
                      onFocus={handleFocus}
                    />
                    {errors.dueDate && <div style={{ color: 'red' }}>{errors.dueDate}</div>}
                  </div>
                  <div className="col-12 mb-3" >
                    <div className="form-check">
                      <input
                        id="notifyCheckbox"
                        className="form-check-input"
                        type="checkbox"
                      checked={notify}
                      onChange={onClickCheckbox} // Toggle the state on change
                      />
                      <label className="form-check-label" htmlFor="notifyCheckbox">
                      {t('dashboard.notify')}
                      </label>
                      <FaWhatsapp style={{ backgroundColor: 'green', color: 'white', marginLeft: '7px', marginBottom: '4px' }} />
                    </div>
                  </div>
                  
                  <div class="col-12 text-center mt-2">
                    <button type="submit" className="btn btn-warning">{isEditing ? t('dashboard.updateRent') : t('dashboard.submitRentDetails')}</button>
                  </div>
                </form>
              </div>
            }
          </div>
        )
        case t('dashboard.addTenants'):
          return (
            <form class="row lg-10" onSubmit={handleTenantSubmit}>
              <div class="col-md-6">
                <label htmlFor='roomNo' class="form-label">{t('dashboard.roomNo')}</label>
                <select id="roomNo" class="form-select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} name="selectedBed" onFocus={handleTenantFocus}>
                  <option value="">{t('dashboard.selectRoom')}</option>
                  {girlsRooms.map((room) => (
                    <option key={room.roomNumber} value={room.roomNumber}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
                {tenatErrors.selectedRoom && <p style={{ color: 'red' }}>{tenatErrors.selectedRoom}</p>}
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
   
                {tenatErrors.selectedBed && <p style={{ color: 'red' }}>{tenatErrors.selectedBed}</p>}
              </div>
              <div class="col-md-6">
                <label htmlFor='dataofJoin' class="form-label">
                {t('dashboard.dateOfJoin')}
                </label>
                <input id="dataofJoin" class="form-control" type="date" value={dateOfJoin} onChange={(e) => setDateOfJoin(e.target.value)} name="dateOfJoin" onFocus={handleTenantFocus} />
   
                {tenatErrors.dateOfJoin && <p style={{ color: 'red' }}>{tenatErrors.dateOfJoin}</p>}
              </div>
              <div class="col-md-6">
                <label htmlFor='tenantName' class="form-label">
                {t('dashboard.name')}
                </label>
                <input id="tenantName" class="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')} name="name" onFocus={handleTenantFocus} />
   
                {tenatErrors.name && <p style={{ color: 'red' }}>{tenatErrors.name}</p>}
              </div>
              <div class="col-md-6">
                <label htmlFor='tenantMobileNo' class="form-label">
                {t('dashboard.mobileNo')}
                </label>
                <input id="tenantMobileNo" class="form-control" type="text" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} name="mobileNo" onFocus={handleTenantFocus} />
   
                {tenatErrors.mobileNo && <p style={{ color: 'red' }}>{tenatErrors.mobileNo}</p>}
              </div>
              <div class="col-md-6">
                <label htmlFor='tenantIdNum' class="form-label">
                {t('dashboard.idNumber')}
                </label>
                <input id="tenantIdNum" class="form-control" type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)}  name="idNumber" onFocus={handleTenantFocus} />
   
                {tenatErrors.idNumber && <p style={{ color: 'red' }}>{tenatErrors.idNumber}</p>}
              </div>
              <div class="col-md-6">
                <label htmlFor='tenantEmergency' class="form-label">
                {t('dashboard.emergencyContact')}
                </label>
                <input id="tenantEmergency" class="form-control" type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)}  name="emergencyContact" onFocus={handleTenantFocus} />
   
                {tenatErrors.emergencyContact && <p style={{ color: 'red' }}>{tenatErrors.emergencyContact}</p>}
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
                <input id="tenantUpload" class="form-control" type="file" onChange={handleTenantImageChange} ref={imageInputRef} required />
                {errors.tenantImage && <p style={{ color: 'red' }}>{errors.tenantImage}</p>}
              </div>
              <div class="col-md-6">
                <label htmlFor='tenantUploadId' class="form-label">
                {t('dashboard.uploadId')}:
                </label>
                {isEditing && tenantIdUrl && (
                  <object
                    data={tenantIdUrl}
                    type="application/pdf"
                    width="50%"
                    height="200px"
                  >
                    <a href={tenantIdUrl}>{t('dashboard.downloadPdf')}</a>
                  </object>
                )}
                <input id="tenantUploadId" class="form-control" type="file" onChange={handleTenantIdChange} ref={idInputRef} multiple />
   
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
   
   
   
              {/* ===== */}
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
                  <button type="button" className="btn btn-warning" onClick={handleTenantSubmit}>{t('dashboard.updateTenant')}</button>
                ) : (
                  <button className='btn btn-warning' type="submit">{t('dashboard.addTenants')}</button>
                )}
              </div>
            </form>
          )
      case t('dashboard.addExpenses'):
        return (
          <form className="row lg-10" onSubmit={expensesHandleSubmit}>
            <div className="col-md-6">
              <label htmlFor="inputExpenseName" className="form-label">{t('dashboard.expenseName')}</label>
              <input type="text" className="form-control" name="expenseName" value={formData.expenseName} onChange={handleInputChange} onFocus={handleExpensesFocus} />
              {formErrors.expenseName && <div className="text-danger">{formErrors.expenseName}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="inputRent" className="form-label">{t('dashboard.expenseAmount')}</label>
              <input type="number" className="form-control" name="expenseAmount" value={formData.expenseAmount} onChange={handleInputChange} onFocus={handleExpensesFocus} />
              {formErrors.expenseAmount && <div className="text-danger">{formErrors.expenseAmount}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="inputRole" className="form-label">{t('dashboard.createdBy')}</label>
              {/* <select className="form-select" id="inputRole" name="createdBy" value={formData.createdBy} onChange={handleInputChange}>
                <option value="admin">{t('dashboard.admin')}</option>
                <option value="sub-admin">{t('dashboard.subAdmin')}</option>
              </select> */}
              <input disabled={isUneditable} type="text" className='form-control' id="inputRole" value={createdBy} />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputDate" className="form-label">{t('dashboard.expenseDate')}</label>
              <input type="date" className="form-control" name="expenseDate" value={formData.expenseDate} onChange={handleInputChange} onFocus={handleExpensesFocus} />
              {formErrors.expenseDate && <div className="text-danger">{formErrors.expenseDate}</div>}
            </div>

            <div className="col-12 text-center mt-3">

              <button type="submit" className="btn btn-warning">{t('dashboard.create')}</button>


            </div>
          </form>
        )
      default:
        return null
    }
  }

  const [popupOpen, setPopupOpen] = useState(false);
  const [expensePopupOpen, setExpensePopupOpen] = useState(false);
  const [bedsData, setBedsData] = useState([]);
  const handleCardClick = (item) => {
    if (item.heading === t('dashboard.totalBeds')) {
        // Logic to open the popup for "Total Beds" card
        setPopupOpen(true);
    }
    if (item.heading === 'Total Expenses') {
      setExpensePopupOpen(true);
    }
  };


  const onClickCloseBedsPopup = () => {
    setPopupOpen(false);
  }
  const onClickCloseExpensePopup = () => {
    setExpensePopupOpen(false);
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      console.log("closed")
      if (popupOpen && event.target.id === "example") {
        setPopupOpen(false)
        setHasBike(false);
            setBikeNumber('NA');
      }
    };
    window.addEventListener('click', handleOutsideClick)
  }, [popupOpen])

  useEffect(() => {
    if (!girlsRooms || girlsRooms.length === 0) {
      // If rooms are not defined or the array is empty, clear bedsData and exit early
      setBedsData([]);
      return;
    }

    const allBeds = girlsRooms.flatMap(room => {
      return Array.from({ length: room.numberOfBeds }, (_, i) => {
        const bedNumber = i + 1;
        // Find if there's a tenant for the current bed
        const tenant = tenants.find(tenant => tenant.roomNo === room.roomNumber && tenant.bedNo === String(bedNumber));
        return {
          floorNumber: room.floorNumber,
          roomNumber: room.roomNumber,
          bedNumber: bedNumber,
          rent: room.bedRent || "N/A", // Assuming rent is provided by the tenant data
          status: tenant ? "Occupied" : "Unoccupied"
        };
      });
    });
    setBedsData(allBeds);
  }, [girlsRooms, tenants]); // Depend on rooms and tenants data

  const rows = bedsData.filter((bed) => bed.status === 'Unoccupied').map((bed, index) => ({
    // s_no: index + 1,
    bed_number: bed.bedNumber,
    room_no: bed.roomNumber,
    floor: bed.floorNumber,
    // status: bed.status
  }));

  const columns = [
    // 'S. No',
    t('table.bedNumber'),
    t('table.roomNo'),
    t('table.floor'),
    // 'Status'
  ];

  const expenseColumns = [
    'Date',
    'Expense',
    'Amount',
  ];
  const expenseRows = currentMonthExpenses.map((expense, index) => ({
    date: expense.expenseDate,
    expense: expense.expenseName,
    amount: expense.expenseAmount,
  }));
console.log("hostels names", activeGirlsHostelButtons)

  return (
    <div className="dashboardgirls">
        <h1 className="heading1">{t('dashboard.womens')}</h1>
      <br />
      {activeGirlsHostelButtons.length > 0 ? (
        <div className={"flex1"}>
          {activeGirlsHostelButtons.map((button, index) => (
            <button className={`btn m-2 ${activeGirlsHostel === `${button}` ? 'active-button' : 'inactive-button'}`} onClick={() => setActiveGirlsHostel(button)} key={index} style={{
              backgroundColor: activeGirlsHostel === button ? '#FF8A00' : '#fac38c', // Example colors
              color: activeGirlsHostel === button ? 'white' : '#333333' // Set text color (optional)
            }}
            >{button}</button>
          ))}
        </div>
      ) : (
        <p>No active hostels found.</p>
      )}

      <div className="menu">
        {menu.map((item, index) => (
          <div className='cardWithBtnsContainer'>
            <SmallCard key={index} index={index} item={item} handleClick={handleCardClick} />
            <button id="mbladdButton" type="button" onClick={() => handleClick(item.btntext)}><img src={PlusIcon} alt="plusIcon" className='plusIconProperties' /> {item.btntext} </button>
          </div>
        ))}
        {/* <div className='button-container'>
          {Buttons?.map((item, index) => (
            <button id="deskaddButton" type="button" onClick={() => {handleClick(item); setShowForm(true)}}><img src={PlusIcon} alt="plusIcon" className='plusIconProperties' /> {item} </button>
          ))}
        </div> */}
      </div>

      {/* popup model */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="exampleModalRoomsGirls" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal} >
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{modelText}</h1>
              <button onClick={handleCloseModal} className="btn-close" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                {renderFormLayout()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {popupOpen &&
        <div className="popupBeds" id="example">
          <Button variant="primary" onClick={() => setPopupOpen(true)}>Open Popup</Button>
          <Modal show={popupOpen} onHide={onClickCloseBedsPopup} dialogClassName="modal-90w">
            <Modal.Header closeButton>
              <Modal.Title>{t('dashboard.unoccupiedBeds')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='custom-modal-body'>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} style={{ border: '1px solid black' }}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} style={{ border: '1px solid black', padding: '8px' }}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" className='btn btn-warning' onClick={onClickCloseBedsPopup}>{t('common.close')}</Button>
            </Modal.Footer>
          </Modal>
        </div>
      }

      {expensePopupOpen &&
        <div className="popupBeds" id="example">
          <Button variant="primary" onClick={() => setExpensePopupOpen(true)}>Open Popup</Button>
          <Modal show={expensePopupOpen} onHide={onClickCloseExpensePopup} dialogClassName="modal-90w">
            <Modal.Header closeButton>
              <Modal.Title>This Month Expenses</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {expenseColumns.map((column, index) => (
                      <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.map((row, index) => (
                    <tr key={index} style={{ border: '1px solid black' }}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} style={{ border: '1px solid black', padding: '8px' }}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Modal.Body>
            <div>
              <p>This Month Total Expenses: {totalExpenses}</p>
            </div>
            <Modal.Footer>
              <Button variant="secondary" className='btn btn-warning' onClick={onClickCloseExpensePopup}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      }

    </div>
  );

};
export default DashboardGirls