// Original: https://codesandbox.io/embed/r5qmj8m6lq
import React, { useRef, useState } from 'react';
import clamp from 'lodash-es/clamp';
import isEqual from 'lodash-es/isEqual';
import swap from 'lodash-move';
import { useGesture } from 'react-with-gesture';
import { useSprings, animated, interpolate } from 'react-spring';

// Returns fitting styles for dragged/idle items
const getItemStyles = (order, down, originalIndex, curIndex, y) => index => {
  return down && index === originalIndex // if mouse down and current item
    ? { y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }
    : { y: order.indexOf(index) * 100, scale: 1, zIndex: '0', shadow: 1, immediate: false };
};


export default function app(props) {
  const { items } = props;
  const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings(items.length, getItemStyles(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const [itemOrder, setItemOrder] = useState(null);
  const correctOrder = [2, 1, 0, 3];

  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    try {
      const curIndex = order.current.indexOf(originalIndex);
      const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1);
      const newOrder = swap(order.current, curIndex, curRow);
      setSprings(getItemStyles(newOrder, down, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
      if (!down) {
        setItemOrder(newOrder);
        return order.current = !newOrder;
      }
    } catch (error) {
      setItemOrder(correctOrder);
      console.error('Hello there! Congrats for finding this error! If you are excited to continue the React Developer interview process with Code Hangar, email us at devs@codehangar.io with the subject line "React Developer Interview" to request your next steps. Include your github username and a brief description of the error you encountered in this web app.'); // eslint-disable-line no-console
    }
  });

  return (
    <div style={styles.container}>
      <div style={{ ...styles.list, height: items.length * 100 }} className="content">
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={i}
            style={{
              ...styles.item,
              zIndex,
              boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
              transform: interpolate([y, scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`),
            }}
            children={items[i]}
          />
        ))}
      </div>
      {isEqual(itemOrder, correctOrder) && (
        <span style={{color: 'white' }}>Oops! Looks like something went wrong...</span>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    position: 'relative',
    width: 320,
    height: 240,
  },
  item: {
    position: 'absolute',
    width: 320,
    height: 90,
    overflow: 'visible',
    pointerEvents: 'auto',
    transformOrigin: '50% 50% 0px',
    borderRadius: 5,
    color: '#FFF',
    fontWeight: 600,
    lineHeight: '90px',
    fontSize: 14.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 2,
  },
};
