import React from 'react'
import './ArrowButton.css'
const ArrowButton=({text,marginTop,marginRight,marginleft})=>{
  return (
    <button  className="arrow-button" style={{marginTop:marginTop, marginRight:marginRight,marginLeft:marginleft}}>
      {text}
    </button>
  )
}
export {ArrowButton};