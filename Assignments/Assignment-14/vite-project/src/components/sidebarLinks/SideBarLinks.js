import React from 'react'
import icon1 from '../../assets/profile-link-icon.png'
import icon2 from '../../assets/freinds-link-icon.png'
import icon3 from '../../assets/memories-icon.png'
import icon4 from '../../assets/saved-icon.png'
import icon5 from '../../assets/groups-link-icon.png'
import icon6 from '../../assets/video-link-icon.png'
import icon7 from '../../assets/marketplace-icon.png'
import icon8 from '../../assets/feeds-icon.png'
import icon9 from '../../assets/Events-icon.png'
import icon10 from '../../assets/adsManager-icon.png'
import icon11 from '../../assets/seeMore-icon.png'
import './SideBarLinks.css'
const  SideBarLinks = () => {
const Links = [
  { name: 'Farzeen Wasif', icon: icon1 },
  { name: 'Freinds', icon: icon2 },
  { name: 'Memories', icon: icon3 },
  { name: 'Saved', icon: icon4 },
  { name: 'Groups ', icon: icon5 },
  { name: 'Videos', icon: icon6},
  { name: 'Marketplace', icon: icon7 },
  { name: 'Feeds', icon: icon8 },
  { name: 'Events', icon: icon9 },
  { name: 'Add Manager', icon: icon10 },
  { name: 'See More', icon: icon11 },
]

    return (
    
        <div className='sidebar-links'>
            {Links.map((link, index) => (
            <div key={index} className='sidebar-link'>
                <img className='sidebar-icon' alt='img' src={link.icon}/>
                <span className='sidebar-name'>{link.name}</span>
            </div>
            ))}
        
        </div>

  )
}

export default SideBarLinks
