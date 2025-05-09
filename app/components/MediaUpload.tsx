'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeMedia, MediaAnalysis } from '../services/mediaAnalysis';
import { generateFileHash } from '../services/hashService';
import { createDID } from '../services/didService';
import { createResource, DIDResource } from '../services/resourceService';
import AnalysisResult from '../components/AnalysisResult';
import Image from 'next/image';
import { DIDDocument } from '../types/did';

export default function MediaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MediaAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hash, setHash] = useState<string>('');
  const [did, setDid] = useState<DIDDocument | null>(null);
  const [resource, setResource] = useState<DIDResource | null>(null);
  const [mediaMetadata, setMediaMetadata] = useState<{ width?: number; height?: number; duration?: number }>({});
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setIsAnalyzing(true);
    setError(null);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        
        // Get media dimensions
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.onload = () => {
            setMediaMetadata({
              width: img.naturalWidth,
              height: img.naturalHeight
            });
          };
          img.src = result;
        } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.onloadedmetadata = () => {
            setMediaMetadata({
              width: video.videoWidth,
              height: video.videoHeight,
              duration: video.duration
            });
          };
          video.src = result;
        }
      };
      reader.readAsDataURL(file);

      try {
        // Analyze media using Python API
        const result = await analyzeMedia(file);
        setAnalysis(result);

        if (!result.isAuthentic) {
          setError('No device information found. Please upload the original file directly from your camera or smartphone.');
          setIsAnalyzing(false);
          return;
        }

        // Generate file hash
        const fileHash = await generateFileHash(file);
        setHash(fileHash);

        // Create DID
        const didDocument = await createDID();
        setDid(didDocument);

        // Create resource with hash and metadata
        const didResource = await createResource(
          didDocument.did,
          JSON.stringify({
            hash: fileHash,
            metadata: {
              title: file.name,
              description: 'Media authenticity verification',
              fileType: file.type,
              fileSize: file.size,
              exifData: {
                creationDate: result.metadata.DateTimeOriginal || result.metadata.CreateDate,
                deviceInfo: result.metadata.deviceInfo,
                location: result.metadata.location,
                resolution: result.metadata.resolution,
                software: result.metadata.software
              }
            }
          }),
          {
            title: file.name,
            description: 'Media authenticity verification',
            fileType: file.type,
            fileSize: file.size,
            hash: fileHash,
            exifData: {
              creationDate: result.metadata.DateTimeOriginal || result.metadata.CreateDate,
              deviceInfo: result.metadata.deviceInfo,
              location: result.metadata.location,
              resolution: result.metadata.resolution,
              software: result.metadata.software
            }
          }
        );
        setResource(didResource);
      } catch (error) {
        console.error('Error processing file:', error);
        setError('Error processing media file. Please try again with the original file.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, [mediaMetadata]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'video/*': ['.mp4', '.mov']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#fe5602] bg-[#f4e6e4]' : 'border-gray-300 hover:border-[#fe5602]'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-4xl">📸</div>
          {isDragActive ? (
            <p className="text-[#fe5602] font-manrope">Drop your file here...</p>
          ) : (
            <div className="space-y-2">
              <h3 className="font-poppins text-xl font-semibold">Upload your media</h3>
              <p className="font-manrope text-gray-600">
                Drag and drop your image or video here, or click to select files
              </p>
              <p className="font-manrope text-sm text-gray-500">
                Supported formats: JPG, PNG, MP4, MOV
              </p>
              <p className="font-manrope text-sm text-gray-500 mt-2">
                ⚠️ Only original media from capture devices is accepted
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-manrope">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Current limitations: Cannot verify edited media (e.g., Photoshop) or professional camera exports.
            This functionality will be implemented in future versions.
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#fe5602] border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Analyzing media...</p>
        </div>
      )}

      {preview && !error && (
        <div className="mt-6">
          <h4 className="font-poppins text-lg font-semibold mb-2">Preview</h4>
          <div className="bg-[#f4e6e4] rounded-lg p-4">
            {file?.type.startsWith('image/') ? (
              <div className="relative w-full h-64">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain rounded"
                />
              </div>
            ) : (
              <video src={preview} controls className="max-h-64 mx-auto rounded" />
            )}
          </div>
        </div>
      )}

      {analysis && !error && <AnalysisResult analysis={analysis} />}

      {hash && !error && (
        <div className="mt-6">
          <h4 className="font-poppins text-lg font-semibold mb-2">Media Hash</h4>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-mono text-sm break-all">{hash}</p>
          </div>
        </div>
      )}

      {did && !error && (
        <div className="mt-6">
          <h4 className="font-poppins text-lg font-semibold mb-2">DID Document</h4>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-mono text-sm break-all">DID: {did.did}</p>
          </div>
        </div>
      )}

      {resource && !error && (
        <div className="mt-6">
          <h4 className="font-poppins text-lg font-semibold mb-2">Verification Certificate</h4>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-mono text-sm break-all">URI: {resource.resourceURI}</p>
            <p className="font-mono text-sm break-all mt-2">Type: {resource.resourceType}</p>
            <p className="font-mono text-sm break-all mt-2">Version: {resource.resourceVersion}</p>
            <p className="font-mono text-sm break-all mt-2">Checksum: {resource.checksum}</p>
            <p className="font-mono text-sm break-all mt-2">Created: {resource.created}</p>
          </div>
        </div>
      )}
    </div>
  );
} 