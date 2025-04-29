import MediaUpload from './components/MediaUpload'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#fe5602]">
            CheqDigit
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of your photos and videos with our decentralized platform
          </p>
        </div>
        
        <MediaUpload />
      </div>
    </main>
  )
}
