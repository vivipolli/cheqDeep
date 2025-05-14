'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import GradientButton from './GradientButton';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="CheqDeep Logo"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
            <span className="text-2xl font-space-grotesk font-semibold text-[#1F2B50] dark:text-white">
              CheqDeep
            </span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/certify" className="text-gray-600 dark:text-gray-300 hover:text-[#1F2B50] dark:hover:text-white transition-colors">
              Certify
            </Link>
            <Link href="/verify" className="text-gray-600 dark:text-gray-300 hover:text-[#1F2B50] dark:hover:text-white transition-colors">
              Verify
            </Link>
            <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-[#1F2B50] dark:hover:text-white transition-colors">
              How It Works
            </Link>
            {isHomePage && (
              <GradientButton href="/certify">
                Get Started
              </GradientButton>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link
              href="/certify"
              className="block text-gray-600 dark:text-gray-300 hover:text-[#1F2B50] dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Certify
            </Link>
            <Link
              href="/verify"
              className="block text-gray-600 dark:text-gray-300 hover:text-[#1F2B50] dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Verify
            </Link>
            <Link
              href="#how-it-works"
              className="block text-gray-600 dark:text-gray-300 hover:text-[#1F2B50] dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            {isHomePage && (
              <div className="pt-2">
                <GradientButton href="/certify" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </GradientButton>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
} 