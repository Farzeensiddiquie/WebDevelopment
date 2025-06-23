import React from 'react'
import img1 from '../../assets/info1-img.png'
import img2 from '../../assets/info2-img.png'
import searchbtn from '../../assets/search-btn.svg'
import contactsMenu from '../../assets/contactsmenu.svg'
import contactimg from '../../assets/contact-img.png'
import './RightSideBar.css'
export default function RightSideBar() {
  return (
    <div className='RightSidebar'>
      <div className='RightSidebarContent'>
       <div className='sponsored'>
        <p className='sponsored-h'>Sponsored</p>
        <div className='info1'>
          <img style={{width:'113px',height:'61px'}} src={img1} alt='img' className='info1-img'/>
          <span className='info-details'>
            <p className='info'>Modern Prop Trading</p>
          <p className='domain'>ftmo.com</p>
          </span>
        </div>
        <div className='info2'>
        <img src={img2} alt='img' className='info2-img'/>
        <span className='info-details'>
        <p className='info'>RS4,999 | The Wave <br/>Pro Ear Buds represent the next generation...</p>
        <p className='domain'>zerolifestyle.co</p>
        </span>
        </div>
       </div>
       <div className='contacts'>
        < div className='contacts-searchMenu'>
          <p className='contacts-h'>Contacts</p>
        <div className='contacts-search'><img src={searchbtn} alt="Search" />
        <img  src={contactsMenu} alt="Search" /></div>
        </div>
        <div className='contact'>
        <img src={contactimg} alt="Search" />
        <p className='contactInfo'>Masna Siddiqui</p>
        </div>
       </div>
       <div className='groupChats'></div>
      </div>
    </div>
  )
}
 