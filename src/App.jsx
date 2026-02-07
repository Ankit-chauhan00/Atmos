import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from './components/Experience'
import { ScrollControls } from '@react-three/drei'

const App = () => {
  return (
    <>
    <Canvas>
      <color attach="background" args={["#ececec"]} />
      <ScrollControls pages={30} damping={0.5} >
      <Experience/>
      </ScrollControls>
    </Canvas>
    </>
  )
}

export default App