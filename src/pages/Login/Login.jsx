
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageOne from "../../images/Vector 1 (1).png";
import ImageTwo from "../../images/Vector 3 (2).png";
import Logo from "../../images/image.png";
import './Login.css'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from "../../ApiData/ContextProvider";

export const loginContext = createContext();

const Login = () => {
  const navigate = useNavigate();
  const { areaToApiEndpoint, setUserArea, setUserUid } = useContext(DataContext);
  const initialState = { Id: "", email: "", area: "", password: "" };
  const [loginData, setLoginData] = useState(initialState);
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  

  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedArea = localStorage.getItem('rememberedArea');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedUsername && rememberedPassword) {
      setLoginData({ ...loginData, [loginData.email]: rememberedUsername, [loginData.area]: rememberedArea, [loginData.password]: rememberedPassword });
      setRememberMe(true);
    }
  }, [])

  const handleRememberme = (e) => {
    setRememberMe(!rememberMe);
  }

  // useEffect(() => {
  //   axios
  //        .get("https://kiranreddy-58a8c-default-rtdb.firebaseio.com/register.json")
  //     .then((response) => {
  //       let data = Object.values(response.data);
  //       setData(data);
  //       console.log(data, "data response from firebase");
  //     });
  // }, []);

  //----------------------------
  useEffect(() => {
    if (loginData.area && areaToApiEndpoint[loginData.area]) {
      axios.get(areaToApiEndpoint[loginData.area])
        .then((response) => {
          // let data = Object.values(response.data);
          let data = Object.entries(response.data).map(([uid, user]) => ({ uid, ...user }));
          setData(data);
          console.log("area==>", data)
          console.log(data, "data response from firebase");
        });
    }
    setUserArea(loginData.area)
  }, [loginData.area, areaToApiEndpoint]);

  console.log("area--login", loginData.area)

  const handleData = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const checkData = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const itemExist = data.findIndex(
        (item) => item.email === loginData.email
      );
      const singleLoginuser = data.find((item) => item.email === loginData.email);
      // console.log(singleLoginuser);
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
        toast.warning("You are new user so, register please.", {
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
    }

    // If Remember Me is checked, store login information in localStorage
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', loginData.email);
      localStorage.setItem('rememberedArea', loginData.area);
      localStorage.setItem('rememberedPassword', loginData.password);
    } else {
      // If Remember Me is unchecked, remove stored login information from localStorage
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedArea');
      localStorage.removeItem('rememberedPassword');
    }
  };

  const hideErrors = (event) => {
    setLoginErrors({
      ...loginErrors,
      [event.target.name]: "",
    });
  };

  const checkErrors = (event) => {
    if (event.target.value === "") {
      setLoginErrors({
        ...loginErrors,
        [event.target.name]: "Enter " + event.target.name,
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};
    if (loginData.email === "") {
      errors.email = "Enter email to login";
      isValid = false;
    }
    if (loginData.area === "") {
      errors.email = "Enter area to login";
      isValid = false;
    }
    if (loginData.password === "") {
      errors.password = "Enter password to login";
      isValid = false;
    }
    setLoginErrors(errors);
    return isValid;
  };

  // const  area = localStorage.getItem('userarea');
  // const  name = localStorage.getItem('username');
  // setUserArea(area)
  // console.log("local-area", area);
  // console.log("local-name", name);

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
                    onFocus={hideErrors}
                    onBlur={checkErrors}
                    value={loginData.email}
                    name="email"
                    id="mail"
                  />
                  {loginErrors.email && <div className="invalid-feedback">{loginErrors.email}</div>}
                </div>
                <div className="mbl-inputField">
                  <input
                    type="text"
                    className={`form-control ${loginErrors?.area && "is-invalid"} ${loginData.area.trim() === "" && "empty-field"}`}
                    placeholder="enter Area"
                    onChange={handleData}
                    onFocus={hideErrors}
                    onBlur={checkErrors}
                    value={loginData.area}
                    name="area"
                    id="area"
                  />
                  {loginErrors.email && <div className="invalid-feedback">{loginErrors.email}</div>}
                </div>
                <div>
                  <input
                    type="password"
                    className={`form-control ${loginErrors?.password && "is-invalid"} ${loginData.password.trim() === "" && "empty-field"}`}
                    placeholder="Password"
                    onChange={handleData}
                    onFocus={hideErrors}
                    onBlur={checkErrors}
                    value={loginData.password}
                    name="password"
                    id="pass"
                  />
                  {loginErrors.password && <div className="invalid-feedback">{loginErrors.password}</div>}
                </div>
                <div className="check">

                  <p className="text">Forgot Password?</p>
                </div>
                <div>
                  <button type="submit" className="login-button">
                    Login
                  </button>
                </div>
              </form>
            </div>
            <div className="image-right-container">
              <img src={ImageTwo} alt="imagetwo" className="down-image" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;