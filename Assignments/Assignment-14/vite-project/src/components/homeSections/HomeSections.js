import React from 'react'
import MiddleSection from '../middleSection/MiddleSection'
import LeftSideBar from '../leftSidebar/LeftSideBar'
import RightSideBar from '../rightSidebar/RightSideBar'
import './HomeSections.css'
export default function HomeSections() {
  return (
    <div className='Home-section'>
      <LeftSideBar/>
      <MiddleSection/>
      <RightSideBar/>
    </div>
  )
}
