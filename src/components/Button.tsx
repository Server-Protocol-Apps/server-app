import { FC } from "react";

export const Button: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button className="btn-primary" {...props}>
    {children}
  </button>
);
