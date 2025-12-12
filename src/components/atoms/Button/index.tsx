import { StyledButton } from "./Button.styles";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function Button({ label, ...props }: ButtonProps) {
  return <StyledButton {...props}>{label}</StyledButton>;
}
