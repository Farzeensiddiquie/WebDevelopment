import React from 'react'
import './StorySection.css'
import img from '../../assets/storyimg.png'
export default function StorySection() {
  return (
    <div className='StorySectionContainer'>
      <div className='storySection'>
        <img src={img} alt='img'className='storyimg'/>
        <div className='storySectionText'>
<p className='storySectionHeading'>Create Story</p>
<p className='storySection-p'>Share a photo or write something.</p>
            </div>
      </div>
    </div>
  )
}
