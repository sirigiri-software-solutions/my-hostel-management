import React, { useState, useEffect } from 'react'
import ExpenseIcon from '../../images/Icons (5).png'
import SearchIcon from '../../images/Icons (9).png'
import Table from '../../Elements/Table'
import { database, push, ref } from "../../firebase";
import "../RoomsBoys/RoomsBoys.css"
import { onValue } from 'firebase/database';
import { remove, update, set } from 'firebase/database';
import { toast } from "react-toastify";
import './ExpensesGirls.css';
import { useTranslation } from 'react-i18next';

import { useData } from '../../ApiData/ContextProvider';

const ExpensesGirls = () => {
  const { t } = useTranslation();
  const { activeGirlsHostel } = useData();

  const  role = localStorage.getItem('role');
  let adminRole = "";
  if(role === "admin"){
    adminRole = "Admin";
  }else if(role === "subAdmin"){
    adminRole = "Sub-admin"
  }

  const isUneditable = role === 'admin' || role === 'subAdmin';

  
  const [searchTerm, setSearchTerm] = useState('');
  const [initialRows, setInitialRows] = useState([]);



  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getCurrentMonth = () => {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const currentMonth = new Date().getMonth(); // getMonth returns month index (0 = January, 11 = December)
    return monthNames[currentMonth];
  };
  
  const getCurrentYear = () => {
    return new Date().getFullYear().toString(); // getFullYear returns the full year (e.g., 2024)
  };

  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    expenseName: '',
    expenseAmount: '',
    expenseDate: '',
    createdBy: adminRole
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
      console.log("Triggering")
        if (showModal && (event.target.id === "exampleModalExpensesGirls" || event.key === "Escape")) {
  setShowModal(false);
      }

      };
