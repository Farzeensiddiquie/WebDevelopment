import React from "react";
import { Residensecards } from "../../Components/Residense-constants/constants";
import "./Residense.css";
import { ArrowButton } from "../Arrow-btn/ArrowButton";

export default function Residense() {
  return (
    <div className="residense-list">
      <ArrowButton marginRight="30px" marginTop="110px" text="&#x276E;" />

      {Residensecards.map((item) => ( 
        <div key={item.id || item.text} className="residense-item"> 
          <img src={item.img} className="Residence-img" alt={item.text} />
          <h4 className="Residense-h4">{item.text}</h4>
          <p className="Residense-p">{item.description}</p>
          <div className="vector">
            <img src={item.vector1} className="Residence-vector" alt={item.text} />
            <p className="vector-p">{item.vectordesc1}</p>
            <img src={item.vector2} className="Residence-vector bath" alt={item.text} />
            <p className="vector-p">{item.vectordesc2}</p>
            <img src={item.vector3} className="Residence-vector square" alt={item.text} />
            <p className="vector-p">{item.vectordesc3}</p>
          </div>
        </div>
      ))}

      <ArrowButton marginLeft="30px" marginTop="110px" text="&#x276F;" />
    </div>
  );
}

