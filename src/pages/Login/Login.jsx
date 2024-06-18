
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import Modal from 'react-modal';
import ImageOne from "../../images/Vector 1 (1).png";
import ImageTwo from "../../images/Vector 3 (2).png";
// import Logo from "../../images/image.png";
import Logo from "../../images/HMLogo3.png"
import './Login.css';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from "../../ApiData/ContextProvider";

export const loginContext = createContext();

const Login = () => {
  const navigate = useNavigate();
  const { areaToApiEndpoint, setUserArea, setUserUid } = useContext(DataContext);
  const initialState = { Id: "", email: "", area: "", password: "" };
  const [loginData, setLoginData] = useState(initialState);
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false)
  const [loginErrors, setLoginErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [newPasswordModalOpen, setNewPasswordModalOpen] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    securityQuestion: '',
    securityAnswer: '',
    email: '',
    area:''

  });

  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [isForget, setIsForget] = useState(false);
  const [login, setLogin] = useState(true);
  const [signup,setSignUp]=useState(false);
  const [myapiEndpoint,setApiEnPoint]=useState(null);
  

  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedArea = localStorage.getItem('rememberedArea');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedUsername && rememberedPassword) {
      setLoginData({ ...loginData, [loginData.email]: rememberedUsername, [loginData.area]: rememberedArea, [loginData.password]: rememberedPassword });
      setRememberMe(true);
    }
  }, [])
  console.log()
  

  const handleRememberme = (e) => {
    setRememberMe(!rememberMe);
  }


  useEffect(() => {
    if (loginData.area && areaToApiEndpoint[loginData.area]) {
      axios.get(areaToApiEndpoint[loginData.area])
        .then((response) => {
          // let data = Object.values(response.data);
          const data = Object.entries(response.data).map(([uid, user]) => ({ uid, ...user }));
          setData(data);
          console.log("area==>", data)
          console.log(data, "data response from firebase");
        });
    }
    setUserArea(loginData.area)
  }, [loginData.area, areaToApiEndpoint]);
//  const forgotapiEndpoint=[...data];


