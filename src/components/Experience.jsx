import { Float, OrbitControls } from '@react-three/drei'
import React from 'react'
import Background from './Background'
import { Airplane } from './Airplane'
import { Cloud } from './Cloud'

const Experience = () => {
  return (
    <>
    <OrbitControls/>
    <Background/>
    <Float floatIntensity={2}  speed={2} >
    <Airplane rotation-y={Math.PI / 2} scale={[0.2,0.2,0.2]} position-y={0.1} />
    </Float>

    <Cloud opacity={0.7} scale={[0.3,0.3, 0.4]} position={[-3,1,-3]} />
    <Cloud opacity={0.7} scale={[0.3,0.3, 0.4]} position={[3.5,-0.5,-2]} />
    <Cloud opacity={0.7} scale={[0.3,0.3, 0.4]} rotation-y={Math.PI / 9} position={[2,1,-20]}/>
    <Cloud opacity={0.7} scale={[0.4,0.4, 0.4]} rotation-y={Math.PI / 9} position={[1,-0.2,-12]}/>
    <Cloud opacity={0.7} scale={[0.4,0.4, 0.4]} rotation-y={Math.PI / 9} position={[-4,-0.2,-12]}/>
    </>
  )
}

export default Experience