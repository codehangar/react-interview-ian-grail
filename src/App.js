import React from 'react';
import { useSpring, animated } from 'react-spring';


export default function App() {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  return (
    <animated.div style={props}>
      Code Hangar React Interview
    </animated.div>
  );
}
