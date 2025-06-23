import './Navbar.css';
import menu from '../../assets/menu.png';
import messenger from '../../assets/messenger.png';
import notifications from '../../assets/notifications.png';
import profile from '../../assets/profile-icon.png';
import facebooklogo from '../../assets/facebook-logo.png';
import searchbtn from '../../assets/search-btn.svg';
import Navlinks from '../navlinks/Navlinks.js';
export default function Navbar() {
  return (
    <nav className="fb-navbar">
      <div className="fb-left">
        <img src={facebooklogo} alt="Logo" className="fb-logo" />
        <div className='fb-search'>
        <span className="fb-search-icon">
    <img src={searchbtn} alt="Search" />
  
        </span>
        <input type="text" name='search' id='search' placeholder="Search Facebook" className="fb-search-input" />
      </div>
      </div>
     
 <Navlinks/>
      <div className="fb-right">
        <div className="fb-icon-right">
          <img src={menu}alt="Menu" />
        </div>
        <div className="fb-icon-right">
          <img src={messenger} alt="Messenger" />
        </div>
        <div className="fb-icon-right">
          <img src={notifications} alt="Notifications" />
        </div>
        <div className="fb-icon-right fb-profile-icon">
          <img src={profile} alt="Profile" />
        </div>
      </div>
    </nav>
  );
}
