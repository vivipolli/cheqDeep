import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import GradientButton from './components/GradientButton';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen text-gray-900">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-b from-[#1F2B50]/5 to-transparent">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <h1 className="font-space-grotesk text-6xl font-semibold mb-6 leading-tight text-[#1F2B50]">
                    Verify Your Media&apos;s Authenticity
                  </h1>
                  <p className="font-manrope text-xl mb-12 max-w-2xl text-gray-600">
                    DeepCheq uses blockchain technology to create immutable proof of your media&apos;s authenticity
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <GradientButton href="/certify" className="px-8 py-4">
                      Upload and Certify Now
                    </GradientButton>
                    <Link 
                      href="#how-it-works" 
                      className="inline-flex items-center justify-center gap-2 bg-[#1F2B50]/10 text-[#1F2B50] px-8 py-4 rounded-lg font-manrope font-medium hover:bg-[#1F2B50]/20 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/hero_img.png"
                    alt="Media Authentication"
                    width={600}
                    height={600}
                    className="w-full h-auto rounded-2xl shadow-lg"
                    priority
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    AI-generated image by Midjourney
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-space-grotesk text-4xl font-semibold text-center mb-16 text-[#1F2B50]">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#2ECC71]/20 -translate-y-1/2" />
              
              {[
                {
                  number: '01',
                  title: 'Upload your image or video',
                  description: 'Simply drag and drop your media file'
                },
                {
                  number: '02',
                  title: 'We analyze metadata and technical integrity',
                  description: 'Deep analysis of your media content'
                },
                {
                  number: '03',
                  title: 'A digital certificate is issued',
                  description: 'With a verifiable identifier'
                },
                {
                  number: '04',
                  title: 'Share the verification',
                  description: 'Publicly accessible proof of authenticity'
                }
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative z-10 transform hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1F2B50] to-[#2ECC71] flex items-center justify-center text-white font-space-grotesk font-semibold text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    <h3 className="font-space-grotesk text-xl font-semibold mb-2 text-[#1F2B50] group-hover:text-[#2ECC71] transition-colors duration-300">{step.title}</h3>
                    <p className="font-manrope text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-space-grotesk text-4xl font-semibold mb-6 text-[#1F2B50]">
                In a world flooded with manipulated content, how can we trace what&apos;s real?
              </h2>
              <p className="font-manrope text-xl text-gray-600">
                DeepCheq doesn&apos;t detect AI — it certifies media that has traceable authenticity.
              </p>
            </div>
          </div>
        </section>

        {/* Certificate of Veracity */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-space-grotesk text-4xl font-semibold text-center mb-16 text-[#1F2B50]">
              The Certificate of Veracity
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="font-space-grotesk text-2xl font-semibold mb-6 text-[#1F2B50]">Verifiable Credential</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2ECC71]/20 flex items-center justify-center">
                      <span className="text-[#2ECC71] text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="font-space-grotesk font-semibold mb-1 text-[#1F2B50]">Timestamped verification</h4>
                      <p className="text-gray-600">Exact creation time recorded on the blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2ECC71]/20 flex items-center justify-center">
                      <span className="text-[#2ECC71] text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="font-space-grotesk font-semibold mb-1 text-[#1F2B50]">Unique identifier (DID)</h4>
                      <p className="text-gray-600">Decentralized identifier for your media</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2ECC71]/20 flex items-center justify-center">
                      <span className="text-[#2ECC71] text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="font-space-grotesk font-semibold mb-1 text-[#1F2B50]">Content hash verification</h4>
                      <p className="text-gray-600">Cryptographic proof of content integrity</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-space-grotesk text-2xl font-semibold mb-6 text-[#1F2B50]">Use Cases</h3>
                <ul className="space-y-6">
                  {[
                    'Journalism and news verification',
                    'Legal evidence documentation',
                    'Digital art authentication',
                    'Content creator credibility'
                  ].map((useCase, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                      <span className="font-manrope text-lg text-gray-600">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases & Testimonials */}
        <section id="use-cases" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-space-grotesk text-4xl font-semibold text-center mb-16 text-[#1F2B50]">
              Real World Applications
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Journalism',
                  description: 'A journalist certifying a video from their phone',
                  icon: '📱'
                },
                {
                  title: 'Photography',
                  description: 'A photographer proving authorship of their work',
                  icon: '📸'
                },
                {
                  title: 'Social Media',
                  description: 'A platform verifying the source of viral images',
                  icon: '🌐'
                }
              ].map((useCase, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="font-space-grotesk text-xl font-semibold mb-2 text-[#1F2B50]">{useCase.title}</h3>
                  <p className="font-manrope text-gray-600">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA & Newsletter */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-space-grotesk text-4xl font-semibold mb-6 text-[#1F2B50]">
                Certify your content now and build trust with your audience.
              </h2>
              <GradientButton href="/certify" className="px-8 py-4 mb-12">
                Start Certifying
              </GradientButton>
              
              <div className="max-w-md mx-auto">
                <h3 className="font-space-grotesk text-xl font-semibold mb-4 text-[#1F2B50]">
                  Stay informed on media integrity
                </h3>
                <p className="font-manrope text-gray-600 mb-6">
                  Get updates on digital identity and Web3 tools.
                </p>
                <form className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2ECC71]"
                  />
                  <GradientButton type="submit">
                    Subscribe
                  </GradientButton>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
