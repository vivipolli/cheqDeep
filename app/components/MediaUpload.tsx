'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeMedia, MediaAnalysis } from '../services/mediaAnalysis';
import AnalysisResult from '../components/AnalysisResult';
import Image from 'next/image';

export default function MediaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MediaAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setIsAnalyzing(true);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const result = await analyzeMedia(file);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing media:', error);
        setAnalysis({
          isAuthentic: false,
          confidence: 0,
          metadata: {
            fileSize: file.size,
            fileType: file.type,
          },
          warnings: ['Failed to analyze media file'],
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, []);

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
            </div>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#fe5602] border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Analyzing media...</p>
        </div>
      )}

      {preview && (
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

      {analysis && <AnalysisResult analysis={analysis} />}
    </div>
  );
} 