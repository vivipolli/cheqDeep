import MediaUpload from '../components/MediaUpload'

export default function Certify() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1F2B50] mb-6">
            Certify Your Media&apos;s Authenticity
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of your photos and videos with our decentralized platform
          </p>
        </div>

        <div className="bg-[#1F2B50]/5 p-6 rounded-lg mb-8">
          <h2 className="font-poppins text-xl font-semibold mb-4 text-[#1F2B50]">
            Important Requirements
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-[#2ECC71] mr-2">•</span>
              <span className="text-gray-700">
                <strong>Device Origin:</strong> The media file must be uploaded from the same device where it was originally created. For example, if a photo was taken with your smartphone, it must be uploaded from that same smartphone for validation.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#2ECC71] mr-2">•</span>
              <span className="text-gray-700">
                <strong>Original File:</strong> Do not edit, modify, or compress the file before uploading. The original file is required for accurate verification.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#2ECC71] mr-2">•</span>
              <span className="text-gray-700">
                <strong>Metadata Preservation:</strong> Ensure that the file&apos;s metadata (EXIF data for images, codec information for videos) is preserved during transfer.
              </span>
            </li>
          </ul>
        </div>
        
        <MediaUpload />
      </div>
    </main>
  )
} 