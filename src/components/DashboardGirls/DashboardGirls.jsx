import React, { useEffect, useRef, useState } from 'react'
import Rooms from '../../images/Icons (2).png'
import Beds from '../../images/Icons (3).png'
import Tenants from '../../images/Icons (4).png'
import Expenses from '../../images/Icons (5).png'
import './DashboardGirls.css'
import SmallCard from '../../Elements/SmallCard'
import PlusIcon from '../../images/Icons (8).png'
import { push, ref } from "../../firebase/firebase";
import { onValue, update } from 'firebase/database';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import { useData } from '../../ApiData/ContextProvider';
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
// import Joyride, { STATUS } from "react-joyride";

import Spinner from '../../Elements/Spinner';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const DashboardGirls = () => {

  // const [run, setRun] = useState(true);
  // const [steps] = useState([
  //   {
  //     target: '.hamburger-menu',
  //     content: 'Click here to open the menu.',
  //   },
  //   {
  //     target: '.menu-item-1',
  //     content: 'This is the first menu item. Click to navigate.',
  //   },
  //   {
  //     target: '.menu-item-2',
  //     content: 'This is the second menu item. Click to navigate.',
  //   },
  //   // Add more steps as needed
  //   {
  //     target: '.total-rooms-card',
  //     content: 'Here you can see the total rooms. Click to add rooms.',
  //   },
  //   {
  //     target: '.total-tenants-card',
  //     content: 'Here you can see the total tenants. Click to add tenants.',
  //   },
  //   {
  //     target: '.total-beds-card',
  //     content: 'Here you can see the total beds. Click to manage rent.',
  //   }
  // ]);

  // const handleJoyrideCallback = (data) => {
  //   const { status, type } = data;
  //   if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
  //     setRun(false);
  //   }
  // };


  const { t } = useTranslation();
  // created by admin or subAdmin 
  const role = localStorage.getItem('role');
  let adminRole = "";
  if (role === "admin") {
    adminRole = "Admin";
  } else if (role === "subAdmin") {
    adminRole = "Sub-admin"
  }
  const isUneditable = role === 'admin' || role === 'subAdmin';


  const { activeGirlsHostel, setActiveGirlsHostel,setActiveGirlsHostelName, activeGirlsHostelButtons, userUid, firebase,  changeActiveFlag, girlsRooms, fetchData, girlsTenants, girlsTenantsWithRents, entireHMAdata } = useData();
  const { database, storage } = firebase;

  const [loading, setLoading] = useState(false);


  const [modelText, setModelText] = useState('');
  const [formLayout, setFormLayout] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [numberOfBeds, setNumberOfBeds] = useState('');
  // const [rooms, setRooms] = useState([]);
  const [bedRent, setBedRent] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [createdBy, setCreatedBy] = useState(adminRole);
  const [updateDate, setUpdateDate] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([])
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
  const [currentTenantId, setCurrentTenantId] = useState('');
  const [tenatErrors, setTenantErrors] = useState({});
  const [tenantImage, setTenantImage] = useState(null);
  const [tenantImageUrl, setTenantImageUrl] = useState('');
  const [tenantId, setTenantId] = useState(null);
  const [tenantIdUrl, setTenantIdUrl] = useState('');
  const imageInputRef = useRef(null);
  const idInputRef = useRef(null);
  const [girlsRoomsData, setGirlsRoomsData] = useState([]);

  const [showForm, setShowForm] = useState(true);
  const [hasBike, setHasBike] = useState(false);
  const [bikeNumber, setBikeNumber] = useState('NA');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [notify, setNotify] = useState(false);
  const [notifyUserInfo, setNotifyUserInfo] = useState(null);
  const [totalTenantsData, setTotalTenantData] = useState({});
  const [permnentAddress, setPermnentAddress] = useState("");
  const [bikeImage, setBikeImage] = useState(null);
  const [bikeImageUrl, setBikeImageUrl] = useState('');
  const [bikeImageField, setBikeImageField] = useState('');
  const [bikeRcImage, setBikeRcImage] = useState('');
  const [bikeRcImageUrl, setBikeRcImageUrl] = useState('');
  const [bikeRcImageField, setBikeRcImageField] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
  // const [girlsRooms, setGirlsRooms] = useState([]);
  const [bedNumber, setBedNumber] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [due, setDue] = useState('');
  // const [tenantsWithRents, setTenantsWithRents] = useState([]);
  const [paidDate, setPaidDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingRentId, setEditingRentId] = useState(null);
  const [availableTenants, setAvailableTenants] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [expensePopupOpen, setExpensePopupOpen] = useState(false);
  const [bedsData, setBedsData] = useState([]);

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
    const currentMonth = new Date().getMonth();
    return monthNames[currentMonth];
  };

  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };

  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const minDate = `${getCurrentYear()}-01-01`;
  const maxDate = `${getCurrentYear()}-12-31`;



  // useEffects 
  useEffect(() => {
    const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants`);
    onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTenants = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setTotalTenantData(loadedTenants)
    })


  }, [selectedTenant])

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
  //     setRooms(loadedRooms);
  //   });
  // }, [activeGirlsHostel]);

  // useEffect(() => {
  //   const formattedMonth = month.slice(0, 3).toLowerCase();
  //   const expensesRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/expenses/${year}-${formattedMonth}`);
  //   onValue(expensesRef, (snapshot) => {
  //     const data = snapshot.val();
  //     let total = 0;
  //     const expensesArray = [];
  //     for (const key in data) {
  //       const expense = {
  //         id: key,
  //         ...data[key],
  //         expenseDate: formatDate(data[key].expenseDate)
  //       };
  //       total += expense.expenseAmount;
  //       expensesArray.push(expense);
  //     }
  //     setCurrentMonthExpenses(expensesArray);
  //     setTotalExpenses(total);
  //   });
  // }, [activeGirlsHostel]);

  useEffect(() => {
    if (!entireHMAdata || !activeGirlsHostel ) return;
  
    const formattedMonth = month.slice(0, 3).toLowerCase(); // Make sure the month is formatted correctly
    const expensesData = entireHMAdata[userUid]?.girls?.[activeGirlsHostel]?.expenses?.[`${year}-${formattedMonth}`];
  
    if (!expensesData) {
      setCurrentMonthExpenses([]); // Set to empty array if no expenses data is available
      setTotalExpenses(0); // Reset total expenses
      return;
    }
  
    const loadedExpenses = [];
    let totalExpenses = 0;
  
    for (const key in expensesData) {
      const expense = {
        id: key,
        ...expensesData[key],
        expenseDate: formatDate(expensesData[key]?.expenseDate || ""), // Handle missing expenseDate
      };
      totalExpenses += expense.expenseAmount || 0; // Ensure expenseAmount exists
      loadedExpenses.push(expense);
    }
  
    setCurrentMonthExpenses(loadedExpenses); // Update the current month's expenses
    setTotalExpenses(totalExpenses); // Update the total expenses for the current month
  }, [entireHMAdata, activeGirlsHostel, month, year, userUid]);
  


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
  //   // Fetch tenants
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
  }, [selectedRoom, girlsRooms, activeGirlsHostel]);

  useEffect(() => {
    const updateTotalFeeFromRoom = () => {
      const roomsArray = Object.values(girlsRooms);
      const matchingRoom = roomsArray.find(room => room.roomNumber === roomNumber);

      if (matchingRoom && matchingRoom.bedRent) {
        setTotalFee(matchingRoom.bedRent.toString());
      } else {
        setTotalFee('');
      }
    };

    if (roomNumber) {
      updateTotalFeeFromRoom();
    }
  }, [roomNumber, girlsRooms]);


  useEffect(() => {
    if (selectedTenant) {
      const tenant = girlsTenants.find(t => t.id === selectedTenant);
      if (tenant) {
        setRoomNumber(tenant.roomNo || '');
        setBedNumber(tenant.bedNo || '');
        setDateOfJoin(tenant.dateOfJoin || '');
      }
    } else {
      setRoomNumber('');
      setBedNumber('');
      setPaidAmount('');
      setDue('');
      setDateOfJoin('');
      setDueDate('');
    }
  }, [selectedTenant, girlsTenants, activeGirlsHostel]);

  useEffect(() => {
    const tenantIdsWithRents = girlsTenantsWithRents.flatMap(tenant =>
      tenant.rents.length > 0 ? [tenant.id] : []
    );

    const availableTenants = girlsTenants.filter(
      tenant => !tenantIdsWithRents.includes(tenant.id)
    );

    setAvailableTenants(availableTenants);
  }, [girlsTenants, girlsTenantsWithRents, activeGirlsHostel]);


  useEffect(() => {
    const calculatedDue = Math.max(parseFloat(totalFee) - parseFloat(paidAmount), 0).toString();
    setDue(calculatedDue);
  }, [paidAmount, totalFee]);

  // useEffect(() => {
  //   const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants`);
  //   onValue(tenantsRef, (snapshot) => {
  //     const tenantsData = snapshot.val();
  //     const tenantIds = tenantsData ? Object.keys(tenantsData) : [];

  //     const rentsPromises = tenantIds.map(tenantId => {
  //       return new Promise((resolve) => {
  //         const rentsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/${tenantId}/rents`);
  //         onValue(rentsRef, (rentSnapshot) => {
  //           const rents = rentSnapshot.val() ? Object.keys(rentSnapshot.val()).map(key => ({
  //             id: key,
  //             ...rentSnapshot.val()[key],
  //           })) : [];
  //           resolve({ id: tenantId, ...tenantsData[tenantId], rents });
  //         }, {
  //           onlyOnce: true
  //         });
  //       });
  //     });

  //     Promise.all(rentsPromises).then(tenantsWithTheirRents => {
  //       setTenantsWithRents(tenantsWithTheirRents);
  //     });
  //   });
  // }, []);


  useEffect(() => {
    const handleOutsideClick = (event) => {
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
      setBedsData([]);
      return;
    }

    const allBeds = girlsRooms.flatMap(room => {
      return Array.from({ length: room.numberOfBeds }, (_, i) => {
        const bedNumber = i + 1;
        const tenant = girlsTenants.find(tenant => tenant.roomNo === room.roomNumber && tenant.bedNo === String(bedNumber));
        return {
          floorNumber: room.floorNumber,
          roomNumber: room.roomNumber,
          bedNumber: bedNumber,
          rent: room.bedRent || "N/A",
          status: tenant ? "Occupied" : "Unoccupied"
        };
      });
    });
    setBedsData(allBeds);
  }, [girlsRooms, girlsTenants]);


  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     setBikeImage(reader.result);

  //   };

  //   reader.readAsDataURL(file);
  // };
  const isFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  };
 



  // const handleRcChange = (e) => {
  //   const file1 = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setBikeRcImage(reader.result);
  //   }
  //   reader.readAsDataURL(file1);

  // }



  const sendMessage = (tenant, rentRecord) => {

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

    const phoneNumber = tenant.mobileNo;
    const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

    const encodedMessage = encodeURIComponent(message);

    let whatsappLink = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
  };
  const handleNotifyCheckbox = (rentData) => {
    if (notify && notifyUserInfo) {

      sendMessage(notifyUserInfo, rentData);
    }
    setNotify(!notify);
  };

  //  for camera icon in mobile device
  const [isMobile, setIsMobile] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [idUrl,setIdUrl]=useState(null);
  
  useEffect(() => {
    // Check if the user agent is a mobile device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsMobile(/iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
}, []);

