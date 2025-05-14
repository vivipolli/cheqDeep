'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import GradientButton from './GradientButton';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
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
            <span className="text-2xl font-space-grotesk font-semibold text-[#1F2B50]">
              CheqDeep
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/certify" className="text-gray-600 hover:text-[#1F2B50] transition-colors">
              Certify
            </Link>
            <Link href="/verify" className="text-gray-600 hover:text-[#1F2B50] transition-colors">
              Verify
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-[#1F2B50] transition-colors">
              How It Works
            </Link>
            {isHomePage && (
              <GradientButton href="/certify">
                Get Started
              </GradientButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 