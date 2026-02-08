import { useProgress } from '@react-three/drei'
import React from 'react'
import { usePlay } from '../context/Play'

const OverLay = () => {

  const {progress} = useProgress()
  const {play, setPlay,end, hasScroll} = usePlay()

  return (
    <div className={`overlay ${play ? "overlay--disable": ""} ${hasScroll ? "overlay--scrolled": ""} `}  >
      <div className={`loader ${progress === 100 ? "loader--disappear": ""}`}/>
      {
        progress === 100  && (
        <div className={`intro ${play ? "intro--disappear" : ""}`}>
        <h1 className='logo'>WAWATMOS
          <div className="spinner">
            <div className="spinner_image"/>
          </div>
        </h1>
        <p className='intro__scroll'>Scroll to begin the journey</p>
        <button className='explore'
        onClick={()=>{
          setPlay(true);
        }}
        >
          Explore
        </button>
      </div>)
      }   
      <div className={`outro ${end ? "outro--appear": ""}`}>
        <p className='outro__text'>
          Wish you had a great flight with us...
        </p>
        </div>   
    </div>
  )
}

export default OverLay