const takePicture = async () => {
  if (!isMobile) {
      console.error("Camera access is not supported on your device.");
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

      setTenantImage(blob); // Set the blob to tenantImage
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
      const uploadedUrl = await uploadFile(blob, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/images/tenantImage/${blob.name}`);
      setPhotoUrl(uploadedUrl); // Set the uploaded URL to display the image
  } catch (error) {
      console.error("Error accessing the camera", error);
      toast.error(t('toastMessages.imageNotUploaded'));    }
}
  // const takeIdPicture = async () => {

  //   if (!isMobile) {
  //     console.error("Camera access is not supported on your device.");
  //     return;
  // }
  //   try {
  //     const photo = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.Uri
  //     });
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setIdUrl(reader.result);
  //       setTenantId(reader.result);
  //     };
  //     fetch(photo.webPath).then(response => response.blob()).then(blob => reader.readAsDataURL(blob));
  //     // const response = await fetch(photo.webPath);
  //     // const blob = await response.blob();
  //     // const imageRef = storageRef(storage, `Hostel/boys/tenants/images/${new Date().getTime()}`);
  //     // const snapshot = await uploadBytes(imageRef, blob);
  //     // const url = await getDownloadURL(snapshot.ref);
      
  //     // setPhotoUrl(url); // Display in UI
  //     // setTenantImageUrl(url); // Use in form submission
  //     // setPhotoUrl(photo.webPath);
  //   } catch (error) {
  //     console.error("Error accessing the camera", error);
  //     toast.error("Id not Uploaded");
  //   }
  // };

  const takeIdPicture = async () => {
    if (!isMobile) {
        console.error("Camera access is not supported on your device.");
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

        setTenantId(blob); // Set the blob to tenantImage
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
        const uploadedUrl = await uploadFile(blob, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/images/tenantId/${blob.name}`);
        setIdUrl(uploadedUrl); // Set the uploaded URL to display the image
    } catch (error) {
        console.error("Error accessing the camera", error);
        toast.error(t('toastMessages.imageNotUploaded'));
    }
}

  const handleCheckboxChange = (e) => {
    setHasBike(e.target.value == 'yes');
    if (e.target.value == 'no') {
      setHasBike(false);
      setBikeNumber('NA');
    } else {
      setBikeNumber('');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };




  const handleRoomsIntegerChange = (event) => {
    const { name, value } = event.target;
    let sanitizedValue = value;

    if (name === 'floorNumber' || name === 'roomNumber') {

      sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '');
    } else if (name === 'numberOfBeds' || name === 'bedRent') {
      sanitizedValue = value.replace(/[^0-9]/g, '');
    }
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
    const now = new Date().toISOString();
    const newErrors = {};
    if (!floorNumber.trim()) newErrors.floorNumber = t('errors.floorNumberRequired');
    if (!roomNumber.trim()) newErrors.roomNumber = t('errors.roomNumberRequired');
    else if (girlsRooms.some(room => room.roomNumber === roomNumber && room.id !== currentId)) {
      newErrors.roomNumber = t('errors.roomNumberExists');
    }
    if (!numberOfBeds) newErrors.numberOfBeds = t('errors.numberOfBedsRequired');
    if (!bedRent) newErrors.bedRent = t('errors.bedRentRequired');
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const roomsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/rooms`);
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
      fetchData()
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

    setFloorNumber('');
    setRoomNumber('');
    setNumberOfBeds('');
    setBedRent('');
    setCurrentId('');
    setUpdateDate(now);
    setErrors({});
    setShowModal(false);
  };

  const totalBeds = girlsRooms.reduce((acc, room) => acc + Number(room.numberOfBeds), 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };


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
      return tenant.roomNo === selectedRoom && tenant.bedNo === selectedBed && tenant.status === "occupied" && tenant.id !== currentTenantId;
    });

    if (isBedOccupied) {
      tempErrors.selectedBed = t('errors.bedAlreadyOccupied');
    }
    if (!tenantImage) {
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

    setTenantErrors(tempErrors);
    return Object.keys(tempErrors).every((key) => tempErrors[key] === "");
  };

  // const handleTenantImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {

  //       setTenantImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
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


 

  const handleTenantSubmit = async (e) => {
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
            fetchData();
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
            fetchData();
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
        imageInputRef.current.value = "";
    idInputRef.current.value = "";
    }
};


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


    if (!validateRentForm()) {

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
      status: parseFloat(due) <= 0 ? 'Paid' : 'Unpaid',
    };

    if (isEditing) {

      const rentRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/${selectedTenant}/rents/${editingRentId}`);
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
        fetchData()
        setIsEditing(false);
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

      const rentRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/${selectedTenant}/rents`);
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
        fetchData();
        setIsEditing(false);
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
    setPermnentAddress('')
    setHasBike(false)
    setBikeNumber('NA')
    setBikeImage(null);
    setBikeRcImage(null);
    setPhotoUrl(null);
    setIdUrl(null);
    setTenantImage(null);
  };

  const menu = [
    {
      image: Rooms,
      heading: t('dashboard.totalRooms'),
      number: `${girlsRooms.length}`,
      btntext: t('dashboard.addRooms'),
    },

    {
      image: Tenants,
      heading: t('dashboard.totalTenants'),
      number: `${girlsTenants.length}`,
      btntext: t('dashboard.addTenants'),
    },
    {
      image: Beds,
      heading: t('dashboard.totalBeds'),
      number: `${totalBeds}/${totalBeds - girlsTenants.length}`,
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
    if (activeGirlsHostelButtons.length == 0) {
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
      setModelText(text);
      setFormLayout(text);
      setShowModal(true);
    }

  };

  const handleCloseModal = () => {
    setModelText('');
    setFormLayout('');
    resetForm();
    setShowModal(false);
    setHasBike(false);
    setBikeNumber("NA");
  };


  const getMonthYearKey = (dateString) => {
    const date = new Date(dateString);
    const monthFull = date.toLocaleString('default', { month: 'short' });
    const month = monthFull.slice(0, 3).toLowerCase();
    const year = date.getFullYear();
    return `${year}-${month}`;
  };

  const expensesHandleSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    let formIsValid = true;

    if (!formData.expenseName.match(/^[a-zA-Z\s]+$/)) {
      errors.expenseName = t('errors.expenseNameAlphabetsAndSpaces');
      formIsValid = false;
    }


    if (!formData.expenseAmount.match(/^\d+(\.\d{1,2})?$/)) {
      errors.expenseAmount = t('errors.expenseAmountValidNumber');
      formIsValid = false;
    }


    if (!formData.expenseName) {
      errors.expenseName = t('errors.expenseNameRequired');
      formIsValid = false;
    }

    if (!formData.expenseAmount) {
      errors.expenseAmount = t('errors.expenseAmountRequired');
      formIsValid = false;
    }

    if (!formData.expenseDate) {
      errors.expenseDate = t('errors.expenseDateRequired');
      formIsValid = false;
    }
    if (formIsValid) {
      const monthYear = getMonthYearKey(formData.expenseDate);
      const expensesRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/expenses/${monthYear}`);
      push(expensesRef, {
        ...formData,
        expenseAmount: parseFloat(formData.expenseAmount),
        expenseDate: new Date(formData.expenseDate).toISOString()
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
        fetchData();
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

      setFormErrors(errors);
    }
  };



  const onClickCheckbox = () => {
    setNotify(!notify)
    const singleTenant = totalTenantsData.filter(tenant =>
      tenant.id === selectedTenant
    );
    const singleTenantData = singleTenant[0];
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
      [name]: '',
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
                    <select id="bedNo" class="form-select" value={selectedTenant} onChange={e => setSelectedTenant(e.target.value)} name="selectedTenant" onFocus={handleFocus}>
                      <option value="">{t('dashboard.selectTenant')} *</option>
                      {availableTenants.map(tenant => (
                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                      ))}
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
                    <input id="PaidAmount" class="form-control" type="text" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} name="paidAmount" onFocus={handleFocus} />
                    {errors.paidAmount && <div style={{ color: 'red' }}>{errors.paidAmount}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="Due" class="form-label">{t('dashboard.due')}:</label>
                    <input id="Due" class="form-control" type="number" value={due} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='DateOfJoin' class="form-label">{t('dashboard.dateOfJoin')}:</label>
                    <input id="DateOfJoin" class="form-control" type="date" value={dateOfJoin} readOnly
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
                        onChange={onClickCheckbox}
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
                      {isEditing ? (
                        <option key={selectedTenant} value={selectedTenant}>{girlsTenantsWithRents.find(tenant => tenant.id === selectedTenant)?.name}</option>
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
                    <input id="TotalFee" class="form-control" type="text" value={totalFee} onChange={e => setTotalFee(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}/>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="PaidAmount" class="form-label">{t('dashboard.paidAmount')}</label>
                    <input id="PaidAmount" class="form-control" type="text" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} name="paidAmount" onFocus={handleFocus} />
                    {errors.paidAmount && <div style={{ color: 'red' }}>{errors.paidAmount}</div>}
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor="Due" class="form-label">{t('dashboard.due')}</label>
                    <input id="Due" class="form-control" type="number" value={due} readOnly />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label htmlFor='DateOfJoin' class="form-label">{t('dashboard.dateOfJoin')}</label>
                    <input id="DateOfJoin" class="form-control" type="date" value={dateOfJoin} readOnly
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
                        onChange={onClickCheckbox}
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
              <input id="tenantMobileNo" class="form-control" type="text" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9 ]/g, '')} name="mobileNo" onFocus={handleTenantFocus} />

              {tenatErrors.mobileNo && <p style={{ color: 'red' }}>{tenatErrors.mobileNo}</p>}
            </div>
            <div class="col-md-6">
              <label htmlFor='tenantIdNum' class="form-label">
                {t('dashboard.idNumber')}
              </label>
              <input id="tenantIdNum" class="form-control" type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')} name="idNumber" onFocus={handleTenantFocus} />

              {tenatErrors.idNumber && <p style={{ color: 'red' }}>{tenatErrors.idNumber}</p>}
            </div>
            <div class="col-md-6">
              <label htmlFor='tenantEmergency' class="form-label">
                {t('dashboard.emergencyContact')}
              </label>
              <input id="tenantEmergency" class="form-control" type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)}  onInput={e => e.target.value = e.target.value.replace(/[^0-9 ]/g, '')} name="emergencyContact" onFocus={handleTenantFocus} />

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
              {isEditing && tenantImage && (
                <div>
                  <img src={tenantImage} alt="Current Tenant" style={{ width: "100px", height: "100px" }} />
                  <p>{t('dashboard.currentImage')}</p>
                </div>
              )}
              <input id="tenantUpload" class="form-control" type="file" accept=".jpg, .jpeg, .png" onChange={handleTenantImageChange} ref={imageInputRef}  />
              {isMobile && (
                  <div>
                  <p>{t('tenantsPage.or')}</p>
                  <div style={{display:'flex',flexDirection:'row'}}>
                  <p>{t('tenantsPage.takePhoto')}</p>
                  <FontAwesomeIcon icon={faCamera} size="2x" onClick={takePicture} style={{marginTop:'-7px',paddingLeft:'30px'}}/>
                  {photoUrl && <img src={photoUrl} alt="Captured" style={{ marginTop: 50,marginRight:40, Width: '100px', height: '100px' }} />}
                  </div>
                  </div>
                    )}


              {errors.tenantImage && <p style={{ color: 'red' }}>{errors.tenantImage}</p>}
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
            <div class="col-md-6">
              <label htmlFor='tenantUploadId' class="form-label">
                {t('dashboard.uploadId')}:
              </label>
              {isEditing && tenantId && (
                <object
                  data={tenantId}
                  type="application/pdf"
                  width="50%"
                  height="200px"
                >
                  <a href={tenantId}>{t('dashboard.downloadPdf')}</a>
                </object>
              )}
              <input id="tenantUploadId" class="form-control" type="file" accept=".jpg, .jpeg, .png, .pdf" onChange={handleTenantIdChange} ref={idInputRef}  />
              {isMobile && (
                  <div>
                  <p>{t('tenantsPage.or')}</p>
                  <div style={{display:'flex',flexDirection:'row'}}>
                  <p>{t('tenantsPage.takePhoto')}</p>
                  <FontAwesomeIcon icon={faCamera} size="2x" onClick={takeIdPicture} style={{marginTop:'-7px',paddingLeft:'30px'}}/>
                  {idUrl && <img src={idUrl} alt="Captured" style={{  marginTop: 50,marginRight:40, Width: '100px', height: '100px'}}/>}
                  </div>
                  </div>
                    )}
                    {errors.tenantId && <p style={{ color: 'red' }}>{errors.tenantId}</p>}
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
              <div className='bikeField'>
                <label class="bikenumber" htmlFor="bikeNumber" >{t('dashboard.bikeNumber')}</label>
                <input
                  type="text"
                  id="bikeNumber"

                  className='form-control'
                  placeholder="Enter number plate ID"
                  value={bikeNumber}
                  onChange={(event) => setBikeNumber(event.target.value)}
                  onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')}
                  style={{ flex: '2', borderRadius: '5px', borderColor: 'beize', outline: 'none', marginTop: '0', borderStyle: 'solid', borderWidth: '1px', borderHeight: '40px' }}
                />
              </div>
            )
            }

            {tenatErrors.bikeNumber && <p style={{ color: 'red', marginLeft: "4px" }}>{tenatErrors.bikeNumber}</p>}

            {hasBike && (
              <>
                <div className="col-md-6">
                  <label htmlFor="bikeimage" className="form-label">{t('tenantsPage.BikePic')}</label>
                  <input type="file" className="form-control"accept=".jpg, .jpeg, .png" onChange={handleTenantBikeChange} />
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="bikeRc" className="form-label">{t('tenantsPage.BikeRc')}</label>
                  <input type="file" className="form-control"  accept=".jpg, .jpeg, .png, .pdf" onChange={handleTenantBikeRcChange} />
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
              </>
            )}


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
              <input type="text" className="form-control" name="expenseName" value={formData.expenseName} onChange={handleInputChange} onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')} onFocus={handleExpensesFocus} />
              {formErrors.expenseName && <div className="text-danger">{formErrors.expenseName}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="inputRent" className="form-label">{t('dashboard.expenseAmount')}</label>
              <input type="text" className="form-control" name="expenseAmount" value={formData.expenseAmount} onInput={e => e.target.value = e.target.value.replace(/[^0-9 ]/g, '')} onChange={handleInputChange} onFocus={handleExpensesFocus} />
              {formErrors.expenseAmount && <div className="text-danger">{formErrors.expenseAmount}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="inputDate" className="form-label">{t('dashboard.expenseDate')}</label>
              <input type="date" min={minDate} max={maxDate} className="form-control" name="expenseDate" value={formData.expenseDate} onChange={handleInputChange} onFocus={handleExpensesFocus} />
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


  const handleCardClick = (item) => {
    if (item.heading === t('dashboard.totalBeds')) {
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



  const rows = bedsData.filter((bed) => bed.status === 'Unoccupied').map((bed, index) => ({

    bed_number: bed.bedNumber,
    room_no: bed.roomNumber,
    floor: bed.floorNumber,
  }));

  const columns = [

    t('table.bedNumber'),
    t('table.roomNo'),
    t('table.floor'),
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



  return (
    <div className="dashboardgirls">
     
      {activeGirlsHostelButtons.length > 0 ? (
        <div>
          <h1 className="heading1">{t('dashboard.womens')}</h1>
          <div className={"flex1"}>
            {activeGirlsHostelButtons.map((button, index) => (
              <button
                className={`btn m-1 ${activeGirlsHostel === button.id ? 'active-button' : 'inactive-button'}`}
                onClick={() =>{ setActiveGirlsHostel(button.id); setActiveGirlsHostelName(button.name); changeActiveFlag('girls') }}
                key={button.id}
                style={{
                  backgroundColor: activeGirlsHostel === button.id ? '#FF8A00' : '#fac38c',
                  color: activeGirlsHostel === button.id ? 'white' : '#333333'
                }}
              >
                {button.name}
              </button>
            ))}
          </div>
          <div className="menu">
            {menu.map((item, index) => (
              <div key={index} className='cardWithBtnsContainer'>
                <SmallCard key={index} index={index} item={item} handleClick={handleCardClick} />
                <button id="mbladdButton" type="button" onClick={() => handleClick(item.btntext)}><img src={PlusIcon} alt="plusIcon" className='plusIconProperties' /> {item.btntext} </button>
              </div>
            ))}

          </div>
        </div>
      ) : (
        ''
      )}

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

      {loading && <Spinner />}

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