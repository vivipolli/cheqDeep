import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="CheqDeep Logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <h3 className="text-2xl font-space-grotesk font-semibold text-[#1F2B50]">CheqDeep</h3>
            </div>
            <p className="font-manrope">
              Certify the authenticity of your media with blockchain-powered verification.
            </p>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-semibold text-[#1F2B50] mb-4">Product</h4>
            <ul className="space-y-2 font-manrope">
              <li><Link href="/certify" className="hover:text-[#1F2B50] transition-colors">Certify Media</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[#1F2B50] transition-colors">How It Works</Link></li>
              <li><Link href="/verify" className="hover:text-[#1F2B50] transition-colors">Verify Media</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center font-manrope">
          <p>© {new Date().getFullYear()} CheqDeep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 