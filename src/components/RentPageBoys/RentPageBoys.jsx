import React, { useContext, useEffect, useRef } from 'react'
import Table from '../../Elements/Table'
import RentIcon from '../../images/Icons (6).png'
import SearchIcon from '../../images/Icons (9).png'
import { database, push, ref } from "../../firebase";
import { useState } from 'react'
import { DataContext } from '../../ApiData/ContextProvider';
import { onValue, update } from 'firebase/database';
import "../RoomsBoys/RoomsBoys.css"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaWhatsapp } from "react-icons/fa";
import "../../App.css"
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';

const RentPageBoys = () => {
  const { t } = useTranslation();
  const { data } = useContext(DataContext);
  const { activeBoysHostel } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState({});
  const [selectedTenant, setSelectedTenant] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [due, setDue] = useState('');
  const [tenantsWithRents, setTenantsWithRents] = useState([]);
  const [paidDate, setPaidDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingRentId, setEditingRentId] = useState(null);
  const [errors, setErrors] = useState({});
  const [availableTenants, setAvailableTenants] = useState([]);
  const [dateOfJoin, setDateOfJoin] = useState();
  const [showModal, setShowModal] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notifyUserInfo, setNotifyUserInfo] = useState(null);
  const [showForm, setShowForm] = useState(true);


  // Function to send WhatsApp message
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
    if (notify && notifyUserInfo) {
      const { tenant, rentRecord } = notifyUserInfo;
      console.log(tenant, "InNotify")
      sendMessage(tenant, rentData); // If checkbox is checked and tenant info is available, send WhatsApp message
    }
    setNotify(!notify);
  };


  useEffect(() => {
    const handleOutsideClick = (event) => {
      console.log("Triggering")
      if (showModal && (event.target.id === "exampleModalRentsBoys" || event.key === "Escape")) {
        setShowModal(false);
      }

    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleOutsideClick)
  }, [showModal]);



  useEffect(() => {
    // Fetch tenants data once when component mounts
    const tenantsRef = ref(database, `Hostel/boys/${activeBoysHostel}/tenants`);
    onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTenants = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setTenants(loadedTenants);
    });

    // Fetch room data once when component mounts
    const roomsRef = ref(database, `Hostel/boys/${activeBoysHostel}/rooms`);
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setRooms(data);
    });
  }, [activeBoysHostel]);

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
  }, [selectedTenant, tenants]);

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
  }, [tenants, tenantsWithRents, activeBoysHostel]);


  useEffect(() => {
    // Recalculate due when paid amount changes
    const calculatedDue = Math.max(parseFloat(totalFee) - parseFloat(paidAmount), 0).toString();
    setDue(calculatedDue);
  }, [paidAmount, totalFee]);

  useEffect(() => {
    // Fetch tenants data once when component mounts
    const tenantsRef = ref(database, `Hostel/boys/${activeBoysHostel}/tenants`);
    onValue(tenantsRef, (snapshot) => {
      const tenantsData = snapshot.val();
      const tenantIds = tenantsData ? Object.keys(tenantsData) : [];

      // Initialize an array to hold promises for fetching each tenant's rents
      const rentsPromises = tenantIds.map(tenantId => {
        return new Promise((resolve) => {
          const rentsRef = ref(database, `Hostel/boys/${activeBoysHostel}/tenants/${tenantId}/rents`);
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
  }, [activeBoysHostel]);

  // edit======================
  const loadRentForEditing = (tenantId, rentId) => {
    const tenant = tenantsWithRents.find(t => t.id === tenantId);
    const rentRecord = tenant.rents.find(r => r.id === rentId);


    if (rentRecord) {
      setSelectedTenant(tenantId || '');
      setRoomNumber(rentRecord.roomNumber || '');
      setBedNumber(rentRecord.bedNumber || '');
      setTotalFee(rentRecord.totalFee || '');
      setPaidAmount(rentRecord.paidAmount || '');
      setDue(rentRecord.due || '');
      setPaidDate(rentRecord.paidDate || '');
      setDueDate(rentRecord.dueDate || '');
      setIsEditing(true);
      setEditingRentId(rentId);


    }
    setShowModal(true);
    // console.log(selectedTenant)
    setNotifyUserInfo({ tenant, rentRecord });
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!selectedTenant) {
      formIsValid = false;
      errors["selectedTenant"] =t('errors.selectedTenantRequired');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) {
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
      status: parseFloat(due) <= 0 ? 'Paid' : 'Unpaid',
    };

    if (isEditing) {
      // Update the existing rent record
      const rentRef = ref(database, `Hostel/boys/${activeBoysHostel}/tenants/${selectedTenant}/rents/${editingRentId}`);
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

        console.log(rentData, "Getting");
        if (notify) {
          handleNotifyCheckbox(rentData);
        }
      }).catch(error => {
        toast.error(t('toastMessages.errorUpdatingRent')  + error.message, {
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
      const rentRef = ref(database, `Hostel/boys/${activeBoysHostel}/tenants/${selectedTenant}/rents`);
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
        console.log(rentData, "Getting");
        if (notify) {
          handleNotifyCheckbox(rentData);
        }
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
  //===> For Clear Form for Add Rents
  const handleAddNew = () => {
    // Reset any previous data
    resetForm();
    // Set modal for a new entry
    setIsEditing(false);
    // Open the modal
    setShowModal(true);
  };

  const resetForm = () => {
    setSelectedTenant('');
    setRoomNumber('');
    setBedNumber('');
    setTotalFee('');
    setPaidAmount('');
    setDue('');
    setPaidDate('');
    setDueDate('');
    setIsEditing(false);
    setEditingRentId(null);
    setErrors({});
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  const columns = [
    t('rentsPage.sNo'),
    t('rentsPage.roomNo'),
    t('rentsPage.personName'),
    t('rentsPage.personMobile'),
    t('rentsPage.bedNo'),
    t('rentsPage.rent'),
    t('rentsPage.paid'),
    t('rentsPage.due'),
    t('rentsPage.joiningDate'),
    t('rentsPage.dueDate'),
    t('rentsPage.lastFee'),
    t('rentsPage.status'),
    t('rentsPage.update')
  ];


  const rentsRows = tenantsWithRents.flatMap((tenant, index) => tenant.rents.map((rent) => ({
    roomNumber: rent.roomNumber,
    name: tenant.name,
    mobileNo: tenant.mobileNo,
    bedNumber: rent.bedNumber,
    totalFee: rent.totalFee,
    paid: rent.paidAmount,
    due: rent.due,
    dateOfJoin: tenant.dateOfJoin,
    dueDate: rent.dueDate,
    paidDate: rent.paidDate,
    status: rent.status === 'Unpaid' ? 'Unpaid' : 'Paid',
    tenantId: tenant.id,
    rentId: rent.id,
  })))
  // console.log(rentsRows,'rent')
  // const count = 0;
  const rows = rentsRows.map((rent, index) => ({
    s_no: index + 1,
    room_no: rent.roomNumber,
    person_name: rent.name,
    person_mobile: rent.mobileNo,
    bed_no: rent.bedNumber,
    rent: "Rs. " + rent.totalFee,
    paid: rent.paid,
    due: rent.due,
    joining_date: rent.dateOfJoin,
    due_date: rent.dueDate,
    last_fee: rent.paidDate,
    status: rent.status === 'Unpaid' ? 'Unpaid' : 'Paid',
    actions: <button
      style={{ backgroundColor: '#ff8a00', padding: '4px', borderRadius: '5px', color: 'white', border: 'none', }}
      onClick={() => { loadRentForEditing(rent.tenantId, rent.rentId); setShowForm(true) }}
    // data-bs-toggle="modal"
    // data-bs-target="#exampleModalRentsBoys"
    >
      Update
    </button>,
  }));


  const filteredRows = rows.filter(row => {
    return Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleClosePopUp = () => {
    setShowModal(false);
    setNotify(false)
  }

  const onClickCheckbox =async () => {
    setNotify(!notify)
   
    if(selectedTenant){
    const tenant = tenantsWithRents.find(t => t.id === selectedTenant);
    console.log(tenant,"unique")
    console.log(selectedTenant,"unique")
    const rentRecord = tenant.rents
    setNotifyUserInfo({ tenant, rentRecord });
    }
 
  }

  const handleResetMonthly = () => {
    setSelectedTenant('');
    setRoomNumber('');
    setBedNumber('');
    setTotalFee(0);
    setPaidAmount(0);
    setDue(0);
    setDateOfJoin('');
    setPaidDate('');
    setDueDate('');
    setNotify(false);
  };

  const handleResetDaily = () => {
    setSelectedTenant('');
    setRoomNumber('');
    setBedNumber('');
    setTotalFee(0);
    setPaidAmount(0);
    setDue(0);
    setDateOfJoin('');
    setPaidDate('');
    setDueDate('');
    setNotify(false);
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',  
    }));
  };

  return (
    <div className='h-100'>
      <>
        <div className="row d-flex flex-wrap align-items-center justify-content-between">
          <div className="col-12 col-md-4 d-flex align-items-center mr-5 mb-2">
            <div className='roomlogo-container'>
              <img src={RentIcon} alt="RoomsIcon" className='roomlogo' />
            </div>
            <h1 className='management-heading'>{t('rentsPage.rentsManagement')}</h1>
          </div>
          <div className="col-6 col-md-4 search-wrapper">
            <input type="text" placeholder={t('common.search')} className='search-input' value={searchQuery}
              onChange={handleSearch} />
            <img src={SearchIcon} alt="search-icon" className='search-icon' />
          </div>
          <div className="col-6 col-md-4 d-flex justify-content-end">
            <button id="roomPageAddBtn" type="button" class="add-button" onClick={() => { handleAddNew(); setShowForm(true) }} >
              {t('rentsPage.addRent')}
            </button>
          </div>
        </div>
        <div>
          <Table columns={columns} rows={filteredRows} />
        </div>
        <div class={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="exampleModalRentsBoys" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel"> {t('rentsPage.addRent')}</h1>
                <button type="button" onClick={handleClosePopUp} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div className="container-fluid">
                  {isEditing ? null : 
                    <div className='monthlyDailyButtons'>
                      <div className={showForm ? 'manageRentButton active' : 'manageRentButton'} onClick={()=>{setShowForm(true);  handleResetMonthly();}} >
                        <text>{t('dashboard.monthly')}</text>
                      </div>
                      <div className={!showForm ? 'manageRentButton active' : 'manageRentButton'} onClick={()=>{setShowForm(false);  handleResetDaily();}}>
                      <text>{t('dashboard.daily')}</text>
                      </div>
                    </div>
                  }
                  {showForm?
                    <div className='monthlyAddForm'>
                    <form class="row lg-10" onSubmit={handleSubmit}>
                      <div class='col-12 mb-3'>
                        <select id="bedNo" class="form-select" value={selectedTenant} onChange={e => setSelectedTenant(e.target.value)} disabled={isEditing} name="selectedTenant" onFocus={handleFocus}>
                          <option value="">{t('dashboard.selectTenant')} *</option>
                            {isEditing ? (
                                <option key={selectedTenant} value={selectedTenant}>{tenantsWithRents.find(tenant => tenant.id === selectedTenant)?.name}</option>
                              ) : (
                                availableTenants.map(tenant => (
                                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                ))
                              )
                            }
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
                        <input id="PaidAmount" class="form-control" type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} name="paidAmount" onFocus={handleFocus}  />
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
                        <label htmlFor="DueDate" class="form-label">{t('dashboard.dueDate')}:</label>
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
                      <div className="col-12 mb-3">
                        <div className="form-check">
                          <input
                            id="notifyCheckbox"
                            className="form-check-input"
                            type="checkbox"
                            checked={notify}
                            onChange={onClickCheckbox}
                          // Toggle the state on change
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
                  <form class="row lg-10" onSubmit={handleSubmit}>
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
                      <input id="TotalFee" class="form-control" type="number" value={totalFee} onChange={e => setTotalFee(e.target.value)} />
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
                      <label htmlFor="DueDate" class="form-label">{t('dashboard.dueDate')}:</label>
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
                    <div className="col-12 mb-3">
                      <div className="form-check">
                        <input
                          id="notifyCheckbox"
                          className="form-check-input"
                          type="checkbox"
                          checked={notify}
                          onChange={onClickCheckbox}
                        // Toggle the state on change
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
                  </div>}
                </div>
              </div>

            </div>
          </div>
        </div>

      </>
    </div>
  )
}

export default RentPageBoys