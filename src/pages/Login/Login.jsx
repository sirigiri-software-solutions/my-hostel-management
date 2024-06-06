
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import Modal from 'react-modal';
import ImageOne from "../../images/Vector 1 (1).png";
import ImageTwo from "../../images/Vector 3 (2).png";
import Logo from "../../images/image.png";
import './Login.css';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Modal.setAppElement('#root'); // Ensure this is set for accessibility

const Login = () => {
  const navigate = useNavigate();
  const initialState = { email: "", password: "" };
  const [loginData, setLoginData] = useState(initialState);
  const [data, setData] = useState([]);
  const [loginErrors, setLoginErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [newPasswordModalOpen, setNewPasswordModalOpen] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
  
    
    securityQuestion: '',
    securityAnswer: '',
    email: ''
  });
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedUsername && rememberedPassword) {
      setLoginData({ email: rememberedUsername, password: rememberedPassword });
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    axios.get("https://kiranreddy-58a8c-default-rtdb.firebaseio.com/register.json")
      .then((response) => {
        let data = Object.values(response.data);
        setData(data);
      });
  }, []);
  console.log(data,'registerdata');

  const handleData = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const checkData = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const user = data.find(item => item.email === loginData.email && item.password === loginData.password);
      if (user) {
        toast.success("You are logged in successfully.", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "light",
        });
        navigate("/mainPage");
        localStorage.setItem("username", user.firstname);
        localStorage.setItem("role", user.role);
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
    } else {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
    }

  };

  const validateForm = () => {
    let errors = {};
    if (loginData.email === "") errors.email = "Enter email to login";
    if (loginData.password === "") errors.password = "Enter password to login";
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

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault();
    const user = data.find(item =>
      item.securityQuestion === forgotPasswordData.securityQuestion &&
      item.securityAnswer === forgotPasswordData.securityAnswer &&
      item.email === forgotPasswordData.email
    );
    if (user) {
      toast.success("select a new password.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
        
      });
      // setForgotPasswordModalOpen(false);
      setIsForget(false);
      setNewPasswordModalOpen(true);
      
    } else {
      toast.error("Details do not match. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  const handleNewPasswordData = (event) => {
    setNewPasswordData({
      ...newPasswordData,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewPasswordSubmit = (event) => {
    event.preventDefault();
    if (newPasswordData.newPassword === newPasswordData.confirmPassword) {
      const updatedData = data.map(item =>
        item.email === forgotPasswordData.email ? { ...item, password: newPasswordData.newPassword,confirmPassword:newPasswordData.confirmPassword } : item
        
      );
       console.log(newPasswordData,"newpassworddata");
      console.log(updatedData,"updatedata");

      setData(updatedData);
      toast.success("Password updated successfully.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
        // navigate('/');
      }
      

    );
    setLogin(true);
      navigate('/');
      setNewPasswordModalOpen(false);
      // navigate('/');
      setForgotPasswordData({
        // firstname: '',
        // lastname: '',
        securityQuestion: '',
        securityAnswer: '',
        email: ''
      });
      setNewPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      toast.error("Passwords do not match. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  const [isForget, setIsForget] = useState(false);
  const [login, setLogin] = useState(true);
  const [signup,setSignUp]=useState(false);

  const handleSwitch = () => {
    setLogin(false);
    setIsForget(!isForget);
    // setLogin(false);
    // if(isForget==true){
    // navigate('/');
    // }

    // setForgotPasswordModalOpen(isForget);
    // setNewPasswordModalOpen(!isForget);
  };
  const handleClose=()=>{
  // navigate('/');
  setLogin(true);
  }
  const forgotSubmit=()=>{
    setIsForget(false);
     setNewPasswordModalOpen(true);
      
  }
  const newPasswordClose=(e)=>{
    setNewPasswordModalOpen(false);
    setLogin(true);
  }
  const handleSignUp=(e)=>{
    setIsForget(false);
    setSignUp(true);
    
  }


  // let navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
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
    phone,
    password,
    confirmpassword,
    securityQuestion,
    securityAnswer,
  } = signupData;

  const changeHandler = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setSignupErrors({ ...signupErrors, [e.target.name]: "" }); // Reset error when input changes
  };

  const clearErrorOnFocus = (fieldName) => {
    setSignupErrors({ ...signupErrors, [fieldName]: "" });
  };

  const submitHandler = (e) => {
    e.preventDefault();
   
    let formValid = true;
    const newErrors = { ...signupErrors };

    // Check for empty fields
    if (firstname.trim() === "") {
      newErrors.firstname = "Please enter your first name";
      formValid = false;
    }

    if (lastname.trim() === "") {
      newErrors.lastname = "Please enter your last name";
      formValid = false;
    }

    if (email.trim() === "") {
      newErrors.email = "Please enter your email";
      formValid = false;
    }

    if (phone.trim() === "") {
      newErrors.phone = "Please enter your phone number";
      formValid = false;
    }

    if (password.trim() === "") {
      newErrors.password = "Please enter your password";
      formValid = false;
    } else if (!isPasswordValid(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain at least 1 character, 1 symbol, and 1 number";
      formValid = false;
    }

    if (confirmpassword.trim() === "") {
      newErrors.confirmpassword = "Please confirm your password";
      formValid = false;
    } else if (password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
      formValid = false;
    }

    if (securityQuestion.trim() === "") {
      newErrors.securityQuestion = "Please select a security question";
      formValid = false;
    }

    if (securityAnswer.trim() === "") {
      newErrors.securityAnswer = "Please provide a security answer";
      formValid = false;
    }

    if (!selectedRole) {
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
      phone,
      password,
      confirmpassword,
      securityQuestion,
      securityAnswer,
      role: selectedRole,
    };
    console.log(formData, 'signupdata');
    // Proceed with form submission if all fields are filled
    axios
      .post(
        "https://kiranreddy-58a8c-default-rtdb.firebaseio.com/register.json",
        formData
      )
      .then(() => {
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
        setSignUp(false)
        setSignupData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
          confirmpassword: "",
          securityQuestion: "",
          securityAnswer: "",
        }); // Clear input fields after successful submission
        navigate("/");
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
  };

  return (
    <>
      <div className="main-div">
        <div className="left-div">
          <div className="image-container">
            <img src={ImageOne} alt="imageone" className="up-image" />
          </div>
          <div className="logo-container">
            <img src={Logo} alt="logo" className="img" />
            <p className="p"><b>A Home away from home, where strangers become friends and every day is an adventure.</b></p>
          </div>
        </div>
        {!signup ? (
          login ? (
            <div className="right-div">
              <div className="right-div-content">
                <div className="form-container">
                  <form onSubmit={checkData} className="input-form">
                    <h1 className="login-heading">LOGIN</h1>
                    <div className="mbl-inputField">
                      <input
                        type="email"
                        className={`form-control ${loginErrors?.email && "is-invalid"} ${loginData.email.trim() === "" && "empty-field"}`}
                        placeholder="Username or Email"
                        onChange={handleData}
                        value={loginData.email}
                        name="email"
                        id="mail"
                      />
                      {loginErrors.email && <div className="invalid-feedback">{loginErrors.email}</div>}
                    </div>
                    <div>
                      <input
                        type="password"
                        className={`form-control ${loginErrors?.password && "is-invalid"} ${loginData.password.trim() === "" && "empty-field"}`}
                        placeholder="Password"
                        onChange={handleData}
                        value={loginData.password}
                        name="password"
                        id="pass"
                      />
                      {loginErrors.password && <div className="invalid-feedback">{loginErrors.password}</div>}
                    </div>
                    <div>
                      <button type="submit" className="login-button">Login</button>
                    </div>
                    <div className='loginfooter'>
                      <div className="signupdiv">
                        <p>Don't have an account?</p>
                        <Link to="" onClick={(e) => handleSignUp()}>
                          <b>Sign Up</b>
                        </Link>
                      </div>
                      <div className="forgotbtndiv">
                        <Link to="" className="forgotbtn" onClick={handleSwitch}>Forgot password</Link>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="image-right-container">
                  <img src={ImageTwo} alt="imagetwo" className="down-image" />
                </div>
              </div>
            </div>
          ) : (
            isForget ? (
              <div className="right-div">
                <div className="popup-div-content">
                  <div className="form-container">
                    <form onSubmit={handleForgotPasswordSubmit} className="input-form">
                      <h1 className="login-heading">Forgot Password</h1>
                      <div className="mbl-inputField">
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
                      <div className="mbl-inputField">
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
                      <div className="mbl-inputField">
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
                      <div id="securtybtn" className="d-flex justify-content-between">
                        <button id="forgotsbt" type="submit" className="btn btn-primary" onClick={forgotSubmit}>Submit</button>
                        <button id="closesbt" type="close" className="btn btn-secondary" onClick={handleClose}>Close</button>
                      </div>
                    </form>
                  </div>
                  <div className="image-right-container">
                    <img src={ImageTwo} alt="imagetwo" className="down-image" />
                  </div>
                </div>
              </div>
            ) : (
              newPasswordModalOpen && (
                <div className="right-div">
                  <div className="right-div-content">
                    <div className="form-container">
                      <form onSubmit={handleNewPasswordSubmit}>
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
                        <div id='footerbtn' className="custom-modal-footer">
                          <button type="submit" className="btn btn-primary">Submit</button>
                          <button type="button" className="btn btn-secondary" onClick={(e) => newPasswordClose()}>Close</button>
                        </div>
                      </form>
                    </div>
                    <div className="image-right-container">
                      <img src={ImageTwo} alt="imagetwo" className="down-image" />
                    </div>
                  </div>
                </div>
              )
            )
          )
        ) : (
          <div className="right-div signupMainContainer">
          <div className="right-div-content">
            <div className="form-container">

            <form className="signupFormZindex" autoComplete="off" onSubmit={submitHandler} className="row">
            <h1 className="login-heading">SignUp</h1>
          <div className="form-group col-md-6">
          
            <input 
              type="text"
              name="firstname"
              value={firstname}
              onChange={changeHandler}
              placeholder="Enter Your FirstName"
              onFocus={() => clearErrorOnFocus("firstname")}
              className="form-control rounded-pill"
            />
            {signupErrors.firstname && <div id="errortextchange" className="text-danger">{signupErrors.firstname}</div>}
          </div>
          <div className="form-group col-md-6">
            {/* <label htmlFor="lastname">Lastname:</label> */}
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
          </div>
          <div className="form-group col-md-6">
            {/* <label htmlFor="email">Email:</label> */}
            <input
              type="email"
              name="email"
              value={email}
              onChange={changeHandler}
              placeholder="Enter Your Email"
              onFocus={() => clearErrorOnFocus("email")}
              className="form-control rounded-pill"
            />
            {signupErrors.email && <div className="text-danger">{signupErrors.email}</div>}
          </div>
          <div className="form-group col-md-6">
            {/* <label htmlFor="mobile">Mobile:</label> */}
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={changeHandler}
              placeholder="Mobile number"
              onFocus={() => clearErrorOnFocus("phone")}
              className="form-control rounded-pill"
            />
            {signupErrors.phone && <div className="text-danger">{signupErrors.phone}</div>}
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
            {signupErrors.password && <div className="text-danger">{signupErrors.password}</div>}
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
              <div className="text-danger">{signupErrors.confirmpassword}</div>
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
            {signupErrors.securityQuestion && <div id='errortextchange' className="text-danger">{signupErrors.securityQuestion}</div>}
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
            {signupErrors.securityAnswer && <div className="text-danger">{signupErrors.securityAnswer}</div>}
          </div>
          <div className="form-group col-md-12">
            {/* <label className="loginText">Register As:</label> */}
            <div className="confirmationContainer">
              <div className="form-check form-check-inline">
                <input
                  name="role"
                  type="checkbox"
                  id="admin"
                  value="admin"
                  checked={selectedRole === "admin"}
                  onChange={handleCheckboxChange}
                  className="form-check-input rounded-pill"
                  onFocus={() => clearErrorOnFocus("role")}
                />
                <label className="form-check-label" htmlFor="admin">
                  Admin
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  name="role"
                  type="checkbox"
                  id="subAdmin"
                  value="subAdmin"
                  checked={selectedRole === "subAdmin"}
                  onChange={handleCheckboxChange}
                  className="form-check-input rounded-pill"
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
          Already have an account?<span onClick={()=>setSignUp(false)}>Login</span>
        </p>

        </form>
       
       
            </div>
            
            <div className="image-right-container signupMobileDownImgContainer">
              <img src={ImageTwo} alt="imagetwo" className="down-image" />
            </div>
          </div>
        </div>
         
        )}
      </div>
    </>
  );
  
};

export default Login;