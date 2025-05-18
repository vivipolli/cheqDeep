import MediaUpload from '../components/MediaUpload'

export default function Certify() {
  return (
    <div className="min-h-screen">
      <main className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-space-grotesk text-6xl font-semibold mb-6 leading-tight text-[#1F2B50]">
                Certify Your Media&apos;s Authenticity
              </h1>
              <p className="font-manrope text-xl text-gray-600 max-w-2xl mx-auto">
                Verify the authenticity of your photos and videos with our decentralized platform
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1F2B50]/5 to-[#2ECC71]/5 p-8 rounded-xl shadow-sm mb-12">
              <h2 className="font-space-grotesk text-2xl font-semibold mb-6 text-[#1F2B50]">
                Important Requirements
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk font-semibold mb-2 text-[#1F2B50]">Device Origin</h3>
                    <p className="text-gray-700">
                      The media file must be uploaded from the same device where it was originally created. For example, if a photo was taken with your smartphone, it must be uploaded from that same smartphone for validation.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk font-semibold mb-2 text-[#1F2B50]">Original File</h3>
                    <p className="text-gray-700">
                      Do not edit, modify, or compress the file before uploading. The original file is required for accurate verification.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk font-semibold mb-2 text-[#1F2B50]">Metadata Preservation</h3>
                    <p className="text-gray-700">
                      Ensure that the file&apos;s metadata (EXIF data for images, codec information for videos) is preserved during transfer.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <MediaUpload />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 