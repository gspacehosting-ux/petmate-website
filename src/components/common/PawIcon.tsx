import React from 'react';

interface PawIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const PawIcon: React.FC<PawIconProps> = ({ className = 'w-6 h-6', size = 24, color = '#F4770B' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main pad */}
      <ellipse cx="12" cy="15.5" rx="4.8" ry="3.8" />
      {/* Outer left toe */}
      <ellipse cx="5.8" cy="10" rx="2.2" ry="3" transform="rotate(-18 5.8 10)" />
      {/* Inner left toe */}
      <ellipse cx="9.8" cy="6.8" rx="2.2" ry="3" transform="rotate(-6 9.8 6.8)" />
      {/* Inner right toe */}
      <ellipse cx="14.2" cy="6.8" rx="2.2" ry="3" transform="rotate(6 14.2 6.8)" />
      {/* Outer right toe */}
      <ellipse cx="18.2" cy="10" rx="2.2" ry="3" transform="rotate(18 18.2 10)" />
    </svg>
  );
};
