import React from 'react';

const Textarea = React.forwardRef(({ 
  className = "", 
  rows = 4,
  placeholder = "",
  value,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full px-4 py-3 
        border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
        resize-none transition-all duration-200
        text-sm leading-relaxed
        placeholder:text-gray-500
        hover:border-gray-400
        ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };