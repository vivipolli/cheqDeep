'use client';

import { MediaAnalysis } from '../services/mediaAnalysis';

interface AnalysisResultProps {
  analysis: MediaAnalysis;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <div className="mt-8 p-6 bg-[#f4e6e4] rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-poppins font-semibold">Analysis Results</h3>
        <div className={`px-4 py-2 rounded-full ${
          analysis.isAuthentic 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {analysis.isAuthentic ? 'Authentic' : 'Potentially Altered'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Confidence Level</span>
          <div className="w-48 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#fe5602] h-2.5 rounded-full" 
              style={{ width: `${analysis.confidence * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-poppins font-semibold mb-2">File Information</h4>
            <div className="space-y-2">
              <p><span className="text-gray-600">Type:</span> {analysis.metadata.fileType}</p>
              <p><span className="text-gray-600">Size:</span> {(analysis.metadata.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              {analysis.metadata.creationDate && (
                <p><span className="text-gray-600">Created:</span> {formatDate(analysis.metadata.creationDate)}</p>
              )}
              {analysis.metadata.resolution && (
                <p><span className="text-gray-600">Resolution:</span> {analysis.metadata.resolution}</p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-poppins font-semibold mb-2">Device Information</h4>
            <div className="space-y-2">
              {analysis.metadata.deviceInfo ? (
                <p>{analysis.metadata.deviceInfo}</p>
              ) : (
                <p className="text-gray-500">No device information available</p>
              )}
              {analysis.metadata.location && (
                <p><span className="text-gray-600">Location:</span> {analysis.metadata.location}</p>
              )}
              {analysis.metadata.software && (
                <p><span className="text-gray-600">Software:</span> {analysis.metadata.software}</p>
              )}
            </div>
          </div>
        </div>

        {analysis.warnings.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-poppins font-semibold mb-2 text-yellow-800">Warnings</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-700">{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 