//   console.log("area--login",forgotapiEndpoint);

  const handleData = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };
  console.log(loginData,"loginData3");

  const checkData = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const itemExist = data.findIndex(
        (item) => item.email === loginData.email
      );
      const singleLoginuser = data.find((item) => item.email === loginData.email);
      console.log(singleLoginuser,"singleloginuserdetails");
      if (itemExist > -1) {
        if (
          data[itemExist].email === loginData.email &&
          data[itemExist].password === loginData.password
        ) {
          setFlag(true);
          toast.success("You are logged in successfully.", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
          setLoginData(initialState);
 
          navigate("/mainPage");
 
          localStorage.setItem("username", singleLoginuser.firstname)
          localStorage.setItem("role", singleLoginuser.role)
          localStorage.setItem("userarea", singleLoginuser.area)
          localStorage.setItem("userUid", singleLoginuser.uid); // Store UID
          // setUserUid(singleLoginuser.uid); // Update state with UID
 
          window.location.reload(); // Reload the page
          // console.log(flag, "flag");
 
        } else {
          toast.error("Password Wrong, please enter correct password.", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
        }
      } else {
        toast.error("Invalid login credentials.", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "light",
        });
      }
      // setLogin(false);
    }
 
 
 
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', loginData.email);
      localStorage.setItem('rememberedPassword', loginData.password);
      localStorage.setItem('rememberedArea', loginData.area);
    } else {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberedArea');
    }
 
  };

  const validateForm = () => {
    // let isValid=true;
    let errors = {};
    
    if (loginData.email === "") {
      errors.email = "Enter email to login";
      setLoginErrors(errors);
      return false;
    }
  
    if (loginData.area === "") {
      errors.area = "Enter area to login";
      setLoginErrors(errors);
      return false;
    }
  
    if (loginData.password === "") {
      errors.password = "Enter password to login";
      setLoginErrors(errors);
      return false;
    }
  
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openForgotPasswordModal = () => setForgotPasswordModalOpen(true);
  const closeForgotPasswordModal = () => setForgotPasswordModalOpen(false);

  const handleForgotPasswordData = (event) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [event.target.name]: event.target.value,
    });
  };

  const [uniqueforgotUserId,setUniqueForgotUserId]=useState(null);
  console.log( uniqueforgotUserId,"forgotunique");
  

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();

    const { email, securityQuestion, securityAnswer, area } = forgotPasswordData;

    // Validate all fields are filled
    if (!email || !securityQuestion || !securityAnswer || !area) {
      toast.error("Please fill in all fields.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
      return;
    }

    // Ensure areaToApiEndpoint is defined and has entries
    if (!areaToApiEndpoint || Object.keys(areaToApiEndpoint).length === 0) {
      console.error("areaToApiEndpoint is not defined or is empty");
      toast.error("Configuration error. Please contact support.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
      return;
    }
    console.log(areaToApiEndpoint, "forgotdata");

    const apiEndpoint = areaToApiEndpoint[area.toLowerCase()] || "https://default-api.com/register.json";
    setApiEnPoint(apiEndpoint);
    console.log(apiEndpoint);

    try {
      const response = await axios.get(apiEndpoint);
      const data = response.data;
      console.log(data, "dataforgotdetails1");

      // Find user based on provided details
      const forgotUniqueUserId = Object.entries(data).find(([key, value]) => {
        return (
          value.securityQuestion === securityQuestion &&
          value.securityAnswer === securityAnswer &&
          value.area === area &&
          value.email === email
        );
      });

      if (forgotUniqueUserId) {
        const uniqueuserid = forgotUniqueUserId[0];
        setUniqueForgotUserId(uniqueuserid);
        // uniquecode=uniqueforgotUserId


        toast.success("Select a new password.", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "light",
        });
        console.log(uniqueforgotUserId,"uniquecode");

        setIsForget(false);
        setNewPasswordModalOpen(true);
        // setForgotPasswordData("");
        setForgotPasswordData({
          securityQuestion:'',
          securityAnswer:'',
          email:'',
          area:''
        }

        )

      } else {
        toast.error("Details do not match. Please try again.", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "light",
        });
      }

    } catch (error) {
      console.error("Error during forgot password process:", error);
      toast.error("An error occurred during the forgot password process.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };
  console.log(uniqueforgotUserId,"uniquecode1");//unique code console;

// useEffect(()=>{
//   console.log(setUniqueForgotUserId(uniqueuserid))

// },[uniqueuserid]);


  const handleNewPasswordData = (event) => {
    setNewPasswordData({
      ...newPasswordData,
      [event.target.name]: event.target.value,
    });
  };

  const [responseData, setResponseData] = useState([]); 
  
  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      toast.error("Passwords do not match. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light"
      });
      return;
    }

    if (!uniqueforgotUserId) {
      toast.error("User ID not found. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light"
      });
      return;
    }

    try {
      axios.get(myapiEndpoint)
  .then(response => {
    const userData = response.data[uniqueforgotUserId]; // Extract the user data using userId
    if (userData) {
      // Update the password locally
      userData.password = newPasswordData.newPassword;

      // PUT the entire updated data back to the same URL
      axios.put(myapiEndpoint, response.data)
        .then(response => {
          console.log("Password updated successfully!");
          console.log(response,"passwordChanged")
          toast.success("Your details Submitted Successfully.", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setNewPasswordModalOpen(false);
          setLogin(true);
          console.log(response.data,"putresponsedata");
          // newPasswordData.newPassword="";

          setNewPasswordData({
            newPassword: '',
            confirmPassword: ''
          });

        })
        .catch(error => {
          console.error("Error updating password:", error);
        });
    } else {
      console.log("User not found!");
    }
  })
  .catch(error => {
    console.error("Error fetching user data:", error);
  });
      
   

      // if (response.status === 200) {
      //   toast.success("Password updated successfully.", {
      //     position: "bottom-right",
      //     autoClose: 2000,
      //     theme: "light"
      //   });
      //   setLogin(true);
      //   navigate('/');
      //   setNewPasswordModalOpen(false);
      //   setForgotPasswordData({
      //     securityQuestion: '',
      //     securityAnswer: '',
      //     email: ''
      //   });
      //   setNewPasswordData({
      //     newPassword: '',
      //     confirmPassword: ''
      //   });
      // } else {
      //   toast.error("Failed to update password. Please try again.", {
      //     position: "bottom-right",
      //     autoClose: 2000,
      //     theme: "light"
      //   });
      // }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light"
      });
      console.error('Error updating password:', error);
    }
  }



  const handleSwitch = () => {
    setLogin(false);
    setIsForget(true);
    // setLogin(false);
    // if(isForget==true){
    // navigate('/');
    // }

    // setForgotPasswordModalOpen(isForget);
    // setNewPasswordModalOpen(!isForget);
  };
  const handleClose = () => {
    // navigate('/');
    setLogin(true);
  }
  
  const newPasswordClose = (e) => {
    setNewPasswordModalOpen(false);
    setLogin(true);
  }
  const handleSignUp = (e) => {
    setIsForget(false);
    setSignUp(true);

  }


  // let navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    area: "",
    phone: "",
    password: "",
    confirmpassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [signupErrors, setSignupErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    area: "",
    // loginarea:"",
    phone: "",
    password: "",
    confirmpassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const [selectedRole, setSelectedRole] = useState(null);

  



  const handleCheckboxChange = (event) => {
    setSelectedRole(event.target.value);
    console.log(event.target.value);
  };

  const {
    firstname,
    lastname,
    email,
    area,
    phone,
    password,
    confirmpassword,
    securityQuestion,
    securityAnswer,
  } = signupData;
  // console.log(signupData,"mysignupdata");

  const changeHandler = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    console.log(signupData,"mysignupdata");
    setSignupErrors({ ...signupErrors, [e.target.name]: "" }); // Reset error when input changes
  };

  const clearErrorOnFocus = (fieldName) => {
    setSignupErrors({ ...signupErrors, [fieldName]: "" });
    setLoginErrors({...loginErrors,[fieldName]:""})
  };

  const submitHandler = (e) => {
    e.preventDefault();
 
    let formValid = true;
    const newErrors = {};
 
    // Sequential validation
    if (firstname.trim() === "") {
      newErrors.firstname = "required";
      formValid = false;
    } else if (area.trim() === "") {
      newErrors.area = "required";
      formValid = false;
    }else if (email.trim() === "") {
      newErrors.email = "required";
      formValid = false;
    } else if (phone.trim() === "") {
      newErrors.phone = "required";
      formValid = false;
    }  else if (password.trim() === "") {
      newErrors.password = "required";
      formValid = false;
    } else if (!isPasswordValid(password)) {
      newErrors.password = "require length 8, 1char,1symbol,1number";
      formValid = false;
    } else if (confirmpassword.trim() === "") {
      newErrors.confirmpassword = "required";
      formValid = false;
    } else if (password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
      formValid = false;
    } else if (securityQuestion.trim() === "") {
      newErrors.securityQuestion = "required";
      formValid = false;
    } else if (securityAnswer.trim() === "") {
      newErrors.securityAnswer = "required";
      formValid = false;
    } else if (!selectedRole) {
      newErrors.role = "Please select a role";
      formValid = false;
    }
 
    if (!formValid) {
      setSignupErrors(newErrors);
      return; // Don't proceed with submission if form is invalid
    }
 
    // Create a data object for submission without errors
    const formData = {
      firstname,
      lastname,
      email,
      area,
      phone,
      password,
     
      securityQuestion,
      securityAnswer,
      role: selectedRole,
    };
 
    // const [responseData, setResponseData] = useState([]);
 
 
 
    console.log(formData, 'signupdata1');
    // Proceed with form submission if all fields are filled
    const apiEndpoint = areaToApiEndpoint[area.toLowerCase()] || "https://default-api.com/register.json";
    console.log(areaToApiEndpoint[area.toLowerCase()]);
 
    // Proceed with form submission if all fields are filled
    axios.post(apiEndpoint, formData)
    .then(response => {
      setData(response.data);
      setResponseData(prevData => [...prevData, data]); // Append new response data to the array
      console.log(response, 'responseData'); // Log the response data
      if(response.status === 200){
       const responseData= axios.get(apiEndpoint)
       setResponseData(response.data);
       console.log(responseData,"apiendpointgetdata");
        // .then(response=>{
        //   console.log(response,"apiendpointdata")
        // })
        // .catch((error)=>{
        //   console.log(error,"apiendpointdata")
        // })
      }
      console.log(responseData,"apiendpointgetdata");
      toast.success("Your details Submitted Successfully.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
 
      // Reset form and state after successful submission
      setSignUp(false);
      // setFormData({
      //   firstname: "",
      //   lastname: "",
      //   email: "",
      //   area: "",
      //   phone: "",
      //   password: "",
      //   confirmpassword: "",
      //   securityQuestion: "",
      //   securityAnswer: "",
      //   role: ""
      // });
    })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toast.error(
          "An error occurred while submitting the form. Please try again.",
          {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      });
 
 
  };

  const isPasswordValid = (password) => {
    // Password must be at least 8 characters long and contain at least 1 character, 1 symbol, and 1 number
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  }




  return (
    <>
      <div className="main-div">
            <img src={ImageOne} alt="imageone" className="up-image" />
          
        <div className="loginPage-left-mainContainer">
          <div className="left-logo-mainContainer">
            <img src={Logo} alt="logo" className="img" />
            <p className="login-mainPageText"><b>A Home away from home, where strangers become friends and every day is an adventure.</b></p>
          </div>
        </div>
        <div className="loginPage-right-mainContainer">
          <div className="checkpage">
             {!signup ? (login ? (
              <form onSubmit={checkData} className="input-form">
              <h1 className="login-heading mb-3">Login</h1>
              <div className="mbl-inputField">
                <input
                  type="email"
                  className={`form-control custom-input ${loginErrors?.email && "is-invalid"} ${loginData.email.trim() === "" && "empty-field"}`}
                  placeholder="Username or Email"
                  onChange={handleData}
                  value={loginData.email}
                  onFocus={() => clearErrorOnFocus("email")}
                  name="email"
                  id="mail"
                />
                {loginErrors.email && <p className="form-error-msg">{loginErrors.email}</p>}
              </div>
              <div className="mbl-inputField">
                <input
                  type="area"
                  className={`form-control custom-input ${loginErrors?.area && "is-invalid"} ${loginData.area.trim() === "" && "empty-field"}`}
                  placeholder="Enter Area"
                  onChange={handleData}
                  value={loginData.area}
                  onFocus={() => clearErrorOnFocus("area")}
                  name="area"
                  id="area"
                />
                {loginErrors.area && <p className="form-error-msg">{loginErrors.area}</p>}
              </div>
              <div>
                <input
                  type="password"
                  className={`form-control custom-input ${loginErrors?.password && "is-invalid"} ${loginData.password.trim() === "" && "empty-field"}`}
                  placeholder="Password"
                  onChange={handleData}
                  value={loginData.password}
                  onFocus={() => clearErrorOnFocus("password")}
                  name="password"
                  id="pass"
                />
                {loginErrors.password && <p className="form-error-msg">{loginErrors.password}</p>}
              </div>
              <div>
                <button type="submit" className="login-button">Login</button>
              </div>
              <div className='loginfooter'>
                <div className="signupdiv">
                  <p>Don't have an account?</p>
                  <span className="forgotText" onClick={(e) => handleSignUp()}>
                    Sign Up
                  </span>
                </div>
                <div className="forgotbtndiv">
                  <span className="forgotText" onClick={handleSwitch}>Forgot password</span>
                </div>
              </div>
            </form>):
            isForget ? (
            <form onSubmit={handleForgotPasswordSubmit} className="input-form">
              <h1 className="login-heading pb-2">Forgot Password</h1>
              <div className="form-group">
                <select
                  name="securityQuestion"
                  className="form-control rounded-pill"
                  value={forgotPasswordData.securityQuestion}
                  onChange={handleForgotPasswordData}
                  required
                >
                  <option value="">Select a security question</option>
                  <option value="question1">What was the name of your first pet?</option>
                  <option value="question2">What is your mother's maiden name?</option>
                  <option value="question3">What is your favorite color?</option>
                  <option value="question4">What is the name of the city you were born in?</option>
                  <option value="question5">What was the make of your first car?</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Enter your security answer"
                  name="securityAnswer"
                  value={forgotPasswordData.securityAnswer}
                  onChange={handleForgotPasswordData}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  name="email"
                  value={forgotPasswordData.email}
                  onChange={handleForgotPasswordData}
                  required
                />
              </div>
              <div className="form-group">
                  <input
                          type="text"
                          className="form-control rounded-pill"
                          placeholder="Enter your area"
                          name="area"
                          value={forgotPasswordData.area}
                          onChange={handleForgotPasswordData}
                          required
                        />
                      </div>
              <div id="securtybtn" className="d-flex justify-content-between">
              <button id="closesbt" type="close" className="btn btn-secondary" onClick={handleClose}>Close</button>
                <button id="forgotsbt" type="submit" className="btn btn-primary" >Submit</button>

              </div>

             
            </form>) : (
              newPasswordModalOpen && (
                <form onSubmit={handleNewPasswordSubmit}>
                <h1 className="login-heading mt-3 mb-3 text-center">New Password</h1>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control rounded-pill custom-form-control"
                      id="newPassword"
                      placeholder="Enter your new password"
                      name="newPassword"
                      value={newPasswordData.newPassword}
                      onChange={handleNewPasswordData}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control rounded-pill custom-form-control"
                      id="confirmPassword"
                      placeholder="Confirm your new password"
                      name="confirmPassword"
                      value={newPasswordData.confirmPassword}
                      onChange={handleNewPasswordData}
                      required
                    />
                  </div>
                  <div id='footerbtn' className="d-flex justify-content-between mb-3">
                  <button type="button" className="btn btn-secondary" onClick={(e) => newPasswordClose()}>Close</button>
                    <button type="submit" className="btn btn-primary">Submit</button>

                  </div>
                </form>
              )
            )
          
          ): (
            <form className="row p-2"  onSubmit={submitHandler}>
            <h2 className="text-center login-heading p-2">SignUp</h2>
          <div className="form-group col-md-6">
            <input 
              type="text"
              name="firstname"
              value={firstname}
              onChange={changeHandler}
              placeholder="Enter Your FirstName"
              onFocus={() => clearErrorOnFocus("firstname")}
              className="rounded-pill"
            />
            {signupErrors.firstname && <div className="form-error-msg">{signupErrors.firstname}</div>}
          </div>
          {/* <div className="form-group col-md-6">
            
            <input
              type="text"
              name="lastname"
              value={lastname}
              onChange={changeHandler}
              placeholder="Enter Your LastName"
              onFocus={() => clearErrorOnFocus("lastname")}
              className="form-control rounded-pill"
            />
            {signupErrors.lastname && <div className="text-danger">{signupErrors.lastname}</div>}
          </div> */}
          <div className="form-group col-md-6">
            <input
              type="area"
              name="area"
              value={area}
              onChange={changeHandler}
              placeholder="Enter Your area"
              onFocus={() => clearErrorOnFocus("area")}
              className="rounded-pill"
            />
            {signupErrors.area && <div className="form-error-msg">{signupErrors.area}</div>}
          </div>
          <div className="form-group col-md-6">
            <input
              type="email"
              name="email"
              value={email}
              onChange={changeHandler}
              placeholder="Enter Your Email"
              onFocus={() => clearErrorOnFocus("email")}
              className="rounded-pill"
            />
            {signupErrors.email && <div className="form-error-msg">{signupErrors.email}</div>}
          </div>
          <div className="form-group col-md-6">
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={changeHandler}
              placeholder="Mobile number"
              onFocus={() => clearErrorOnFocus("phone")}
              className="rounded-pill"
            />
            {signupErrors.phone && <div className="form-error-msg">{signupErrors.phone}</div>}
          </div>
          <div className="form-group col-md-6">
            {/* <label htmlFor="password">Password:</label> */}
            <input
              type="password"
              name="password"
              value={password}
              onChange={changeHandler}
              placeholder="Enter Your Password"
              onFocus={() => clearErrorOnFocus("password")}
              className="form-control rounded-pill"
            />
            {signupErrors.password && <div className="form-error-msg">{signupErrors.password}</div>}
          </div>
          <div className="form-group col-md-6">
            {/* <label htmlFor="confirmPassword">Confirm Password:</label> */}
            <input
              type="password"
              name="confirmpassword"
              value={confirmpassword}
              onChange={changeHandler}
              placeholder="Confirm Your Password"
              onFocus={() => clearErrorOnFocus("confirmpassword")}
              className="form-control rounded-pill"
            />
            {signupErrors.confirmpassword && (
              <div className="form-error-msg">{signupErrors.confirmpassword}</div>
            )}
          </div>
          <div className="form-group col-md-6">
            {/* <label htmlFor="securityQuestion">Security Question:</label> */}
            <select
              name="securityQuestion"
              value={securityQuestion}
              onChange={changeHandler}
              onFocus={() => clearErrorOnFocus("securityQuestion")}
              className="form-control rounded-pill"
            >
              <option value="">Select a security question</option>
              <option value="question1">What was the name of your first pet?</option>
              <option value="question2">What is your mother's maiden name?</option>
              <option value="question3">What is your favorite color?</option>
              <option value="question4">What is the name of the city you were born in?</option>
              <option value="question5">What was the make of your first car?</option>
            </select>
            {signupErrors.securityQuestion && <div className="form-error-msg">{signupErrors.securityQuestion}</div>}
          </div>
          <div className="form-group col-md-6">
            {/* <label htmlFor="securityAnswer">Security Answer:</label> */}
            <input
              type="text"
              name="securityAnswer"
              value={securityAnswer}
              onChange={changeHandler}
              placeholder="Enter your security answer"
              onFocus={() => clearErrorOnFocus("securityAnswer")}
              className="form-control rounded-pill"
            />
            {signupErrors.securityAnswer && <div className="form-error-msg">{signupErrors.securityAnswer}</div>}
          </div>
          <div className="form-group col-md-12">
            {/* <label className="loginText">Register As:</label> */}
            <div className="confirmationContainer ">
              <div  className="form-check form-check-inline d-flex">
                <input
                  name="role"
                  type="checkbox"
                  id="admin"
                  value="admin"
                  checked={selectedRole === "admin"}
                  onChange={handleCheckboxChange}
                  className="form-check-input "
                  onFocus={() => clearErrorOnFocus("role")}
                />
                <label className="form-check-label" htmlFor="admin">
                  Admin
                </label>
              </div>
              <div  className="form-check form-check-inline d-flex ">
                <input
                  name="role"
                  type="checkbox"
                  id="subadmin"
                  value="subAdmin"
                  checked={selectedRole === "subAdmin"}
                  onChange={handleCheckboxChange}
                  className="form-check-input"
                  onFocus={() => clearErrorOnFocus("role")}
                />
                <label className="form-check-label" htmlFor="subAdmin">
                  Subadmin
                </label>
              </div>
            </div>
            {/* {signupErrors.role && <div className="text-danger">{signupErrors.role}</div>} */}
          </div>
          <div className="form-group col-md-12">
            {/* <input type="submit" className="btn btn-primary rounded-pill" value="Sign up" /> */}
            <input type="submit" id='submit' className="btn btn-primary rounded-pill" value="Sign up" />
          </div>
          <p className="text-center">
          Already have an account?<span className="forgotText" onClick={()=>setSignUp(false)}>Login</span>
        </p>

        </form>
          )}
           
           


          </div>
        </div>

        <img src={ImageTwo} alt="imagetwo" className="down-image" />
      </div>
    </>
  );

};

export default Login;