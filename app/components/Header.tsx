import Link from 'next/link';
import GradientButton from './GradientButton';

export default function Header() {
  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-space-grotesk font-semibold text-[#1F2B50]">
            DeepCheq
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
            <Link href="#use-cases" className="text-gray-600 hover:text-[#1F2B50] transition-colors">
              Use Cases
            </Link>
            <GradientButton href="/certify">
              Get Started
            </GradientButton>
          </nav>
        </div>
      </div>
    </header>
  );
} 