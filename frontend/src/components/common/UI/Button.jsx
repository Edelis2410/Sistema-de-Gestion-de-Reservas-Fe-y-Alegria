// components/common/UI/Button.jsx
export const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-blue-500 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "bg-transparent border border-transparent text-slate-700 hover:bg-slate-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </button>
  );
};