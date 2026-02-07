import { Environment, Sphere } from '@react-three/drei'
import { Gradient, LayerMaterial } from 'lamina'
import * as THREE from 'three'
import React from 'react'

const Background = () => {

  const colorA = "#640c74";
  const colorB = "#bca71c"
  const start= 0.2;
  const end = -0.5;
    return (
    <>

    <Sphere scale={[500,500,500]} rotation-y={Math.PI / 2} >
    <LayerMaterial 
    side={THREE.BackSide}
    >
      <Gradient
      colorA={colorA}
      colorB={colorB}
      axes={'y'}
      start={start}
      end={end}
      />

    </LayerMaterial>
    </Sphere>
    <Environment resolution={256}>
    <Sphere scale={[100,100,100]} rotation-y={Math.PI / 2} rotation-x={Math.PI} >
    <LayerMaterial 
    side={THREE.BackSide}
    >
      <Gradient
      colorA={colorA}
      colorB={colorB}
      axes={'y'}
      start={start}
      end={end}
      />

    </LayerMaterial>
    </Sphere>
    </Environment>
    </>
  )
}

export default Background