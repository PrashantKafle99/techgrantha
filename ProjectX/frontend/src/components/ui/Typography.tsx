import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  children, 
  className = '', 
  as 
}) => {
  const baseClasses = {
    h1: 'font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight',
    h2: 'font-serif text-3xl md:text-4xl lg:text-5xl font-normal leading-tight',
    h3: 'font-serif text-2xl md:text-3xl lg:text-4xl font-normal leading-tight',
    h4: 'font-serif text-xl md:text-2xl lg:text-3xl font-normal leading-tight',
    h5: 'font-serif text-lg md:text-xl lg:text-2xl font-normal leading-tight',
    h6: 'font-serif text-base md:text-lg lg:text-xl font-normal leading-tight',
    body: 'font-sans text-base leading-relaxed font-normal',
    caption: 'font-sans text-sm text-gray-600 font-normal',
  };

  // Map variants to appropriate HTML elements
  const elementMap = {
    h1: 'h1',
    h2: 'h2', 
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body: 'p',
    caption: 'span',
  };

  const Component = as || elementMap[variant];
  const classes = `${baseClasses[variant]} ${className}`;

  return React.createElement(Component, { className: classes }, children);
};

export default Typography;