import { auth, db } from "../../config/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaChartLine, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import './Navbar.css';

function Navbar() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserDetails = async (user) => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserDetails(user);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="navbar-loading">
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <button 
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <Link to="/home" className="navbar-logo">
              <span className="logo-text">Spark</span>
            </Link>
          </div>

          <div className="navbar-desktop">
            <div className="navbar-links">
              <Link to="/home" className="navbar-link">
                <FaHome />
                <span>Home</span>
              </Link>
              <Link to="/dashboard" className="navbar-link">
                <FaChartLine />
                <span>Dashboard</span>
              </Link>
            </div>

            <div 
              className="navbar-user" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="user-avatar">
                {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="dropdown-info">
                      <h4>{userDetails?.name || 'User'}</h4>
                      <p>{userDetails?.email || ''}</p>
                    </div>
                  </div>
                  <div className="dropdown-links">
                    <Link to="/profile" className="dropdown-link">
                      <FaUser /> My Profile
                    </Link>
                    <Link to="/settings" className="dropdown-link">
                      <FaCog /> Settings
                    </Link>
                    <button onClick={handleLogout} className="dropdown-link logout">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="user-avatar">
              {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <h4>{userDetails?.name || 'User'}</h4>
              <p>{userDetails?.email || ''}</p>
            </div>
          </div>
        </div>
        
        <div className="sidebar-links">
          <Link to="/home" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
            <FaHome /> Home
          </Link>
          <Link to="/dashboard" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
            <FaChartLine /> Dashboard
          </Link>
          <Link to="/profile" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
            <FaUser /> Profile
          </Link>
          <Link to="/settings" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
            <FaCog /> Settings
          </Link>
          <button onClick={() => {
            handleLogout();
            setMobileMenuOpen(false);
          }} className="sidebar-link logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}

export default Navbar;