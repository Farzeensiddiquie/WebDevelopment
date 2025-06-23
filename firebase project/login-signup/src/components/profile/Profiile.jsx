import { useState, useRef, useEffect } from 'react';
import "./Profile.css";
const Profile = ({ userDetails }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar-user" ref={dropdownRef}>
      <div 
        className="profile-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="profile-avatar">
          {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
      
      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="dropdown-userinfo">
              <h4>{userDetails?.name || 'User'}</h4>
              <p>{userDetails?.email || 'No email'}</p>
            </div>
          </div>
          
          <div className="dropdown-details">
            {userDetails?.joinDate && (
              <div className="detail-row">
                <span>Member since:</span>
                <span>
                  {new Date(userDetails.joinDate.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span>Account status:</span>
              <span className="status-active">Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;