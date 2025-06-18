"use client";

import { useEffect, useState } from "react";
import { Box, keyframes } from "@mui/system";

// number of salamanders on screen
const COUNT = 150;

// helper: generate a random integer between min and max
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function SalamanderSwarm() {
  const [critters, setCritters] = useState([]);

  useEffect(() => {
    // on mount, seed our salamanders with random positions/durations
    const arr = Array.from({ length: COUNT }).map((_, i) => {
      const size = rand(30, 60);         // px
      const x0 = rand(0, 100);           // vw
      const y0 = rand(0, 100);           // vh
      const dx = rand(-20, 20);          // drift in vw
      const dy = rand(-20, 20);          // drift in vh
      const duration = rand(20, 40);     // seconds
      const delay = rand(0, 10);         // seconds
      return { id: i, size, x0, y0, dx, dy, duration, delay };
    });
    setCritters(arr);
  }, []);

  return (
    <>
      {critters.map(c => {
        // define keyframe for this critter
        const drift = keyframes`
          0%   { transform: translate(${c.x0}vw, ${c.y0}vh) rotate(0deg); }
          50%  { transform: translate(${c.x0 + c.dx}vw, ${c.y0 + c.dy}vh) rotate(180deg); }
          100% { transform: translate(${c.x0}vw, ${c.y0}vh) rotate(360deg); }
        `;

        return (
          <Box
            key={c.id}
            component="img"
            src="/images/salamander-small.png"    // put a small salamander sprite here
            alt="salamander"
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: `${c.size}px`,
              height: "auto",
              pointerEvents: "none",
              animation: `${drift} ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        );
      })}
    </>
  );
}