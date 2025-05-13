'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ResourceMetadata {
  resourceURI: string;
  resourceName: string;
  resourceType: string;
  mediaType: string;
  resourceVersion: string;
  created: string;
  checksum: string;
  metadata?: {
    thumbnailUrl?: string;
  };
}

interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyBase58: string;
}

interface DIDDocument {
  '@context': string[];
  id: string;
  controller: string[];
  verificationMethod: VerificationMethod[];
  authentication: string[];
}

interface VerificationResponse {
  '@context': string;
  didDocument: DIDDocument;
  didResolutionMetadata: {
    contentType: string;
    retrieved: string;
    did: {
      didString: string;
      methodSpecificId: string;
      method: string;
    };
  };
  didDocumentMetadata: {
    created: string;
    versionId: string;
    linkedResourceMetadata: ResourceMetadata[];
  };
}

export default function Verify() {
  const [did, setDid] = useState('');
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Verifying DID:', did);
      const response = await fetch(`/api/resource/search/${did}`);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Certificate not found');
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      setVerification(data);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify certificate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1F2B50] mb-6">
            Verify Media Certificate
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a DID to verify the authenticity of a media certificate
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="did" className="block text-sm font-medium text-gray-700 mb-2">
                Decentralized Identifier (DID)
              </label>
              <input
                type="text"
                id="did"
                value={did}
                onChange={(e) => setDid(e.target.value)}
                placeholder="did:cheqd:testnet:..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F2B50] text-white py-2 px-4 rounded-lg hover:bg-[#1F2B50]/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {verification && (
          <div className="space-y-8">
            <div className="bg-[#1F2B50]/5 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#1F2B50] mb-4">Certificate Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">DID</h3>
                  <p className="font-mono text-sm break-all">{verification.didDocument.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="text-sm">{new Date(verification.didDocumentMetadata.created).toLocaleString()}</p>
                </div>
                {verification.didDocumentMetadata.linkedResourceMetadata.map((resource, index) => (
                  <div key={index} className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-500">Resource {index + 1}</h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm"><span className="font-medium">Name:</span> {resource.resourceName}</p>
                      <p className="text-sm"><span className="font-medium">Type:</span> {resource.resourceType}</p>
                      <p className="text-sm"><span className="font-medium">Created:</span> {new Date(resource.created).toLocaleString()}</p>
                      <p className="text-sm"><span className="font-medium">Checksum:</span> <span className="font-mono break-all">{resource.checksum}</span></p>
                      
                      {/* Media Preview */}
                      {resource.metadata?.thumbnailUrl && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-[#1F2B50] mb-2">Media Preview</h4>
                          <div className="bg-white p-4 rounded-lg">
                            <img 
                              src={resource.metadata.thumbnailUrl} 
                              alt="Media preview" 
                              className="max-w-full h-auto rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1F2B50]/5 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#1F2B50] mb-4">Verification Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Verification Method</h3>
                  {verification.didDocument.verificationMethod.map((method, index) => (
                    <div key={index} className="mt-2">
                      <p className="text-sm"><span className="font-medium">Type:</span> {method.type}</p>
                      <p className="text-sm"><span className="font-medium">Public Key:</span> <span className="font-mono break-all">{method.publicKeyBase58}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 