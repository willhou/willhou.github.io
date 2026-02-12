"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const DIGIT_HEIGHT = 1.2; // em — must match .digit-number height

function Digit({ value }: { value: number }) {
  const style = useSpring({
    y: -(9 - value) * DIGIT_HEIGHT,
    config: { tension: 150, friction: 22 },
  });

  return (
    <span className="digit-slot">
      <animated.span
        className="digit-column"
        style={{
          transform: style.y.to((y) => `translateY(${y}em)`),
        }}
      >
        {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((n) => (
          <span key={n} className="digit-number">
            {n}
          </span>
        ))}
      </animated.span>
    </span>
  );
}

interface AnimatedNumberProps {
  value: number;
}

export default function AnimatedNumber({ value }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const targetRef = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    targetRef.current = value;

    // Step through intermediate years
    const step = () => {
      setDisplayValue((prev) => {
        const target = targetRef.current;
        if (prev === target) return prev;
        const dir = target > prev ? 1 : -1;
        const next = prev + dir;

        // Schedule next step if not at target
        if (next !== target) {
          timerRef.current = setTimeout(step, 80);
        }

        return next;
      });
    };

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(step, 80);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  const digits = String(displayValue).split("").map(Number);

  return (
    <span className="animated-number">
      {digits.map((digit, i) => (
        <Digit key={i} value={digit} />
      ))}
    </span>
  );
}
