import React from "react";
import PlusIcon from "../images/Icons (8).png";

const Button = ({ icon, variant, text }) => {



  
  return (
    <>
    <button
      style={{
        backgroundColor: `${variant.color}`,
        borderRadius: `${variant.radius}`,
        color: "white",
        border: "none",
        minWidth: "100px",
        padding: `${variant.padding}`,
        margin: `${variant.margin}`,
      }}
      
      >
      {icon && <img src={PlusIcon} alt="Plus-Icon" style={{ width: "20px" }} />}
      {text}
    </button>    
    </>
  );
};

export default Button;
