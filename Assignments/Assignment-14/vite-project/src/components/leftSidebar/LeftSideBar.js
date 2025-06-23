import React from 'react'
import './LeftSidebar.css'
import shortcut from '../../assets/shortcut.png'
import SideBarLinks from '../sidebarLinks/SideBarLinks'
export default function LeftSideBar() {
  return (
    <div className='left-sidebar'>
      <div className='leftsidebarContent'>
        <SideBarLinks />
        <div className='sidebar-shortcuts-title'>
          <p>Your shortcuts</p>
          </div>
    <div className='sidebar-shortcuts'>
      <img src={shortcut} alt='img' className='shortcut-icon'/>
      <h4>8 Ball Pool</h4>
    </div>
    <div className='sidebar-copyright-links'>
      <p className='copyrightlinks'>Privacy  · Terms  · Advertising  · Ad Choices  <br/>Cookies  · More  · Meta © 2025</p>
    </div>
    </div>
    </div>
  ) 
}
