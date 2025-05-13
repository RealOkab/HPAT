import React, { MouseEventHandler } from "react";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
}
export default function Buttons({
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button className={className} {...props} onClick={onClick}>
      {children}
    </button>
  );
}
