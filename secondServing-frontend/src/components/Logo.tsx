interface LogoProps {
  className?: string;  // Allow className as an optional prop
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img
      src="/public/Images/logo.png"  // Path to your logo
      alt="Logo"
      className={className}  // Apply the className to the img element
    />
  );
}

export default Logo;
