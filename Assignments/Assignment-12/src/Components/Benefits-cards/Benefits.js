import React from "react";
import {BenefitsConstants} from "../../Components/Benefits-constants/Benefits-Constants";
import "./Benefits.css";
export default function Benefits() {
  return (
    <div className="Benefits-list">
      <div className="Benefits-section">
      {BenefitsConstants.map((item, index) => (
        <div key={index} className="Benefits-item">
          <img src={item.icon} className="Benefits-icon" alt={item.text} />
          <h4 className="Benefits-h4">{item.text}</h4>
          <p className="Benefits-p">{item.description}</p>
        </div>

      ))}
      </div>
    </div>
  );
}
