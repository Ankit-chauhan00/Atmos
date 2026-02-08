import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from './components/Experience'
import { ScrollControls } from '@react-three/drei'
import OverLay from './components/OverLay'
import { usePlay } from './context/Play'

const App = () => {
  const {play, end} = usePlay()
  return (
    <>
    <Canvas>
      <color attach="background" />
      <ScrollControls pages={play && !end ? 50: 0} damping={0.5} >
      <Experience/>
      </ScrollControls>
    </Canvas>
    <OverLay/>
    </>
  )
}

export default App