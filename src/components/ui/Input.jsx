const Input = ({ 
  id, 
  label, 
  type = "text", 
  placeholder = "", 
  value, 
  onChange, 
  error,
  icon: Icon,
  labelClassName = "text-gray-700", // Tambahkan default labelClassName
  inputClassName = "border-gray-300", // Tambahkan default inputClassName
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 ${Icon ? 'pl-10' : ''} rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
            error ? 'border-red-500 bg-red-50' : inputClassName
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;