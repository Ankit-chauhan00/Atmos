import React from 'react'
import { Text } from '@react-three/drei'
const Textsection = ({title, subtitle, ...props}) => {
  return (
       <group {...props}>
      {!!title && (
        <Text
          color="white"
          anchorX={"left"}
          anchorY="bottom"
          fontSize={0.52}
          maxWidth={2.5}
          lineHeight={1}
          font={"/fonts/limelight.ttf"}
        >
          {title}
        </Text>
      )}

      <Text
        color="white"
        anchorX={"left"}
        anchorY="top"
        fontSize={0.2}
        maxWidth={2.5}
        font={"/fonts/limelight.ttf"}
      >
        {subtitle}
      </Text>
    </group>
  )
}

export default Textsection