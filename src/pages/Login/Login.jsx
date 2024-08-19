import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ImageOne from "../../images/Vector 1 (1).png";
import ImageTwo from "../../images/Vector 3 (2).png";
import moment from 'moment';

import Logo from "../../images/HMLogo3.png"
import newLogo from "../../images/favicon (2).jpg"
import './Login.css';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useData } from "../../ApiData/ContextProvider";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import { ref, set, get,update} from 'firebase/database';




export const loginContext = createContext();

const Login = () => {
  const navigate = useNavigate();
  const { areaToApiEndpoint, setUserArea, setUserUid, firebase, setArea,setIsSubscribed} = useData();

  const initialState = { Id: "", email: "", area: "", password: "" };
  const [loginData, setLoginData] = useState(initialState);
  const [signupData, setSignupData] = useState({
    firstname: "",
    email: "",
    area: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [data, setData] = useState([]);

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    area: ''
  });

  const [isForget, setIsForget] = useState(false);
  const [login, setLogin] = useState(true);
  const [signup, setSignUp] = useState(false);
  const [myapiEndpoint, setApiEnPoint] = useState(null);

  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({
    firstname: "",
    email: "",
    area: "",
    phone: "",
    password: "",
  });

  const [uniqueforgotUserId, setUniqueForgotUserId] = useState(null);

  const areaOptions = [ "default", "ameerpet", "srnagar", "secunderabad", "kukatpally", "gachibouli", "ashoknagar", "dhilshuknagar", "himayathnagar", "madhuranagar", "madhapur", "lbnagar", "nanakramguda"];


  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signupError, setSignUpError] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideSingupPassword, sethideSingupPassword] = useState(true);
  const [hideconfirmPassword, setHideConfirmPassword] = useState(true);


  const { auth, database, setFirstLogin  } = firebase;


  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };
  const toggleSignUpPasswordVisibility = () => {
    sethideSingupPassword(!hideSingupPassword)
  }

  const toggleSignUpPasswordConfirmVisibility = () => {
    setHideConfirmPassword(!hideconfirmPassword)
  }


  useEffect(() => {
    if (loginData.area && areaToApiEndpoint[loginData.area]) {
      axios.get(areaToApiEndpoint[loginData.area])
        .then((response) => {
          const data = Object.entries(response.data).map(([uid, user]) => ({ uid, ...user }));
          setData(data);

        });
    }
    setUserArea(loginData.area)
  }, [loginData.area, areaToApiEndpoint]);


  const handleData = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
    if (event.target.name === "area") {
      setArea(event.target.value)
    }

  };


  const checkData = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          loginData.email,
          loginData.password
        );
        const user = userCredential.user;

        console.log(user,"user")

        if (user.emailVerified) {
          const singleLoginUser = data.find(
            (item) =>
              item.signUpEmail === loginData.email &&
              item.area === loginData.area
          );
         console.log(data,"singleLogin")
         console.log(singleLoginUser,"singleLogin")
         console.log(singleLoginUser.firstLogin,"singleLogin")

          if (singleLoginUser) {
            setLoginData({
              Id: "",
              email: "",
              area: "",
              password: "",
            });

            console.log("Username:", singleLoginUser.firstname);
            console.log("User Area:", singleLoginUser.area);
            console.log("User UID:", singleLoginUser.uid);
            localStorage.setItem("username", singleLoginUser.firstname);
            localStorage.setItem("userarea", singleLoginUser.area);
            localStorage.setItem("userUid", singleLoginUser.uid);
            setUserUid(singleLoginUser.uid);
            const now = moment();
            const accessEnd = singleLoginUser.accessEnd ? moment(singleLoginUser.accessEnd) : null;

             if (typeof singleLoginUser.firstLogin === 'undefined') {
            const userRef = ref(database, `register/${singleLoginUser.uid}`);
            update(userRef, {
              firstLogin: true,
              accessEnd: now.add(1, 'minute').toISOString(),
            });
            localStorage.setItem('accessEnd', now.add(1, 'minute').toISOString());
          } 
            else if(singleLoginUser.firstLogin === false){
              const userRef = ref(database, `register/${singleLoginUser.uid}`);
              update(userRef, {
                firstLogin: true,
                accessEnd: now.add(1, 'minute').toISOString(),
              })
              localStorage.setItem('accessEnd', now.add(1, 'minute').toISOString());

            }else if (accessEnd && now.isAfter(accessEnd)) {
              navigate('/subscribe');
              return;
            } else {
              // Set access end from the database
              localStorage.setItem('accessEnd', accessEnd.toISOString());
            }

            setUserUid(singleLoginUser.uid);
            navigate("/mainPage");

            toast.success("You are logged in successfully.", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            console.log("User not found in data array.");
          }
        } else {
          toast.error("Email is not verified.", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        toast.error("Invalid credentials.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });


      }
    }
  };

 
  


  const validateForm = () => {
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



  const handleForgotPasswordData = (event) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [event.target.name]: event.target.value,
    });
    if (event.target.name === "area") {
      setArea(event.target.value);
    }
  };




  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();

    const { email, area } = forgotPasswordData;

    if (!email || !area) {
      toast.error("Please fill in all fields.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
      return;
    }

    let data;
    await axios.get(areaToApiEndpoint[area])
      .then((response) => {
        data = Object.entries(response.data).map(([uid, user]) => ({ uid, ...user }));
      })
      .catch((e) => {
        console.log("Error while fetching data");
      });


    const singleLoginuser = data.filter((item) => item.signUpEmail === email && item.area === area);

    if (singleLoginuser.length > 0) {
      try {
        await sendPasswordResetEmail(auth, email);
        toast.success("Reset password link sent to email.", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "light",
        });
        setForgotPasswordData({
          email: '',
          area: ''
        });
        setLogin(true);
        setIsForget(false);


      } catch (error) {
        toast.error("Invalid email", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "light",
        });

      }

    } else {
      toast.error("Invalid email", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
    }



  };


  function onClickLogin(e) {
    setSignUp(false);
    setSignupData({
      firstname: "",
      email: "",
      area: "",
      phone: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",

    });
    setLoginData({
      id: "",
      email: "",
      area: "",
      password: "",
    })

    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpError("");
  }

  const handleSwitch = () => {
    setLogin(false);
    setIsForget(true);
  };

  const handleClose = () => {
    setForgotPasswordData({
      securityQuestion: '',
      securityAnswer: '',
      email: '',
      area: ''
    }

    )
    setLoginData({
      id: "",
      email: "",
      area: "",
      password: "",
    })
    setLogin(true);
  }

  const handleSignUp = (e) => {
    setSignupData({
      firstname: "",
      email: "",
      area: "",
      phone: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",

    })

    setIsForget(false);
    setSignUp(true);

  }



  const {
    firstname,
    email,
    area,
    phone,
    password,
    confirmPassword
  } = signupData;

  const changeHandler = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });

    setSignupErrors({ ...signupErrors, [e.target.name]: "" });
    if (e.target.name === "area") {
      setArea(e.target.value)
    }
  };

  const clearErrorOnFocus = (fieldName) => {
    setSignupErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
    setLoginErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    let formValid = true;
    const newErrors = {};

    const firstname = e.target.firstname?.value || "";
    const signUpEmail = e.target.email?.value || "";
    const phone = e.target.phone?.value || "";
    const area = e.target.area?.value || "";

    const confirmPassword = e.target.confirmPassword?.value || "";

    const phoneRegexWithCountryCode = /^\+\d{12}$/;
    const phoneRegexWithoutCountryCode = /^\d{10}$/;

    if (firstname.trim() === "") {
      newErrors.firstname = "required";
      formValid = false;
    } else if (signUpEmail.trim() === "") {
      newErrors.email = "required";
      formValid = false;
    } else if (phone.trim() === "") {
      newErrors.phone = "required";
      formValid = false;
    } else if (!phoneRegexWithCountryCode.test(phone) && !phoneRegexWithoutCountryCode.test(phone)) {
      newErrors.phone = "Enter valid number";
      formValid = false;
    } else if (area.trim() === "") {
      newErrors.area = "required";
      formValid = false;
    } else if (signUpPassword.trim() === "") {
      newErrors.password = "required";
      formValid = false;
    } else if (signUpPassword.trim().length < 8) {
      newErrors.password = "Weak password";
      formValid = false;
    } else if (confirmPassword.trim() === "") {
      newErrors.confirmPassword = "required";
      formValid = false;
    } else if (signUpPassword !== confirmPassword) {
      newErrors.confirmPassword = "Password doesn't match";
      formValid = false;
    }

    if (!formValid) {
      setSignupErrors(newErrors);
      return;
    }


    const formData = {
      area,
      firstname,
      phone,
      signUpEmail,
      firstLogin:false,
      subscriptionPlan:null,
      accessEnd:null
    };



    const apiEndpoint = areaToApiEndpoint[area.toLowerCase()] || "https://default-api.com/register.json";


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      await sendEmailVerification(userCredential.user);


      toast.success("A verification link has been sent to your email", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      const response = await axios.post(apiEndpoint, formData);
      setData(response.data);

      setSignUp(false);
      setSignupData({
        email: "",
        area: "",
        password: "",
        name: ""
      });
      setSignUpPassword("");
      setSignUpEmail("");

    } catch (error) {
      if (axios.isAxiosError(error)) {

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
      } else if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        setSignUpError("Email already in use");
        setSignUp(true);
        setSignupData({
          email: "",
          area: "",
          password: "",
          name: "",
        });
      } else {
        setSignUpError(error.message);
      }

    }
  };







  const isPasswordValid = (password) => {

    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  return (
    <>
      <div className="main-div">


        <div className="loginPage-left-mainContainer">
          <div className="left-logo-mainContainer">
            <img src={Logo} alt="logo" className="img" />
            <p className="login-mainPageText"><b>A Home away from home, where strangers become friends and every day is an adventure.</b></p>
          </div>
        </div>
        <div className="loginPage-right-mainContainer">
          <div className="checkpage">
            <div className="loginSingupHeadContianer">
              <img src={newLogo} alt="HM" className="loginSigninLogo" />
              <p className="cardsHeading">HOSTEL <br />MANAGEMENT</p>
            </div>
            {!signup ? (login ? (
              <>
                <form onSubmit={checkData} className="input-form w-100 p-2">
                  <h1 className="login-heading mb-3">Login</h1>
                  <div className="mbl-inputField">
                    <input
                      type="email"
                      className={`form-control custom-input ${loginErrors?.email && "is-invalid"} ${loginData.email.trim() === "" && "empty-field"}`}
                      placeholder="Enter email"
                      onChange={handleData}
                      value={loginData.email}
                      onFocus={() => clearErrorOnFocus("email")}
                      name="email"
                      id="mail"
                    />
                    {loginErrors.email && <p className="form-error-msg">{loginErrors.email}</p>}
                  </div>
                  <div className="mbl-inputField ">
                    <select
                      className={`custom-select form-control custom-input rounded-pill selectarea ${loginErrors?.area && "is-invalid"} ${loginData.area.trim() === "" && "empty-field"} `}
                      onChange={handleData}
                      value={loginData.area}
                      onFocus={() => clearErrorOnFocus("area")}
                      name="area"
                      id="area"
                    >
                      <option id="selectarea" value=""  disabled >Select Your Area</option>
                      {areaOptions.map((area, index) => (

                        <option key={index} value={area}>
                          {capitalizeFirstLetter(area)}
                        </option>
                      ))}
                    </select>
                    {loginErrors.area && <p className="form-error-msg">{loginErrors.area}</p>}
                  </div>
                  <div>
                    <div class="showPasswordDiv">
                      <input
                        type={hidePassword ? 'password' : 'text'}
                        className={`form-control custom-input rounded-pill ${loginErrors?.password && "is-invalid"} ${loginData.password.trim() === "" && "empty-field"}`}
                        placeholder="Password"
                        onChange={handleData}
                        value={loginData.password}
                        onFocus={() => clearErrorOnFocus("password")}
                        name="password"
                        id="pass"
                      />
                      <FontAwesomeIcon
                        icon={hidePassword ? faEyeSlash : faEye}
                        className="password-toggle-icon"
                        onClick={togglePasswordVisibility}
                      />
                    </div>

                    <div className="forgotbtndiv">
                      <span className="forgotText" onClick={handleSwitch}>Forgot password?</span>
                    </div>
                    {loginErrors.password && <p className="form-error-msg">{loginErrors.password}</p>}
                  </div>
                  <div>
                    <button type="submit" className="login-button">Login</button>
                  </div>
                </form>
                <div className="signupdiv">
                  <p className="mt-2"> Are you new user? &nbsp;
                    <span className="forgotText" onClick={(e) => handleSignUp()}>
                      Register here
                    </span>
                  </p>
                </div>
              </>
            ) :
              isForget ? (
                <form onSubmit={handleForgotPasswordSubmit} className="input-form w-100">
                  <h1 className="login-heading mb-3">Forgot Password</h1>
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
                    <select
                      className="form-control rounded-pill custom-select"
                      name="area"
                      value={forgotPasswordData.area}
                      onChange={handleForgotPasswordData}
                      required
                    >
                      <option value="" disabled>Select Your Area</option>
                      {areaOptions.map((area, index) => (
                        <option key={index} value={area}>
                          {capitalizeFirstLetter(area)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div id="securtybtn" className="d-flex justify-content-between">
                    <button id="closesbt" type="close" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button id="forgotsbt" type="submit" className="btn btn-primary" >Submit</button>

                  </div>


                </form>) : null

            ) : (
              <form className="row p-2  w-100 mt-3" onSubmit={submitHandler}>
                <h2 className="text-center login-heading p-2">SignUp</h2>
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    name="firstname"
                    value={firstname}
                    onChange={changeHandler}
                    placeholder="Enter Name"
                    onFocus={() => clearErrorOnFocus("firstname")}
                    onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')}
                    className="rounded-pill"
                  />
                  {signupErrors.firstname && <div className="form-error-msg">{signupErrors.firstname}</div>}
                </div>
                <div className="form-group col-md-6">
                  <input
                    type="email"
                    name="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="Enter Email"
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
                    onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                    className="rounded-pill"
                  />
                  {signupErrors.phone && <div className="form-error-msg">{signupErrors.phone}</div>}
                </div>
                <div className="form-group col-md-6">
                  <select
                    name="area"
                    value={area}
                    onChange={changeHandler}
                    onFocus={() => clearErrorOnFocus("area")}
                    className="rounded-pill custom-select"
                  >
                    <option value="" disabled>Select Your Area</option>
                    {areaOptions.map((area, index) => (
                      <option key={index} value={area}>
                        {capitalizeFirstLetter(area)}
                      </option>
                    ))}
                  </select>
                  {signupErrors.area && <div className="form-error-msg">{signupErrors.area}</div>}
                </div>



                <div className="form-group col-md-6 position-relative">
                  <input
                    type={hideSingupPassword ? 'password' : 'text'}
                    name="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Enter Password"
                    onFocus={() => clearErrorOnFocus("password")}
                    className="form-control rounded-pill"
                  />
                  {signupErrors.password && <div className="form-error-msg">{signupErrors.password}</div>}
                  <FontAwesomeIcon
                    icon={hideSingupPassword ? faEyeSlash : faEye}
                    className="password-toggle-icon-signup"
                    onClick={toggleSignUpPasswordVisibility}
                  />
                </div>

                <div className="form-group col-md-6 position-relative">
                  <input
                    type={hideconfirmPassword ? "password" : "text"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={changeHandler}
                    placeholder="Confirm Password"
                    onFocus={() => clearErrorOnFocus("confirmPassword")}
                    className="form-control rounded-pill"
                  />
                  {signupErrors.confirmPassword && <div className="form-error-msg">{signupErrors.confirmPassword}</div>}
                  <FontAwesomeIcon
                    icon={hideconfirmPassword ? faEyeSlash : faEye}
                    className="password-toggle-icon-signup"
                    onClick={toggleSignUpPasswordConfirmVisibility}
                  />
                </div>

                {signupError && <p className="text-center error-message">{signupError}</p>}
                <div className="form-group col-md-11">
                  <input type="submit" id='submit' className="btn btn-primary rounded-pill" value="Sign up" />
                </div>
                <p className="text-center">
                  Already have an account?<span className="forgotText" onClick={(e) => onClickLogin(e)} > Login</span>
                </p>
              </form>
            )}

          </div>
        </div>


      </div>
    </>
  );

};

export default Login;