import React from 'react';

export default function Input({ type, name, placeholder, value, onChange, className = '' }) {
  return (
    <input
      type={type}
      name={name}
      className={`form-input ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      data-form-input
    />
  );
}