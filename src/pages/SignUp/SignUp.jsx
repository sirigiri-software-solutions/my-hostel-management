import React, { useState } from "react";
import "./SignUp.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useData } from "../../ApiData/ContextProvider";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { areaToApiEndpoint } = useData();
  let navigate = useNavigate();
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    area: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    area: "",
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
  };

  const { firstname, lastname, area, email, phone, password, confirmpassword, securityQuestion, securityAnswer } = data;

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const clearErrorOnFocus = (fieldName) => {
    setErrors({ ...errors, [fieldName]: "" });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let formValid = true;
    const newErrors = { ...errors };

    if (firstname.trim() === "") {
      newErrors.firstname = "Please enter your first name";
      formValid = false;
    }

    if (lastname.trim() === "") {
      newErrors.lastname = "Please enter your last name";
      formValid = false;
    }

    if (area.trim() === "") {
      newErrors.area = "Please enter your area name";
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
      setErrors(newErrors);
      return;
    }

    const formData = {
      firstname,
      lastname,
      area,
      email,
      phone,
      password,
      confirmpassword,
      securityQuestion,
      securityAnswer,
      role: selectedRole,
    };


    const apiEndpoint = areaToApiEndpoint[area.toLowerCase()] || "https://default-api.com/register.json";


    axios
      .post(apiEndpoint, formData)
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
        setData({
          firstname: "",
          lastname: "",
          area: "",
          email: "",
          phone: "",
          password: "",
          confirmpassword: "",
          securityQuestion: "",
          securityAnswer: "",
        });
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
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  return (
    <div className="signup-page">
      <div className="signup-form">
        <text id='signuphead' className="signuphead">SignUp</text>
        <form autoComplete="off" onSubmit={submitHandler} className="row">
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
            {errors.firstname && <div className="text-danger">{errors.firstname}</div>}
          </div>
          <div className="form-group col-md-6">
            <input
              type="text"
              name="lastname"
              value={lastname}
              onChange={changeHandler}
              placeholder="Enter Your LastName"
              onFocus={() => clearErrorOnFocus("lastname")}
              className="form-control rounded-pill"
            />
            {errors.lastname && <div className="text-danger">{errors.lastname}</div>}
          </div>
          <div className="form-group col-md-6">
            <input
              type="text"
              name="area"
              value={area}
              onChange={changeHandler}
              placeholder="Enter Your Area"
              onFocus={() => clearErrorOnFocus("area")}
              className="form-control rounded-pill"
            />
            {errors.area && <div className="text-danger">{errors.area}</div>}
          </div>

          <div className="form-group col-md-6">

            <input
              type="email"
              name="email"
              value={email}
              onChange={changeHandler}
              placeholder="Enter Your Email"
              onFocus={() => clearErrorOnFocus("email")}
              className="form-control rounded-pill"
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="form-group col-md-6">

            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={changeHandler}
              placeholder="Mobile number"
              onFocus={() => clearErrorOnFocus("phone")}
              className="form-control rounded-pill"
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>
          <div className="form-group col-md-6">

            <input
              type="password"
              name="password"
              value={password}
              onChange={changeHandler}
              placeholder="Enter Your Password"
              onFocus={() => clearErrorOnFocus("password")}
              className="form-control rounded-pill"
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          <div className="form-group col-md-6">
            <input
              type="password"
              name="confirmpassword"
              value={confirmpassword}
              onChange={changeHandler}
              placeholder="Confirm Your Password"
              onFocus={() => clearErrorOnFocus("confirmpassword")}
              className="form-control rounded-pill"
            />
            {errors.confirmpassword && (
              <div className="text-danger">{errors.confirmpassword}</div>
            )}
          </div>
          <div className="form-group col-md-6">
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
            {errors.securityQuestion && <div className="text-danger">{errors.securityQuestion}</div>}
          </div>
          <div className="form-group col-md-6">
            <input
              type="text"
              name="securityAnswer"
              value={securityAnswer}
              onChange={changeHandler}
              placeholder="Enter your security answer"
              onFocus={() => clearErrorOnFocus("securityAnswer")}
              className="form-control rounded-pill"
            />
            {errors.securityAnswer && <div className="text-danger">{errors.securityAnswer}</div>}
          </div>
          <div className="form-group col-md-12">

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
            {errors.role && <div className="text-danger">{errors.role}</div>}
          </div>
          <div className="form-group col-md-12">

            <input type="submit" id='submit' className="btn btn-primary rounded-pill" value="Sign up" />
          </div>
        </form>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
export default SignUp;
