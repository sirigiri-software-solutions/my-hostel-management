
import React, {useState} from 'react'
import ExpensesGirls from './ExpensesGirls'
 
const CreateExpensesGirls = () => {
 
  const[showCreateExpensesGirls, setShowCreateExpensesGirls] = useState(false)
  const [errors,setErrors]=useState({});
  const toggleCreateExpensesGirls = () => {
      setShowCreateExpensesGirls(!showCreateExpensesGirls)
      setErrors({})//clear errors when toggling
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    const form=e.target;
    const formData=new FormData(form);
    const newErrors={};

    // required field validation
    ['inputName','inputDate','inputMonth','inputAmount','inputYear','inputMobile','inputdes','inputCreatedOn'].forEach((field)=>{
      if(!formData.get(field)){
        newErrors[field]='this field is required';
      }
    });

    // Mobile number format validation
    const mobileRegex=/^[0-9]{10}$/;
    if(!mobileRegex.test(formData.get('inputMobile'))) {
      newErrors['inputMobile']='Mobile number must be 10 digits';
    }

    //Amount validation
    if(formData.get('inputAmount')<=0){
      newErrors['inputAmount']='Amount must be greater than zero';
    }

    // duedate validation
    const currentDate=new Date().toISOString().split('T')[0];
    if(formData.get('inputDate') < currentDate){
      newErrors['inputDate']='Due date must be after today'
    }
    if(Object.keys(newErrors).length===0){
      // submit form if there are no errors
      // console.log("form submitted successfully");
       form.reset(); //set errors state to trigger re-render with error msg
    }
    else{
      setErrors(newErrors); //set errors state to trigger re-render with error msg 
    }
  }
 
    return (
      <div className='h-100' style={{backgroundColor:"hsla(30, 100%, 50%, 0.41)"}}>
      {!showCreateExpensesGirls ?(
      <>
        <div className="container-fluid">
        <h1 className='fs-5' onClick={toggleCreateExpensesGirls}>&lt;-- Back</h1>
        <h1 className='text-center mb-2 fs-5'>Create Expenses</h1>
        <form class="row g-3" onSubmit={handleSubmit}>
          {/* form field */}
          <div class="col-md-6">
            <label for="inputName" class="form-label">Name</label>
            <input type="text" class="form-control" id="inputName"/>
            {errors['inputName'] && <div className="text-danger">{errors['inputName']}</div>}

          </div>
          <div class="col-md-6">
            <label for="inputDate" class="form-label">Due Date</label>
            <input type="date" class="form-control" id="inputDate"/>
            {errors['inputDate'] && <div className="text-danger">{errors['inputDate']}</div>}
          </div>
          <div class="col-md-6">
            <label for="inputMonth" class="form-label">Month</label>
            <input type="month" class="form-control" id="inputMonth"/>
            {errors['inputMonth'] && <div className="text-danger">{errors['inputMonth']}</div>}   
          </div>
          <div class="col-md-6">
            <label for="inputAmount" class="form-label">Amount</label>
            <input type="number" class="form-control" id="inputAmount"/>
            {errors['inputAmount'] && <div className='text-danger'>{errors['inputAmount']}</div>}
          </div>
          <div class="col-md-6">
            <label for="inputYear" class="form-label">Year</label>
            <input type="date" class="form-control" id="inputYear"/>
            {errors['inputYear'] && <div className='text-danger'>{errors['inputYear']}</div>}
          </div>
          <div class="col-md-6">
            <label for="inputMobile" class="form-label">Mobile</label>
            <input type="tel" class="form-control" id="inputMobile"/>
            {errors['inputMobile'] && <div className='text-danger'>{errors['inputMobile']}</div>}
          </div>
          <div class="col-md-6">
            <label for="inputdes" class="form-label">Small Description</label>
            <textarea type="textarea"></textarea>
            {errors['inputdes'] && <div className="text-danger">{errors['inputdes']}</div>} 
          </div>
          <div class="col-md-6">
            <label for="inputCreatedOn" class="form-label">Created On</label>
            <input type="date" class="form-control" id="inputCreatedOn"/>
            {errors['inputCreatedOn'] && <div className='text-danger'>{errors['inputCreatedOn']}</div>}
          </div>
          <div class="col-12 text-center">
            <button type="submit" class="btn btn-warning">Create</button>
          </div>
        </form>
      </div>
      </>
      ) : (
          <ExpensesGirls />
      )}
      </div>
    )
}
 
export default CreateExpensesGirls