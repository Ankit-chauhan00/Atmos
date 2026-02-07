/* eslint-disable react-hooks/exhaustive-deps */
import { Float, OrbitControls, PerspectiveCamera, useScroll } from '@react-three/drei'
import React, { useMemo, useRef } from 'react'
import Background from './Background'
import { Airplane } from './Airplane'
import { Cloud } from './Cloud'
import  * as THREE  from 'three';
import { useFrame } from '@react-three/fiber'
import Textsection from './Textsection'
import { MathUtils } from 'three';

const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 42;

const Experience = () => {

  const curvePoints =  useMemo(()=>[
    new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
  ],[])

  const curve = useMemo(()=>{
    return new THREE.CatmullRomCurve3(curvePoints,false,"catmullrom",0.5)
  })

  const shape = useMemo (()=>{
    const shape = new THREE.Shape();
    shape.moveTo(0,-0.8);
    shape.lineTo(0,0.8);

    return shape;
  },[curve])

   const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new  THREE.Vector3(
          curvePoints[1].x - 3,
          curvePoints[1].y,
          curvePoints[1].z
        ),
        subtitle: `Welcome to Wawatmos,
Have a seat and enjoy the ride!`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[2].x + 2,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        title: "Services",
        subtitle: `Do you want a drink?
We have a wide range of beverages!`,
      },
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(
          curvePoints[3].x - 3,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        title: "Fear of flying?",
        subtitle: `Our flight attendants will help you have a great journey`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[4].x + 3.5,
          curvePoints[4].y,
          curvePoints[4].z - 12
        ),
        title: "Movies",
        subtitle: `We provide a large selection of medias, we highly recommend you Porco Rosso during the flight`,
      },
    ];
  }, []);



  const cameraRef = useRef();
  const scroll = useScroll();
  const airplane = useRef();
  const cameraRail = useRef();
  const lastScroll = useRef(0)

  useFrame((_state,delta)=>{

    const scrollOffset = Math.max(0, scroll.offset);
    

    let friction = 1;
    let resetCameraRail = true;

    // Look to close text Section
    textSections.forEach((textsection)=>{
      const distance = textsection.position.distanceTo(cameraRef.current.position);

      if(distance < FRICTION_DISTANCE){
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new THREE.Vector3(
          (1 - distance / FRICTION_DISTANCE) * textsection.cameraRailDist,
          0,
          0,
        )

        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    })

    if(resetCameraRail){
      const targetCameraRailPosition = new THREE.Vector3(0,0,0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    //Calculate Lerped scroll oFFset
    let lerpedScrollOffset = MathUtils.lerp(lastScroll.current, scrollOffset, delta * friction);

    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    const curPoint  = curve.getPoint(lerpedScrollOffset);

    cameraRef.current.position.lerp(curPoint,delta * 24)

    const lookAtPoint =  curve.getPoint(Math.min(scrollOffset + CURVE_AHEAD_CAMERA,1));

    const currentLookAt = cameraRef.current.getWorldDirection(
      new THREE.Vector3()
    );

    const targetLookAt = new THREE.Vector3()
    .subVectors(curPoint, lookAtPoint)
    .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraRef.current.lookAt(
      cameraRef.current.position.clone().add(lookAt)
    )
    
   // Airplane Rotation
   const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE)

   const nonLerpLookAt = new THREE.Group();
   nonLerpLookAt.position.copy(curPoint);
   nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

   tangent.applyAxisAngle(
    new THREE.Vector3(0,1,0),
    -nonLerpLookAt.rotation.y
   )

   let angle = Math.atan2(-tangent.z, tangent.x);
   angle = -Math.PI /2 + angle;

   let angleDegrees = (angle * 180) / Math.PI;
   angleDegrees *= 2.3;

   if(angleDegrees < 0){
    angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE)
   }
   if(angleDegrees > 0){
    angleDegrees = Math.max(angleDegrees, AIRPLANE_MAX_ANGLE)
   }

   angle = (angleDegrees * Math.PI) / 180;

   const targetAirplaneQuaternion =  new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      airplane.current.rotation.x,
      airplane.current.rotation.y,
      angle
    )
   )
   airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta *2)

  })

  


  return (
    <>
    <directionalLight position={[0,3,1]} intensity={0.1} />
    

    <group ref={cameraRef} >
    <Background/>
    <group ref={cameraRail}>
    <PerspectiveCamera position={[0,0,5]} fov={30}  makeDefault />
    </group>
    <group ref={airplane} >
    <Float floatIntensity={2}  speed={2} >
    <Airplane rotation-y={Math.PI / 2} scale={[0.2,0.2,0.2]} position-y={0.1} />
    </Float>
    </group>
    </group>

    {/* Text */}
{
  textSections.map((section, index) => (
    <Textsection {...section} key={index} />
  ))
}

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

    <Cloud  scale={[1,1, 1]} position={[-5.5,-1.2,-7]} />
    <Cloud  scale={[1,1, 1]} position={[5.5,-1,-10]} rotation-y={Math.PI} />
    <Cloud  scale={[1,1,1]} rotation-y={Math.PI / 3} position={[-10.5,0.2,-42]}/>
    <Cloud  scale={[0.4,0.4, 0.4]} rotation-y={Math.PI / 9} position={[3,-0.2,-22]}/>
    <Cloud  scale={[0.5,0.5, 2]}  position={[-7,-0.5,-53]}/>
    <Cloud  scale={[0.5 ,0.5, 2]}  position={[4,-1.5,-100]}/>
    </>
  )
}

export default Experience