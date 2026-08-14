import React from "react";
import styles from "./ShinyText.module.css";

interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export default function ShinyText({
  children,
  className = "",
  speed = 5,
  ...props
}: ShinyTextProps) {
  return (
    <span
      className={`${styles.shinyText} ${className}`}
      style={{ animationDuration: `${speed}s` }}
      {...props}
    >
      {children}
    </span>
  );
}
