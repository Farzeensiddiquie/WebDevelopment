import React from 'react'
import "./Footer.css"
import Logo from "../Logo/Logo"
export default function Footer() {
  return (
    


    <footer id='footer' className="footer">
      <div className="footer-container">
        <div className="footer-logo">
         <Logo/>
          <p className="footer-text">
            Neque, vestibulum sed varius magna <br/> et at. Eu, adipiscing morbi augue.
          </p>
          <div className="social-icons">
             <img src='/Images/facebook.png' className="fab fa-facebook"/>
             <img src='/Images/instagram.png' className="fab fa-instagram"/>
             <img src='/Images/Twitter.png' className="fab fa-twitter"/>
             <img src='/Images/youtube.png' className="fab fa-youtube"/>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Project</h3>
            <ul>
              <li>Houses</li>
              <li>Rooms</li>
              <li>Flats</li>
              <li>Apartments</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li>How we work?</li>
              <li>Capital</li>
              <li>Security</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Movement</h3>
            <ul>
              <li>Who are we</li>
              <li>Support us</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Help</h3>
            <ul>
              <li>Privacy</li>
              <li>Condition</li>
              <li>Blog</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright ©FarzeenSiddiqui, 2022. All rights reserved.</p>
        <p>Developed by: <a href='#footer'>FarzeenSiddiqui</a></p>
      </div>
    </footer>
  );
};


