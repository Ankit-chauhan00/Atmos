import { Float, OrbitControls, PerspectiveCamera, useScroll } from '@react-three/drei'
import React, { useMemo, useRef } from 'react'
import Background from './Background'
import { Airplane } from './Airplane'
import { Cloud } from './Cloud'
import  * as THREE  from 'three';
import { useFrame } from '@react-three/fiber'

const LINE_NB_POINTS = 2000;

const Experience = () => {

  const curve = useMemo(()=>{
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,-10),
      new THREE.Vector3(-2,0,-20),
      new THREE.Vector3(-3,0,-30),
      new THREE.Vector3(0,0,-40),
      new THREE.Vector3(5,0,-50),
      new THREE.Vector3(7,0,-60),
      new THREE.Vector3(5,0,-70),
      new THREE.Vector3(0,0,-80),
      new THREE.Vector3(0,0,-90),
      new THREE.Vector3(0,0,-100),
    ],false,"catmullrom",0.5)
  })

  const shape = useMemo (()=>{
    const shape = new THREE.Shape();
    shape.moveTo(0,-0.2);
    shape.lineTo(0,0.2);

    return shape;
  },[curve])

  const linePoints = useMemo(()=>{
    return curve.getPoints(LINE_NB_POINTS);
  },[curve]);

  const cameraRef = useRef();
  const scroll = useScroll();
  const airplane = useRef();

  useFrame((_state,delta)=>{
    
    const curPointIndex = Math.min(
      Math.round(scroll.offset * linePoints.length), linePoints.length - 1
    )
    const curPoint = linePoints[curPointIndex];
    const pointAhead =  linePoints[Math.min(curPointIndex+1, linePoints.length)]

    const xDisplacement = (pointAhead.x - curPoint.x) * 80;

    const angleRotation = (xDisplacement < 0 ? 1: -1)*
    Math.min(Math.abs(xDisplacement),Math.PI / 3);

    const targetAirplaneQuaterion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angleRotation,

      )
    )

    airplane.current.quaternion.slerp(targetAirplaneQuaterion, delta * 2)

    cameraRef.current.position.lerp(curPoint,delta * 24)
  })

  


  return (
    <>
    

    <group ref={cameraRef} >
    <Background/>
    <PerspectiveCamera position={[0,0,5]} fov={30}  makeDefault />
    <group ref={airplane} >
    <Float floatIntensity={2}  speed={2} >
    <Airplane rotation-y={Math.PI / 2} scale={[0.2,0.2,0.2]} position-y={0.1} />
    </Float>
    </group>
    </group>

    <group position-y={-2} >
    <mesh>
      <extrudeGeometry args={[
        shape,
        {
          steps: LINE_NB_POINTS,
          bevelEnabled: false,
          extrudePath: curve,
        }
      ]} />

      <meshStandardMaterial color={"white"} opacity={0.7} transparent />
    </mesh>
    </group>

    <Cloud opacity={0.7} scale={[0.3,0.3, 0.4]} position={[-3,1,-3]} />
    <Cloud opacity={0.7} scale={[0.3,0.3, 0.4]} position={[3.5,-0.5,-2]} />
    <Cloud opacity={0.7} scale={[0.3,0.3, 0.4]} rotation-y={Math.PI / 9} position={[2,1,-20]}/>
    <Cloud opacity={0.7} scale={[0.4,0.4, 0.4]} rotation-y={Math.PI / 9} position={[1,-0.2,-12]}/>
    <Cloud opacity={0.7} scale={[0.4,0.4, 0.4]} rotation-y={Math.PI / 9} position={[-4,-0.2,-12]}/>
    </>
  )
}

export default Experience