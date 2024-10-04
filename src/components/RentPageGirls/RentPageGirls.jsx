import React, { useEffect } from "react";
import RentIcon from "../../images/Icons (6).png";
import SearchIcon from "../../images/Icons (9).png";
import Table from "../../Elements/Table";
import { push, ref } from "../../firebase/firebase";
import { useState } from "react";
import { update } from "firebase/database";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp } from "react-icons/fa";
import "../../App.css";
import { useData } from "../../ApiData/ContextProvider";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const RentPageGirls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const {
    activeGirlsHostel,
    userUid,
    activeGirlsHostelButtons,
    firebase,
    girlsRooms,
    girlsTenants,
    girlsTenantsWithRents,
    fetchData,
  } = useData();
  const { database } = firebase;
  const [searchQuery, setSearchQuery] = useState("");
  // const [tenants, setTenants] = useState([]);
  // const [rooms, setRooms] = useState({});
  const [selectedTenant, setSelectedTenant] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [due, setDue] = useState("");
  // const [tenantsWithRents, setTenantsWithRents] = useState([]);
  const [paidDate, setPaidDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRentId, setEditingRentId] = useState(null);
  const [errors, setErrors] = useState({});
  const [availableTenants, setAvailableTenants] = useState([]);
  const [dateOfJoin, setDateOfJoin] = useState();

  const [showModal, setShowModal] = useState(false);

  const [notify, setNotify] = useState(false);
  const [notifyUserInfo, setNotifyUserInfo] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [filterOption, setFilterOption] = useState("all");
  const [tenantMonthly, setTenantMonthly] = useState(showForm)


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
Please note that you made your last payment on ${paidDate}.\n`;

    const phoneNumber = tenant.mobileNo;
    const formattedPhoneNumber = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;

    const encodedMessage = encodeURIComponent(message);

    let whatsappLink = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
  };

  const handleNotifyCheckbox = (rentData) => {
    if (notify && notifyUserInfo) {
      const { tenant, rentRecord } = notifyUserInfo;

      sendMessage(tenant, rentData);
    }
    setNotify(!notify);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showModal &&
        (event.target.id === "exampleModalRentsGirls" || event.key === "Escape")
      ) {
        setShowModal(false);
        navigate(-1);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("keydown", handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener("keydown", handleOutsideClick);
    };
  }, [showModal]);

  // useEffect(() => {
  //   const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants`);
  //   onValue(tenantsRef, (snapshot) => {
  //     const data = snapshot.val();
  //     const loadedTenants = data ? Object.keys(data).map(key => ({
  //       id: key,
  //       ...data[key],
  //     })) : [];
  //     setTenants(loadedTenants);
  //   });

  //   const roomsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/rooms`);
  //   onValue(roomsRef, (snapshot) => {
  //     const data = snapshot.val() || {};
  //     setRooms(data);
  //   });
  // }, [activeGirlsHostel]);

  useEffect(() => {
    const updateTotalFeeFromRoom = () => {
      const roomsArray = Object.values(girlsRooms);

      const matchingRoom = roomsArray.find(
        (room) => room.roomNumber === roomNumber
      );

      if (tenantMonthly && matchingRoom && matchingRoom.bedRent) {
        setTotalFee(matchingRoom.bedRent.toString());
      } 
    };

    if (roomNumber) {
      updateTotalFeeFromRoom();
    }
  }, [roomNumber, girlsRooms, showForm]);

  useEffect(() => {
    if (selectedTenant) {
      const tenant = girlsTenants.find((t) => t.id === selectedTenant);
      if (tenant) {
        setRoomNumber(tenant.roomNo || "");
        setBedNumber(tenant.bedNo || "");
        setDateOfJoin(tenant.dateOfJoin || "");
      }
    } else {
      setRoomNumber("");
      setBedNumber("");
      setPaidAmount("");
      setDue("");
      setDateOfJoin("");
      setDueDate("");
    }
  }, [selectedTenant, girlsTenants]);

  useEffect(() => {
    const tenantIdsWithRents = girlsTenantsWithRents.flatMap((tenant) =>
      tenant.rents.length > 0 ? [tenant.id] : []
    );

    const availableTenants = girlsTenants.filter(
      (tenant) => !tenantIdsWithRents.includes(tenant.id)
    );

    setAvailableTenants(availableTenants);
  }, [girlsTenants, girlsTenantsWithRents, activeGirlsHostel]);

  useEffect(() => {
    const calculatedDue = Math.max(
      parseFloat(totalFee) - parseFloat(paidAmount),
      0
    ).toString();
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
  // }, [activeGirlsHostel]);

  const loadRentForEditing = (tenantId, rentId) => {
    const tenant = girlsTenantsWithRents.find((t) => t.id === tenantId);
    const rentRecord = tenant.rents.find((r) => r.id === rentId);
    const roomsArray = Object.values(girlsRooms);
    const matchingRoom = roomsArray.find(
      (room) => room.roomNumber === rentRecord?.roomNumber
    );
    if (rentRecord) {
    
      setSelectedTenant(tenantId || "");
      setRoomNumber(rentRecord.roomNumber || "");
      setBedNumber(rentRecord.bedNumber || "");
      // setTotalFee(rentRecord.totalFee || "");
      setTenantMonthly(rentRecord.monthly)
      setTotalFee(rentRecord.monthly ? matchingRoom.bedRent :  rentRecord.totalFee);
      setPaidAmount(rentRecord.paidAmount || "");
      setDue(rentRecord.due || "");
      setPaidDate(rentRecord.paidDate || "");
      setDueDate(rentRecord.dueDate || "");
      setIsEditing(true);
      setEditingRentId(rentId);
    }
    setShowModal(true);
    window.history.pushState(null, null, location.pathname);
    setNotifyUserInfo({ tenant, rentRecord });
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!selectedTenant) {
      formIsValid = false;
      errors["selectedTenant"] = t("errors.selectedTenantRequired");
    }

    if (!paidAmount) {
      formIsValid = false;
      errors["paidAmount"] = t("errors.paidAmountRequired");
    }

    if (!paidDate) {
      formIsValid = false;
      errors["paidDate"] = t("errors.paidDateRequired");
    }

    if (!dueDate) {
      formIsValid = false;
      errors["dueDate"] = t("errors.dueDateRequired");
    }

    setErrors(errors);
    return formIsValid;
  };


  const [rentPageBtnStatus,setRentPageBtnStatus] = useState(false);
  const handleSubmit = async (e) => {
    setRentPageBtnStatus(true)
    e.preventDefault();

    if (!validateForm()) {
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
      status: parseFloat(due) <= 0 ? "Paid" : "Unpaid",
      monthly:showForm
    };

    if (isEditing) {
      const rentRef = ref(
        database,
        `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/${selectedTenant}/rents/${editingRentId}`
      );
      await update(rentRef, rentData)
        .then(() => {
          toast.success(t("toastMessages.rentAddedSuccess"), {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: "empty-fields-error",
          });
          setIsEditing(false);
          if (notify) {
            handleNotifyCheckbox(rentData);
          }
          fetchData();
          setRentPageBtnStatus(false)
        })
        .catch((error) => {
          toast.error(t("toastMessages.errorAddingRent") + error.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: "empty-fields-error",
          });
          setRentPageBtnStatus(false)
        });
    } else {
      const rentRef = ref(
        database,
        `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants/${selectedTenant}/rents`
      );
      await push(rentRef, rentData)
        .then(() => {
          toast.success(t("toastMessages.rentAddedSuccess"), {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: "empty-fields-error",
          });
          setIsEditing(false);
          if (notify) {
            handleNotifyCheckbox(rentData);
          }
          fetchData();
          setRentPageBtnStatus(false)
        })
        .catch((error) => {
          toast.error(t("toastMessages.errorAddingRent") + error.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: "empty-fields-error",
          });
          setRentPageBtnStatus(false)
        });
    }
    resetForm();
    setShowModal(false);
    navigate(-1);
  };

  const handleAddNew = () => {
    if (activeGirlsHostelButtons.length === 0) {
      toast.warn(
        "You have not added any girls hostel, please add your first Hostel in Settings",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: "empty-fields-error",
        }
      );
    } else {
      resetForm();
      setIsEditing(false);
      setShowModal(true);
      window.history.pushState(null, null, location.pathname);
    }
  };
  const resetForm = () => {
    setSelectedTenant("");
    setRoomNumber("");
    setBedNumber("");
    setTotalFee("");
    setPaidAmount("");
    setDue("");
    setPaidDate("");
    setDueDate("");
    setIsEditing(false);
    setEditingRentId(null);
    setErrors({});
    setTenantMonthly(showForm)
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = [
    t("rentsPage.sNo"),
    t("rentsPage.roomNo"),
    t("rentsPage.personName"),
    t("rentsPage.personMobile"),
    t("rentsPage.bedNo"),
    t("rentsPage.rent"),
    t("rentsPage.paid"),
    t("rentsPage.due"),
    t("rentsPage.joiningDate"),
    t("rentsPage.dueDate"),
    t("rentsPage.lastFee"),
    t("rentsPage.status"),
    t("rentsPage.update"),
  ];

  const rentsRows = girlsTenantsWithRents.flatMap((tenant, index) =>
    tenant.rents.map((rent) => ({
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
      status: rent.status === "Unpaid" ? "Unpaid" : "Paid",
      tenantId: tenant.id,
      rentId: rent.id,
    }))
  );

  const rows = rentsRows.map((rent, index) => {
    const currentDate = new Date();
    const dueDate = new Date(rent.dueDate);
    const isPastDue = currentDate > dueDate;

    return {
      s_no: index + 1,
      room_no: rent.roomNumber,
      person_name: rent.name,
      person_mobile: rent.mobileNo,
      bed_no: rent.bedNumber,
      bedRent: rent.totalFee,
      paid: rent.paid,
      due: rent.due,
      joining_date: rent.dateOfJoin,
      due_date: rent.dueDate,
      last_fee: rent.paidDate,
      status: rent.status === "Unpaid" ? "Unpaid" : "Paid",
      actions: (
        <button
          style={{
            backgroundColor: isPastDue ? "red" : "#ff8a00",
            padding: "4px",
            borderRadius: "5px",
            color: "white",
            border: "none",
          }}
          onClick={() => {
            loadRentForEditing(rent.tenantId, rent.rentId);
            setShowForm(true);
            setErrors({});
          }}
        >
          Update
        </button>
      ),
    };
  });

  const filteredRows = rows.filter((row) => {
    const currentDate = new Date();
    const dueDate = new Date(row.due_date);

    const isPastDueDate = currentDate > dueDate;
    const isTodayDueDate =
      currentDate.toDateString() === dueDate.toDateString();
    const matchesSearchQuery = Object.values(row).some((value) => {
      if (value) {
        return value
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
      return false;
    });

    const filterCondition =
      filterOption === "all" ||
      (filterOption === "today" && isTodayDueDate) ||
      (filterOption === "overdue" && isPastDueDate);

    return matchesSearchQuery && filterCondition;
  });

  const handleSelectChange = (event) => {
    setFilterOption(event.target.value);
  };

  const handleClosePopUp = () => {
    setShowModal(false);
    setNotify(false);
    navigate(-1);
  };
  useEffect(() => {
    const handlePopState = () => {
      if (showModal) {
        setShowModal(false); // Close the popup
        
      }
    };

    window.addEventListener('popstate', handlePopState);


    return () => {
      window.removeEventListener('popstate',handlePopState)
    }
  }, [showModal, location.pathname]);

  const onClickCheckbox = () => {
    setNotify(!notify);

    if (selectedTenant) {
      const tenant = girlsTenantsWithRents.find((t) => t.id === selectedTenant);

      const rentRecord = tenant.rents;
      setNotifyUserInfo({ tenant, rentRecord });
    }
  };
  
  const handleResetMonthly = () => {
    setSelectedTenant("");
    setRoomNumber("");
    setBedNumber("");
    setTotalFee(0);
    setPaidAmount(0);
    setDue(0);
    setDateOfJoin("");
    setPaidDate("");
    setDueDate("");
    setNotify(false);
    setErrors({}); 
  };

  const handleResetDaily = () => {
    setSelectedTenant("");
    setRoomNumber("");
    setBedNumber("");
    setTotalFee(0);
    setPaidAmount(0);
    setDue(0);
    setDateOfJoin("");
    setPaidDate("");
    setDueDate("");
    setNotify(false);
    setErrors({}); 
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  return (
    <div className="h-100">
      <>
        <div className="row d-flex flex-wrap align-items-center justify-content-between">
          <div className="col-12 col-md-4 d-flex align-items-center mr-5 mb-2">
            <div className="roomlogo-container">
              <img src={RentIcon} alt="RoomsIcon" className="roomlogo" />
            </div>
            <h1 className="management-heading">
              {t("rentsPage.rentsManagement")}
            </h1>
          </div>
          <div className="col-12 col-md-4 search-wrapper">
            <input
              type="text"
              placeholder={t("common.search")}
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
            <img src={SearchIcon} alt="search-icon" className="search-icon" />
          </div>
          <div
            id="rentPagefilterbtn"
            className="col-12 col-md-4 d-flex justify-content-md-end align-items-end gap-3"
          >
            <div className="filterRentDropDownContainer">
              <select
                id="dueDateFilter"
                className="rentFilter"
                value={filterOption}
                onChange={handleSelectChange}
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="overdue">Due Over</option>
              </select>
            </div>
            <button
              id="roomGirlsPageBtn"
              type="button"
              class="add-button"
              onClick={() => {
                handleAddNew();
                setShowForm(true);
              }}
            >
              {t("rentsPage.addRent")}
            </button>
          </div>
        </div>

        <div>
          <Table columns={columns} rows={filteredRows} />
        </div>

        <div
          class={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          id="exampleModalRentsGirls"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={!showModal}
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  {" "}
                  {isEditing ? t("rentsPage.UpdateRent") :t("rentsPage.addRent")}
                </h1>
                <button
                  onClick={handleClosePopUp}
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div className="container-fluid">
                  {isEditing ? null : (
                    <div className="monthlyDailyButtons">
                      <div
                        className={
                          showForm
                            ? "manageRentButton active"
                            : "manageRentButton"
                        }
                        onClick={() =>{
                          setShowForm(true)
                          handleResetMonthly();
                        } }
                      >
                        <text>{t("dashboard.monthly")}</text>
                      </div>
                      <div
                        className={
                          !showForm
                            ? "manageRentButton active"
                            : "manageRentButton"
                        }
                        onClick={() => {
                          setShowForm(false)
                          handleResetDaily();
                        }}
                      >
                        <text>{t("dashboard.daily")}</text>
                      </div>
                    </div>
                  )}
                  {showForm ? (
                    <div className="monthlyAddForm">
                      <form class="row lg-10" onSubmit={handleSubmit}>
                        <div class="col-12 mb-3">
                          <select
                            id="bedNo"
                            class="form-select"
                            value={selectedTenant}
                            onChange={(e) => setSelectedTenant(e.target.value)}
                            disabled={isEditing}
                            name="selectedTenant"
                            onFocus={handleFocus}
                          >
                            <option value="">
                              {t("dashboard.selectTenant")} *
                            </option>

                            {isEditing ? (
                              <option
                                key={selectedTenant}
                                value={selectedTenant}
                              >
                                {
                                  girlsTenantsWithRents.find(
                                    (tenant) => tenant.id === selectedTenant
                                  )?.name
                                }
                              </option>
                            ) : (
                              availableTenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>
                                  {tenant.name}
                                </option>
                              ))
                            )}
                          </select>
                          {errors.selectedTenant && (
                            <div style={{ color: "red" }}>
                              {errors.selectedTenant}
                            </div>
                          )}
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="roomNo" class="form-label">
                            {t("dashboard.roomNumber")}:
                          </label>
                          <input
                            id="roomNo"
                            class="form-control"
                            type="text"
                            value={roomNumber}
                            readOnly
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="BedNumber" class="form-label">
                            {t("dashboard.bedNumber")}:
                          </label>
                          <input
                            id="BedNumber"
                            class="form-control"
                            type="text"
                            value={bedNumber}
                            readOnly
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="TotalFee" class="form-label">
                            {t("dashboard.totalFee")}:
                          </label>
                          {/* <input
                            id="TotalFee"
                            class="form-control"
                            type="number"
                            value={totalFee}
                            readOnly
                          /> */}
                            <input id="TotalFee" class="form-control" type="text" value={totalFee} onChange={e => setTotalFee(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} readOnly = {tenantMonthly}/>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="PaidAmount" class="form-label">
                            {t("dashboard.paidAmount")}:
                          </label>
                          <input
                            id="PaidAmount"
                            class="form-control"
                            type="text"
                            value={paidAmount}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9 ]/g,
                                ""
                              );
                              if (parseFloat(value) > totalFee) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  paidAmount: t("exceedTotalFee"),
                                }));
                              } else {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  paidAmount: "",
                                }));
                                setPaidAmount(value);
                              }
                            }}
                            onInput={(e) =>
                              (e.target.value = e.target.value.replace(
                                /[^0-9 ]/g,
                                ""
                              ))
                            }
                            name="paidAmount"
                            onFocus={handleFocus}
                          />
                          {errors.paidAmount && (
                            <div style={{ color: "red" }}>
                              {errors.paidAmount}
                            </div>
                          )}
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="Due" class="form-label">
                            {t("dashboard.due")}:
                          </label>
                          <input
                            id="Due"
                            class="form-control"
                            type="number"
                            value={due}
                            readOnly
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="DateOfJoin" class="form-label">
                            {t("dashboard.dateOfJoin")}:
                          </label>
                          <input
                            id="DateOfJoin"
                            class="form-control"
                            type="date"
                            value={dateOfJoin}
                            readOnly // Make this field read-only since it's auto-populated
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="PaidDate" class="form-label">
                            {t("dashboard.paidDate")}:
                          </label>
                          <input
                            id="PaidDate"
                            class="form-control"
                            type="date"
                            value={paidDate}
                            onChange={(e) => setPaidDate(e.target.value)}
                            name="paidDate"
                            onFocus={handleFocus}
                          />
                          {errors.paidDate && (
                            <div style={{ color: "red" }}>
                              {errors.paidDate}
                            </div>
                          )}
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="DueDate" class="form-label">
                            {t("dashboard.dueDate")}:
                          </label>
                          <input
                            id="DueDate"
                            class="form-control"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            name="dueDate"
                            onFocus={handleFocus}
                          />
                          {errors.dueDate && (
                            <div style={{ color: "red" }}>{errors.dueDate}</div>
                          )}
                        </div>
                        <div className="col-12 mb-3">
                          <div className="form-check">
                            <input
                              id="notifyCheckbox"
                              className="form-check-input"
                              type="checkbox"
                              checked={notify}
                              onChange={onClickCheckbox}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="notifyCheckbox"
                            >
                              {t("dashboard.notify")}
                            </label>
                            <FaWhatsapp
                              style={{
                                backgroundColor: "green",
                                color: "white",
                                marginLeft: "7px",
                                marginBottom: "4px",
                              }}
                            />
                          </div>
                        </div>
                        <div class="col-12 text-center mt-2">
                          <button disabled={rentPageBtnStatus} type="submit" className="btn btn-warning">
                            {isEditing
                              ? t("dashboard.updateRent")
                              : t("dashboard.submitRentDetails")}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="monthlyAddForm">
                      <form class="row lg-10" onSubmit={handleSubmit}>
                        <div class="col-12 mb-3">
                          <select
                            id="bedNo"
                            class="form-select"
                            value={selectedTenant}
                            onChange={(e) => setSelectedTenant(e.target.value)}
                            disabled={isEditing}
                            name="selectedTenant"
                            onFocus={handleFocus}
                          >
                            <option value="">
                              {t("dashboard.selectTenant")} *
                            </option>

                            {isEditing ? (
                              <option
                                key={selectedTenant}
                                value={selectedTenant}
                              >
                                {
                                  girlsTenantsWithRents.find(
                                    (tenant) => tenant.id === selectedTenant
                                  )?.name
                                }
                              </option>
                            ) : (
                              availableTenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>
                                  {tenant.name}
                                </option>
                              ))
                            )}
                          </select>
                          {errors.selectedTenant && (
                            <div style={{ color: "red" }}>
                              {errors.selectedTenant}
                            </div>
                          )}
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="roomNo" class="form-label">
                            {t("dashboard.roomNumber")}:
                          </label>
                          <input
                            id="roomNo"
                            class="form-control"
                            type="text"
                            value={roomNumber}
                            readOnly
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="BedNumber" class="form-label">
                            {t("dashboard.bedNumber")}:
                          </label>
                          <input
                            id="BedNumber"
                            class="form-control"
                            type="text"
                            value={bedNumber}
                            readOnly
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor='TotalFee' class="form-label">{t('dashboard.totalFee')}:</label>
                          <input id="TotalFee" class="form-control" type="text" value={totalFee} onChange={e => setTotalFee(e.target.value)} onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}/>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="PaidAmount" class="form-label">
                            {t("dashboard.paidAmount")}:
                          </label>
                          <input
                            id="PaidAmount"
                            class="form-control"
                            type="text"
                            value={paidAmount}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9 ]/g,
                                ""
                              );
                              if (parseFloat(value) > totalFee) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  paidAmount: t("exceedTotalFee"),
                                }));
                              } else {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  paidAmount: "",
                                }));
                                setPaidAmount(value);
                              }
                            }}
                            name="paidAmount"
                            onInput={(e) =>
                              (e.target.value = e.target.value.replace(
                                /[^0-9 ]/g,
                                ""
                              ))
                              
                            }
                            
                            onFocus={handleFocus}
                          />

                          {errors.paidAmount && (
                            <div style={{ color: "red" }}>
                              {errors.paidAmount}
                            </div>
                          )}
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="Due" class="form-label">
                            {t("dashboard.due")}:
                          </label>
                          <input
                            id="Due"
                            class="form-control"
                            type="number"
                            value={due}
                            readOnly
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="DateOfJoin" class="form-label">
                            {t("dashboard.dateOfJoin")}:
                          </label>
                          <input
                            id="DateOfJoin"
                            class="form-control"
                            type="date"
                            value={dateOfJoin}
                            readOnly
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="PaidDate" class="form-label">
                            {t("dashboard.paidDate")}:
                          </label>
                          <input
                            id="PaidDate"
                            class="form-control"
                            type="date"
                            value={paidDate}
                            onChange={(e) => setPaidDate(e.target.value)}
                            name="paidDate"
                            onFocus={handleFocus}
                          />
                          {errors.paidDate && (
                            <div style={{ color: "red" }}>
                              {errors.paidDate}
                            </div>
                          )}
                        </div>
                        <div class="col-md-6 mb-3">
                          <label htmlFor="DueDate" class="form-label">
                            {t("dashboard.dueDate")}:
                          </label>
                          <input
                            id="DueDate"
                            class="form-control"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            name="dueDate"
                            onFocus={handleFocus}
                          />
                          {errors.dueDate && (
                            <div style={{ color: "red" }}>{errors.dueDate}</div>
                          )}
                        </div>
                        <div className="col-12 mb-3">
                          <div className="form-check">
                            <input
                              id="notifyCheckbox"
                              className="form-check-input"
                              type="checkbox"
                              checked={notify}
                              onChange={onClickCheckbox}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="notifyCheckbox"
                            >
                              {t("dashboard.notify")}
                            </label>
                            <FaWhatsapp
                              style={{
                                backgroundColor: "green",
                                color: "white",
                                marginLeft: "7px",
                                marginBottom: "4px",
                              }}
                            />
                          </div>
                        </div>
                        <div class="col-12 text-center mt-2">
                          <button disabled={rentPageBtnStatus} type="submit" className="btn btn-warning">
                            {isEditing
                              ? t("dashboard.updateRent")
                              : t("dashboard.submitRentDetails")}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default RentPageGirls;
