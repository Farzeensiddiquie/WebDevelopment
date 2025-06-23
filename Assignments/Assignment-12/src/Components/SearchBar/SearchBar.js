import React from 'react'
import '../SearchBar/SearchBar.css'
import Button from '../Button/Button.js'
const SearchBar = ({margintop})  => {
  return (
    <div className="search-container" style={{marginTop:margintop}}>
    <div className="dropdown">
        <label htmlFor="purpose">Purpose</label>
        <select id="purpose">
            <option defaultValue="buy" >Buy</option>
            <option value="rent">Rent</option>
            <option value="rent">Sell</option>
        </select>
    </div>

    <div className="dropdown">
        <label htmlFor="location">Location</label>
        <select id="location">
            <option defaultValue="toronto" >Toronto, Canada</option>
            <option value="vancouver">Vancouver, Canada</option>
            <option value="newyork">New York, USA</option>
        </select>
    </div>

    <div className="dropdown dropdown-3">
        <label htmlFor="type">Type</label>
        <select id="type">
            <option defaultValue="industrial" >Industrial Home</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
        </select>
    </div>

    <Button width="100px" text="Search" fontSize="18px"/>
</div>

  )}
export default SearchBar;
