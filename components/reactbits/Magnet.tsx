"use client";

import React, { useRef, useState, useCallback } from "react";

interface MagnetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
}

export default function Magnet({
  children,
  className = "",
  padding = 40,
  disabled = false,
  magnetStrength = 0.25,
  ...props
}: MagnetProps) {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        const moveX = (e.clientX - centerX) * magnetStrength;
        const moveY = (e.clientY - centerY) * magnetStrength;
        setPosition({ x: moveX, y: moveY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    },
    [disabled, padding, magnetStrength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0
          ? "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "transform 100ms ease-out",
        display: "inline-block",
        willChange: "transform",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
