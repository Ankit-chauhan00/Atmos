/* eslint-disable react-hooks/exhaustive-deps */
import { Float, OrbitControls, PerspectiveCamera, useScroll } from '@react-three/drei'
import React, { useLayoutEffect, useMemo, useRef } from 'react'
import Background from './Background'
import { Airplane } from './Airplane'
import { Cloud } from './Cloud'
import  * as THREE  from 'three';
import { useFrame } from '@react-three/fiber'
import Textsection from './Textsection'
import { MathUtils } from 'three';
import gsap from 'gsap/all'

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
    shape.moveTo(0,-0.1);
    shape.lineTo(0,0.1);

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

    tl.current.seek(lerpedScrollOffset * tl.current.duration());
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

  const tl = useRef();
  const backgroundColors  = useRef({
    colorA: "#3535cc",
    colorB: "#abaadd",
  })

  const colorSets = [
  { colorA: "#001da0", colorB: "#349942" }, // deep blue-gray
  { colorA: "#3a2f3d", colorB: "#5a4b60" }, // dusty purple
  { colorA: "#bdb717", colorB: "#51346a" }, // cold steel
  { colorA: "#3b3a36", colorB: "#5c5a54" }, // warm concrete
  { colorA: "#d6701d", colorB: "#7d183f" }, // night fog
  { colorA: "#3d3a44", colorB: "#5b5763" }, // soft violet gray
  { colorA: "#2f3430", colorB: "#4d554f" }, // moss shadow
  { colorA: "#383838", colorB: "#555555" }, // neutral studio gray
  { colorA: "#332f2e", colorB: "#544f4b" }, // muted earth
  { colorA: "#263238", colorB: "#455a64" }, // calm slate
];
  
  useLayoutEffect(()=>{
    tl.current = gsap.timeline();

  colorSets.forEach(({ colorA, colorB }) => {
  tl.current.to(backgroundColors.current, {
    duration: 1,
    ease: "power2.inOut",
    colorA,
    colorB,
  });
});

    tl.current. pause()
  },[])

  const clouds = useMemo(
    () => [
      // STARTING
      {
        position: new THREE.Vector3(-3.5, -3.2, -7),
      },
      {
        position: new THREE.Vector3(3.5, -4, -10),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(-18, 0.2, -68),
        rotation: new THREE.Euler(-Math.PI / 5, Math.PI / 6, 0),
      },
      {
        scale: new THREE.Vector3(2.5, 2.5, 2.5),
        position: new THREE.Vector3(10, -1.2, -52),
      },
      // FIRST POINT
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[1].x + 10,
          curvePoints[1].y - 4,
          curvePoints[1].z + 64
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[1].x - 20,
          curvePoints[1].y + 4,
          curvePoints[1].z + 28
        ),
        rotation: new THREE.Euler(0, Math.PI / 7, 0),
      },
      {
        rotation: new THREE.Euler(0, Math.PI / 7, Math.PI / 5),
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x - 13,
          curvePoints[1].y + 4,
          curvePoints[1].z - 62
        ),
      },
      {
        rotation: new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x + 54,
          curvePoints[1].y + 2,
          curvePoints[1].z - 82
        ),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x + 8,
          curvePoints[1].y - 14,
          curvePoints[1].z - 22
        ),
      },
      // SECOND POINT
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[2].x + 6,
          curvePoints[2].y - 7,
          curvePoints[2].z + 50
        ),
      },
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[2].x - 2,
          curvePoints[2].y + 4,
          curvePoints[2].z - 26
        ),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[2].x + 12,
          curvePoints[2].y + 1,
          curvePoints[2].z - 86
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 3),
      },
      // THIRD POINT
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[3].x + 3,
          curvePoints[3].y - 10,
          curvePoints[3].z + 50
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[3].x - 10,
          curvePoints[3].y,
          curvePoints[3].z + 30
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y - 5,
          curvePoints[3].z - 8
        ),
        rotation: new THREE.Euler(Math.PI, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[3].x + 0,
          curvePoints[3].y - 5,
          curvePoints[3].z - 98
        ),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
      },
      // FOURTH POINT
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[4].x + 3,
          curvePoints[4].y - 10,
          curvePoints[4].z + 2
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x + 24,
          curvePoints[4].y - 6,
          curvePoints[4].z - 42
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x - 4,
          curvePoints[4].y + 9,
          curvePoints[4].z - 62
        ),
        rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      // FINAL
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[7].x + 12,
          curvePoints[7].y - 5,
          curvePoints[7].z + 60
        ),
        rotation: new THREE.Euler(-Math.PI / 4, -Math.PI / 6, 0),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[7].x - 12,
          curvePoints[7].y + 5,
          curvePoints[7].z + 120
        ),
        rotation: new THREE.Euler(Math.PI / 4, Math.PI / 6, 0),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[7].x,
          curvePoints[7].y,
          curvePoints[7].z
        ),
        rotation: new THREE.Euler(0, 0, 0),
      },
    ],
    []
  );
  


  return (
    <>
    <directionalLight position={[0,3,1]} intensity={0.1} />
    

    <group ref={cameraRef} >
    <Background backgroundColors={backgroundColors}/>
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

    {
      clouds.map((cloud,index)=>(
        <Cloud {...cloud} key={index} />
      ))
    }
    </>
  )
}

export default Experience