window.addEventListener('click', handleOutsideClick);
window.addEventListener('keydown',handleOutsideClick);

  }, [showModal]);

  const getMonthYearKey = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // get short month name
    const year = date.getFullYear();
    return `${year}-${month}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the necessary fields
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
      errors.expenseAmount =  t('errors.expenseAmountRequired');
      formIsValid = false;
    }

    if (!formData.expenseDate) {
      errors.expenseDate = t('errors.expenseDateRequired');
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



    } else {
      // Set errors in state if form is not valid
      setFormErrors(errors);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    const formattedMonth = month.slice(0, 3);
    const expensesRef = ref(database, `Hostel/girls/${activeGirlsHostel}/expenses/${year}-${formattedMonth}`);
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedExpenses = [];
      for (const key in data) {
        loadedExpenses.push({
          id: key,
          ...data[key],
          expenseDate: formatDate(data[key].expenseDate) // Format date as you retrieve it
        });
      }
      setExpenses(loadedExpenses);
      const totalExpenses = loadedExpenses.reduce((acc, current) => acc + current.expenseAmount, 0);
      setTotal(totalExpenses);
    });
  }, [month, year, activeGirlsHostel]);

  const columns = [
    t('expensesPage.sNo'),
    t('expensesPage.expenseName'),
    t('expensesPage.expenseAmount'),
    t('expensesPage.createdBy'),
    t('expensesPage.date'),
    t('expensesPage.actions')
  ];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  useEffect(() => {

    const rows = expenses.map((expense, index) => ({
      s_no: index + 1,
      expense_name: capitalizeFirstLetter(expense.expenseName),
      expense_amount: expense.expenseAmount,
      created_by:capitalizeFirstLetter(expense.createdBy),
      last_updated_by: expense.expenseDate,
      edit_room: <button
        style={{ backgroundColor: '#ff8a00', padding: '4px', borderRadius: '5px', color: 'white', border: 'none', }}
        onClick={() => handleEdit(expense)}
      // data-bs-toggle="modal"
      // data-bs-target="#exampleModalExpensesGirls"
      >
        Edit
      </button>
    }));
    setInitialRows(rows);

  }, [expenses]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    // console.log(expense.expenseDate,"data was formated")
    const [day, month, year] = expense.expenseDate.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    setFormData({
      expenseName: expense.expenseName,
      expenseAmount: expense.expenseAmount,
      expenseDate: formattedDate,
      createdBy: adminRole,
    });
    setShowModal(true);
    setFormErrors({
      number: '',
      rent: '',
      rooms: '',
      status: ''
    })
  };



  const handleUpdate = () => {
    if (!editingExpense) return;

    let errors = {};
    let formIsValid = true;

    if (!formData.expenseName.match(/^[a-zA-Z\s]+$/)) {
      errors.expenseName =  t('errors.expenseNameAlphabetsAndSpaces')
      formIsValid = false;
    }


    const expenseAmountString = String(formData.expenseAmount); // Convert to string
    if (!expenseAmountString.match(/^\d+(\.\d{1,2})?$/)) {
      errors.expenseAmount = t('errors.expenseAmountValidNumber');
      formIsValid = false;
    }


    if (!formData.expenseDate) {
      errors.expenseDate = t('errors.expenseDateRequired');
      formIsValid = false;
    }

    const parsedAmount = parseFloat(formData.expenseAmount);
    if (isNaN(parsedAmount)) {
      errors.expenseAmount =  t('errors.expenseAmountRequired');
      formIsValid = false;
    }

    // Log the value of formData.expenseDate before conversion
    console.log('Expense Date:', formData.expenseDate);

    if (formIsValid) {
      let updatedFormData = {
        ...formData,
        expenseAmount: parseFloat(formData.expenseAmount)
      };

      const monthYear = getMonthYearKey(formData.expenseDate);
      const expenseRef = ref(database, `Hostel/girls/${activeGirlsHostel}/expenses/${monthYear}/${editingExpense.id}`);
      set(expenseRef, updatedFormData)
        .then(() => {
          toast.success(t('toastMessages.expensesUpdatedSuccessfully'), {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setEditingExpense(null);
        }).catch(error => {
          toast.error(t('toastMessages.errorUpdatinExpense')+ error.message, {
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
      setFormData({
        expenseName: '',
        expenseAmount: '',
        expenseDate: '',
        createdBy: adminRole
      });
    } else {
      // Set errors in state if form is not valid
      setFormErrors(errors);
    }
  };

  const handleDelete = () => {
    if (!editingExpense) return;
    const monthYear = getMonthYearKey(formData.expenseDate);
    const expenseRef = ref(database, `Hostel/girls/${activeGirlsHostel}/expenses/${monthYear}/${editingExpense.id}`);
    remove(expenseRef).then(() => {
      toast.success(t('toastMessages.expenseDeteledSuccessfully'), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEditingExpense(null);
      // alert('Expense deleted!');
    }).catch(error => {
      toast.error(t('toastMessages.errorDeletingExpense') + error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error deleting document: ", error);
      // alert('Error deleting expense!');
    });
    setShowModal(false);
    setFormData({
      expenseName: '',
      expenseAmount: '',
      expenseDate: '',
      createdBy: adminRole
    });

  };


  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredRows = initialRows.filter(row => {
    return Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddNew = () => {
    setShowModal(true);
    setFormData({
      expenseName: '',
      expenseAmount: '',
      expenseDate: '',
      createdBy: adminRole
    });
    setFormErrors({
      expenseName: '',
      expenseAmount: '',
      expenseDate: ''
    });
    setEditingExpense(null);
  };


  const onClickClose = () => {
    setShowModal(false);
    setFormData({
      expenseName: '',
      expenseAmount: '',
      expenseDate: '',
      createdBy: adminRole
    });
  }

  
// =======  calculate year expenses
const [totalAnnualExpenses, setTotalAnnualExpenses] = useState(0);
useEffect(() => {
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  let total = 0;

  const fetchExpenses = async () => {
    const promises = monthNames.map(month => {
      const monthRef = ref(database, `Hostel/girls/${activeGirlsHostel}/expenses/${year}-${month}`);
      return new Promise((resolve) => {
        onValue(monthRef, (snapshot) => {
          const expenses = snapshot.val();
          if (expenses) {
            const monthlyTotal = Object.values(expenses).reduce((acc, { expenseAmount }) => acc + parseFloat(expenseAmount), 0);
            resolve(monthlyTotal);
          } else {
            resolve(0);
          }
        }, {
          onlyOnce: true
        });
      });
    });

    const monthlyTotals = await Promise.all(promises);
    total = monthlyTotals.reduce((acc, curr) => acc + curr, 0);
    setTotalAnnualExpenses(total);
  };

  fetchExpenses();
}, [year, expenses, activeGirlsHostel]);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const handleExpensesFocus = (e) => {
  const fieldName = e.target.name;
  setFormErrors((prevErrors) => ({
    ...prevErrors,
    [fieldName]: ''
  }));
};

  return (
    <div className='h-100'>
      <>
        <div className="row d-flex flex-wrap align-items-center justify-content-between">
          <div className="col-12 col-md-4 d-flex align-items-center mr-5 mb-2">
            <div className='roomlogo-container'>
              <img src={ExpenseIcon} alt="RoomsIcon" className='roomlogo' />
            </div>
            <h1 className='management-heading'>{t('expensesPage.expensesManagement')}</h1>
          </div>
          <div className="col-6 col-md-4 search-wrapper">
            <input type="text" placeholder={t('common.search')} className='search-input' onChange={handleChange} value={searchTerm} />
            <img src={SearchIcon} alt="search-icon" className='search-icon' />
          </div>
          <div className="col-6 col-md-4 d-flex justify-content-end">
            <button id="expensePageAddBtn" type="button" class="add-button" onClick={handleAddNew}>
            {t('expensesPage.addExpenses')}
            </button>
          </div>
        </div>

        <div className='filterExpense' style={{width:'100%',display:'flex',justifyContent:'space-between'}}>
        <div style={{display:'flex',justifyContent:'start'}}>
          <text><strong>{capitalizeFirstLetter(month)} {t('expensesPage.monthExpenses')}  {total} </strong>
          <strong>{t('expensesPage.yearTotalExpenses')}  {year} :{totalAnnualExpenses} </strong> </text>
        </div>

          <div style={{display:'flex',marginTop:'10px'}} >
          <div>
            <select className='filterExpenseField' value={year} onChange={e => setYear(e.target.value)}>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div>
            <select style={{width:'70px'}}className='filterExpenseField' value={month} onChange={e => { setMonth(e.target.value) }}>
            <option value="jan">{t('months.jan')}</option>
              <option value="feb">{t('months.feb')}</option>
              <option value="mar">{t('months.mar')}</option>
              <option value="apr">{t('months.apr')}</option>
              <option value="may">{t('months.may')}</option>
              <option value="jun">{t('months.jun')}</option>
              <option value="jul">{t('months.jul')}</option>
              <option value="aug">{t('months.aug')}</option>
              <option value="sep">{t('months.sep')}</option>
              <option value="oct">{t('months.oct')}</option>
              <option value="nov">{t('months.nov')}</option>
              <option value="dec">{t('months.dec')}</option>
            </select>
          </div>
      </div>       
          {/* Additional UI and functionality here */}
   </div>

        <div>
          <Table columns={columns} rows={filteredRows} />
        </div>
        {/* <div>
          <text><strong>{month} month expenses : {total} </strong>
          <strong>{year},total expenses :{totalAnnualExpenses} </strong> </text>
        </div> */}
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="exampleModalExpensesGirls" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">{t('expensesPage.addExpenses')}</h1>
                <button type="button" onClick={onClickClose} class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div className="container-fluid">
                  <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                      <label htmlFor="inputExpenseName" className="form-label">{t('expensesPage.expenseName')} :</label>
                      <input type="text" className="form-control" name="expenseName" value={formData.expenseName} onChange={handleInputChange} onFocus={handleExpensesFocus} />
                      {formErrors.expenseName && <div className="text-danger">{formErrors.expenseName}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inputRent" className="form-label">{t('expensesPage.expenseAmount')} :</label>
                      <input type="number" className="form-control" name="expenseAmount" value={formData.expenseAmount} onChange={handleInputChange} onFocus={handleExpensesFocus} />
                      {formErrors.expenseAmount && <div className="text-danger">{formErrors.expenseAmount}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inputRole" className="form-label">{t('expensesPage.createdBy')} :</label>
                      {/* <select className="form-select" id="inputRole" name="createdBy" value={formData.createdBy} onChange={handleInputChange}>
                        <option value="admin">{t('expensesPage.admin')}</option>
                        <option value="sub-admin">{t('expensesPage.subAdmin')} </option>
                      </select> */}
                      <input disabled={isUneditable} type="text" className='form-control' id="inputRole" value={formData.createdBy} />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="inputDate" className="form-label">{t('expensesPage.expenseDate')} : </label>
                      <input type="date" className="form-control" name="expenseDate" value={formData.expenseDate} onChange={handleInputChange} onFocus={handleExpensesFocus} />
                      {formErrors.expenseDate && <div className="text-danger">{formErrors.expenseDate}</div>}
                    </div>

                    <div className="col-12 text-center">
                      {!editingExpense && (
                        <button type="submit" className="btn btn-warning">{t('expensesPage.createExpense')}</button>
                      )}
                      {editingExpense && (
                        <>
                          <button type="button" className="btn btn-success" style={{ marginRight: '10px' }} onClick={handleUpdate}>{t('expensesPage.updateExpense')}</button>
                          {role === "admin" ? <button type="button" className="btn btn-danger" onClick={handleDelete}>{t('expensesPage.deleteExpense')}</button> : null }
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </>
    </div>
  )
}

export default ExpensesGirls