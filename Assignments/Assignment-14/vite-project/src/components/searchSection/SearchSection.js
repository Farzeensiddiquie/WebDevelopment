import React from 'react'
import img from '../../assets/searchSection-profile-icon.png'
import './SearchSection.css'
import img2 from '../../assets/camera.png'
import img3 from '../../assets/library.png'
import img4 from '../../assets/smile.png'
export default function SearchSection() {
  return (
    <div className='SearchSectionContainer'>
      <div className='searchSection'>
        <img src={img} alt='img'/>
        <div className='searchSectionInput'>
        <input name='search' className='search' type='text' placeholder="What's on your mind, Farzeen?" />
        </div>
      </div>
      <div className='searchSectionIcons'>
        <div className='searchSectionIcon'>
          <img className='search-icon' src={img2} alt='img'/>
          <p className='searchSection-p'>Live Video</p>
        </div>
        <div className='searchSectionIcon'>
          <img className='search-icon' src={img3} alt='img'/>
          <p className='searchSection-p'>Photo/video</p>
          </div>
        <div className='searchSectionIcon'>
          <img className='search-icon' src={img4} alt='img'/>
          <p className='searchSection-p'>Feeling/activity</p>
          </div>

      </div>
    </div>
  )
}
