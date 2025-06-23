import React from 'react'
import "./Button.css";
const Button = ({ text, width,height,fontSize,marginTop,marginLeft ,display}) => {
  return (
    <button className="search-button" style={{ width: width , height: height,fontSize:fontSize,marginTop:marginTop,marginLeft:marginLeft ,display:display}}>
      {text}
    </button>
  );
};

export default Button;
