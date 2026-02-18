// components/common/UI/Button.jsx
export const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  fullWidth = false,        // PROP: ancho completo en móvil
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

  // ✅ Tamaños responsivos: más compactos en móvil, igual que antes en desktop
  const sizes = {
    sm: "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm",
    md: "px-3 py-1.5 text-sm sm:px-4 sm:py-2.5 sm:text-sm",
    lg: "px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-base"
  };

  // ✅ Clase para ancho completo en móvil (opcional)
  const widthClass = fullWidth ? "w-full sm:w-auto" : "";

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && (
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> // ✅ Ícono responsive
      )}
      {children}
    </button>
  );
};