import React, { useContext, useEffect, useState } from 'react';
import RoomsIcon from '../../images/Icons (2).png';
import SearchIcon from '../../images/Icons (9).png';
import './RoomsGirls.css';
import Table from '../../Elements/Table';
import { database, push, ref } from "../../firebase";
import { DataContext } from '../../ApiData/ContextProvider';
import { onValue, remove, update } from 'firebase/database';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';

const RoomsGirls = () => {
  const { t }=useTranslation();
  const  role = localStorage.getItem('role');
  let adminRole = "";
  if(role === "admin"){
    adminRole = "Admin";
  }else if(role === "subAdmin"){
    adminRole = "Sub-admin"
  }
  const { activeGirlsHostel } = useData();
  const [floorNumber, setFloorNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [numberOfBeds, setNumberOfBeds] = useState('');
  const [bedRent, setBedRent] = useState('');
  const [rooms, setRooms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [createdBy, setCreatedBy] = useState(adminRole); // Default to 'admin'
  const [updateDate, setUpdateDate] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      console.log("Triggering")
        if (showModal && (event.target.id === "exampleModalGirls" || event.key === "Escape")) {
            setShowModal(false);
        }
       
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener("keydown", handleOutsideClick)
    
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
      switch(name) {
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


  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();  // Get current date-time in ISO format

    // Initialize an object to collect errors
    const newErrors = {};

    // Validation checks
    if (!floorNumber.trim()) newErrors.floorNumber = 'Floor number is required';
    if (!roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    else if (rooms.some(room => room.roomNumber === roomNumber && room.id !== currentId)) {
      newErrors.roomNumber = 'Room number already exists';
    }
    if (!numberOfBeds) newErrors.numberOfBeds = 'Number of beds is required';
    if (!bedRent) newErrors.bedRent = 'Bed rent is required';

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent form submission if there are errors
    }
    // ---------------------------------------
    if (isEditing) {
      const roomRef = ref(database, `Hostel/girls/${activeGirlsHostel}/rooms/${currentId}`);
      update(roomRef, {
        floorNumber,
        roomNumber,
        numberOfBeds,
        bedRent,
        createdBy,
        updateDate: now
      }).then(() => {
        toast.success("Room updated successfully.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsEditing(false); // Reset editing state
      }).catch(error => {
        toast.error("Error updating room: " + error.message, {
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
      const roomsRef = ref(database, `Hostel/girls/${activeGirlsHostel}/rooms`);
      push(roomsRef, {
        floorNumber,
        roomNumber,
        numberOfBeds,
        bedRent,
        createdBy,
        updateDate: now
      }).then(() => {
        toast.success("Room added successfully.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }).catch(error => {
        toast.error("Error adding room: " + error.message, {
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
    // Close the modal
    setShowModal(false);
    // Reset form
    resetForm();
    // Set update date
    setUpdateDate(now);
    // Clear errors
    setErrors({});
  };
  const [showConfirmationPopUp,setShowConfirmationPopUp] = useState(false);

  const handleDeleteRoom = (id) => {
    // const roomRef = ref(database, `Hostel/girls/rooms/${id}`);
    // remove(roomRef).then(() => {
    //   toast.success("Room deleted successfully.", {
    //     position: "top-center",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // }).catch(error => {
    //   toast.error("Error deleting room: " + error.message, {
    //     position: "top-center",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // });
    setShowConfirmationPopUp(true);
    setShowModal(false);
  };

  const confirmDeleteYes = () => {
    const roomRef = ref(database, `Hostel/girls/${activeGirlsHostel}/rooms/${currentId}`);
    remove(roomRef).then(() => {
      toast.success("Room deleted successfully.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(error => {
      toast.error("Error deleting room: " + error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    setShowConfirmationPopUp(false);

  }

  const confirmDeleteNo = () => {
    setShowConfirmationPopUp(false);
  }
  

  const handleEdit = (room) => {
    setFloorNumber(room.floorNumber);
    setRoomNumber(room.roomNumber);
    setNumberOfBeds(room.numberOfBeds);
    setBedRent(room.bedRent || '');
    setIsEditing(true);
    setCurrentId(room.id);
    // Open the modal
    setShowModal(true);
    const formatedDate = formatDate(room.updateDate)
    setUpdateDate(formatedDate);
  };

  const handleAddNew = () => {
    // Reset form and errors
    resetForm();
    // Set modal for a new entry
    setIsEditing(false);
    // Open the modal
    setShowModal(true);
  };

  const resetForm = () => {
    setFloorNumber('');
    setRoomNumber('');
    setNumberOfBeds('');
    setBedRent('');
    setCurrentId('');
    setErrors({});
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

  const columns = [
    t('roomsPage.S.No'),
    t('roomsPage.Room.No'),
    t('roomsPage.Floor'),
    t('roomsPage.No.of Beds'),
    t('roomsPage.Bed Rent'),
    t('roomsPage.Created By'),
    t('roomsPage.Last Updated Date'),
    t('roomsPage.Edit')
  ];

  
  //for date format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}




  useEffect(() => {
    const rows = rooms.map((room, index) => ({
      s_no: index + 1,
      room_no: room.roomNumber,
      floor:capitalizeFirstLetter(room.floorNumber),
      noofBeds: room.numberOfBeds,
      bedRent: room.bedRent,
      created_by: capitalizeFirstLetter(room.createdBy),
      last_updated_by: formatDate(room.updateDate),
      edit_room: <button
        style={{ backgroundColor: '#ff8a00', padding:'4px', borderRadius: '5px', color: 'white', border: 'none' }}
        onClick={() => handleEdit(room)}
      >
        Edit
      </button>
    }));
    setInitialRows(rows);
  }, [rooms, activeGirlsHostel]);

  const [searchTerm, setSearchTerm] = useState('');
  const [initialRows, setInitialRows] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = initialRows.filter(row => {
    return Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const  closePopupModal = () => {
    setShowModal(false);
  }

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',  
    }));
  };

  const isUneditable = role === 'admin' || role === 'subAdmin';
  return (
    <div className='h-100'>
      <>
      <div className="row d-flex flex-wrap align-items-center justify-content-between">
        <div className="col-12 col-md-4 d-flex align-items-center mr-5 mb-2">
          <div className='roomlogo-container'>
            <img src={RoomsIcon} alt="RoomsIcon" className='roomlogo' />
          </div>
          <h1 className='management-heading'>{t('roomsPage.RoomsManagement')}</h1>
        </div>
        <div className="col-6 col-md-4 search-wrapper">
          <input type="text" placeholder={t('common.search')} className='search-input' value={searchTerm} onChange={handleChange} />
          <img src={SearchIcon} alt="search-icon" className='search-icon' />
        </div>
        <div className="col-6 col-md-4 d-flex justify-content-end">
          <button id="roomGirlsPageBtn" type="button" className="add-button" onClick={handleAddNew}>
          {t('dashboard.addRooms')}
          </button>
        </div>
      </div>
<div>
      <Table columns={columns} rows={filteredRows} />
      </div>
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="exampleModalGirls" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{t('roomsPage.CreateRoom')}</h1>
              <button onClick={closePopupModal} className="btn-close" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label htmlFor="inputNumber" className="form-label">{t('roomsPage.floorNumber')}</label>
                    <input type="text" className="form-control" id="inputNumber" name="floorNumber" value={floorNumber} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
                    {errors.floorNumber && <div style={{ color: 'red' }}>{errors.floorNumber}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputRent" className="form-label">{t('roomsPage.roomNumber')}</label>
                    <input type="text" className="form-control" id="inputRent" name="roomNumber" value={roomNumber} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
                    {/* {formErrors.rent && <div className="text-danger">{formErrors.rent}</div>} */}
                    {errors.roomNumber && <div style={{ color: 'red' }}>{errors.roomNumber}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputRooms" className="form-label">{t('roomsPage.numberOfBeds')}</label>
                    <input type="text" className="form-control" id="inputRooms" name="numberOfBeds" value={numberOfBeds} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
                    {/* {formErrors.rooms && <div className="text-danger">{formErrors.rooms}</div>} */}
                    {errors.numberOfBeds && <div style={{ color: 'red' }}>{errors.numberOfBeds}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputStatus" className="form-label">{t('roomsPage.bedRent')}</label>
                    <input type="text" className="form-control" id="inputStatus" name="bedRent" value={bedRent} onChange={handleRoomsIntegerChange} onFocus={handleFocus} />
                    {/* {formErrors.status && <div className="text-danger">{formErrors.status}</div>} */}
                    {errors.bedRent && <div style={{ color: 'red' }}>{errors.bedRent}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputRole" className="form-label">{t('roomsPage.createdBy')}</label>
                    {/* <select className="form-select" id="inputRole" name="role" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}>
                      <option value="admin">{t('dashboard.admin')}</option>
                      <option value="sub-admin">{t('dashboard.subAdmin')}</option>
                    </select> */}
                    <input disabled={isUneditable} type="text" className='form-control' id="inputRole" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}/>
                  </div>
                  <div className="col-12 text-center">
                    {isEditing ? (
                      <>
                      <button type="button" className="btn btn-warning roomUpdateBtn" onClick={handleSubmit}>{t('roomsPage.Update Room')}</button>
                      {role === "admin" ? <button type="button" className='btn btn-warning' onClick={() => handleDeleteRoom(currentId)}>{t('roomsPage.Delete Room')}</button> : null}
                      </>
                    ) : (
                      <button type="submit" className="btn btn-warning">{t('roomsPage.CreateRoom')}</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmationPopUp && (
         <div className="confirmation-dialog">
         <div className='confirmation-card'>
         <p style={{paddingBottom:'0px',marginBottom:'7px'}}>{t('roomsPage.Are you sure you want to delete the room with number')} <span style={{color:'red'}}>{roomNumber}</span> ?</p>
         <p style={{fontSize:'15px',color:'red',textAlign:'center',paddingTop:'0px'}}>{t('roomsPage.Once you delete the room it will not be restored')}</p>
         <div className="buttons">
           <button onClick={confirmDeleteYes} >{t('roomsPage.Yes')}</button>
           <button onClick={confirmDeleteNo} >{t('roomsPage.No')}</button>
         </div>
         </div>
       </div>
      )}
      </>
    </div>
  );
}

export default RoomsGirls;
