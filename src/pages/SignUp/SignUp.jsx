import React, { useState } from "react";
import "./SignUp.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  const [selectedRole, setSelectedRole] = useState(null);

  const handleCheckboxChange = (event) => {
    setSelectedRole(event.target.value);
    console.log(event.target.value)
  };


  const { firstname, lastname, email, phone, password, confirmpassword } = data;

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Reset error when input changes
  };

  const clearErrorOnFocus = (fieldName) => {
    setErrors({ ...errors, [fieldName]: "" });
};

  const submitHandler = (e) => {
    e.preventDefault();
    let formValid = true;
    const newErrors = { ...errors };

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

    if (!selectedRole) {
      newErrors.role = "Please select a role";
      formValid = false;
    }

    if (!formValid) {
      setErrors(newErrors);
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
      role:selectedRole
    };
    console.log(formData)
    // Proceed with form submission if all fields are filled
    axios
      .post(
        "https://kiranreddy-58a8c-default-rtdb.firebaseio.com/register.json",
        formData
      )
      // .post('https://signuppage-2f4c8-default-rtdb.firebaseio.com/register.json', formData)
      .then(() => {
        toast.success("Your details Submitted Successfully." , {
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
          email: "",
          phone: "",
          password: "",
          confirmpassword: "",
        }); // Clear input fields after successful submission
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
    <div className="signup-page">
      <div className="signup-form">
        <form autoComplete="off" onSubmit={submitHandler}>
          <input
            type="text"
            name="firstname"
            value={firstname}
            onChange={changeHandler}
            placeholder="Enter Your FirstName"
            onFocus={() => clearErrorOnFocus("firstname")}
          />
          <br />
          {errors.firstname && <div className="error">{errors.firstname}</div>}
          <input
            type="text"
            name="lastname"
            value={lastname}
            onChange={changeHandler}
            placeholder="Enter Your LastName"
            onFocus={() => clearErrorOnFocus("lastname")}
          />
          <br />
          {errors.lastname && <div className="error">{errors.lastname}</div>}
          <input
            type="email"
            name="email"
            value={email}
            onChange={changeHandler}
            placeholder="Enter Your Email"
            onFocus={() => clearErrorOnFocus("email")}
          />
          <br />
          {errors.email && <div className="error">{errors.email}</div>}
          <input
            type="tel" // corrected from 'phone'
            name="phone"
            value={phone}
            onChange={changeHandler}
            placeholder="Mobile number"
            onFocus={() => clearErrorOnFocus("phone")}
          />
          <br />
          {errors.phone && <div className="error">{errors.phone}</div>}
          <input
            type="password"
            name="password"
            value={password}
            onChange={changeHandler}
            placeholder="Enter Your Password"
            onFocus={() => clearErrorOnFocus("password")}
          />
          <br />
          {errors.password && <div className="error">{errors.password}</div>}

          <input
            type="password"
            name="confirmpassword"
            value={confirmpassword}
            onChange={changeHandler}
            placeholder="Confirm Your Password"
            onFocus={() => clearErrorOnFocus("confirmpassword")}
          />
          <br />
          {errors.confirmpassword && (
            <div className="error">{errors.confirmpassword}</div>
          )}
          <label className="loginText">Register As:</label>
          <div className="confirmationContainer">
            <div className="checkBoxTextContainer">
              <input
                name="role"
                type="checkbox"
                id="admin"
                value="admin"
                checked={selectedRole === "admin"}
                onChange={handleCheckboxChange}
                className="checkbox"
                onFocus={() => clearErrorOnFocus("role")}
              />
              <label className="checkBoxText" htmlFor="admin">
                Admin
              </label>
            </div>
            <div className="checkBoxTextContainer">
              <input
                name="role"
                type="checkbox"
                id="subAdmin"
                value="subAdmin"
                checked={selectedRole === "subAdmin"}
                onChange={handleCheckboxChange}
                className="checkbox"
                onFocus={() => clearErrorOnFocus("role")}
              />
              <label className="checkBoxText" htmlFor="subAdmin">
                Subadmin
              </label>
            </div>
          </div>
          {errors.role && <div className="error">{errors.role}</div>}
          <input type="submit" className="Signup" value="Sign up" />
        </form>
        <p>
          Already have an account <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
