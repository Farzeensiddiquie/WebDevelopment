import React from 'react'
import './MiddleSection.css'
import SearchSection from '../searchSection/SearchSection'
import StorySection from '../storySection/StorySection'
import Products from '../products/Products'
export default function MiddleSection() {
  return (
    <div className='MiddleSection'>
      <SearchSection/>
      <StorySection/>
      <Products/>
    </div>
  )
}
 