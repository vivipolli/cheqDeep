import Link from 'next/link';
import { ReactNode } from 'react';

interface GradientButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function GradientButton({ 
  href, 
  onClick, 
  children, 
  className = '',
  type = 'button',
  disabled = false
}: GradientButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#1F2B50] to-[#2ECC71] text-white px-6 py-3 rounded-lg font-manrope font-medium hover:shadow-lg hover:shadow-[#2ECC71]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  if (href) {
    return (
      <Link 
        href={href} 
        className={`${baseClasses} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
} 