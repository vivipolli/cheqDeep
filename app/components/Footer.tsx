import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-space-grotesk font-semibold text-[#1F2B50] mb-4">DeepCheq</h3>
            <p className="font-manrope">
              Certify the authenticity of your media with blockchain-powered verification.
            </p>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-semibold text-[#1F2B50] mb-4">Product</h4>
            <ul className="space-y-2 font-manrope">
              <li><Link href="/certify" className="hover:text-[#1F2B50] transition-colors">Certify Media</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[#1F2B50] transition-colors">How It Works</Link></li>
              <li><Link href="#use-cases" className="hover:text-[#1F2B50] transition-colors">Use Cases</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-semibold text-[#1F2B50] mb-4">Resources</h4>
            <ul className="space-y-2 font-manrope">
              <li><Link href="#" className="hover:text-[#1F2B50] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-[#1F2B50] transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-[#1F2B50] transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-space-grotesk font-semibold text-[#1F2B50] mb-4">Connect</h4>
            <ul className="space-y-2 font-manrope">
              <li><Link href="#" className="hover:text-[#1F2B50] transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-[#1F2B50] transition-colors">LinkedIn</Link></li>
              <li><Link href="#" className="hover:text-[#1F2B50] transition-colors">GitHub</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center font-manrope">
          <p>© {new Date().getFullYear()} DeepCheq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 