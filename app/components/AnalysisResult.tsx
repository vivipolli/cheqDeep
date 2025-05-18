'use client';

import { MediaAnalysis } from '../services/mediaAnalysis';

interface AnalysisResultProps {
  analysis: MediaAnalysis;
  fileType?: string;
}

export default function AnalysisResult({ analysis, fileType }: AnalysisResultProps) {
  return (
    <div className="mt-6">
      <h4 className="font-poppins text-lg font-semibold mb-4">Media Analysis</h4>
      <div className="bg-gray-100 p-6 rounded-lg space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(analysis.metadata.Make || analysis.metadata.Model || analysis.metadata.software) && (
            <div className="space-y-4">              
              <h5 className="font-semibold text-[#1F2B50] mb-3">Device Information</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.metadata.Make && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-sm">Make</span>
                    <span className="mt-1">{analysis.metadata.Make}</span>
                  </div>
                )}
                {analysis.metadata.Model && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-sm">Model</span>
                    <span className="mt-1">{analysis.metadata.Model}</span>
                  </div>
                )}
                {analysis.metadata.software && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-sm">Software</span>
                    <span className="mt-1">{analysis.metadata.software}</span>
                  </div>
                )}
              </div>        
            </div>
          )}

          <div className="space-y-4">
            <h5 className="font-semibold text-[#1F2B50] mb-3">Media Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">Resolution</span>
                <span className="mt-1">{analysis.metadata.resolution}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">File Size</span>
                <span className="mt-1">{(analysis.metadata.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              {analysis.metadata.DateTimeOriginal && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Date Created</span>
                  <span className="mt-1">{analysis.metadata.DateTimeOriginal}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {(analysis.metadata.GPSLatitude || analysis.metadata.GPSLongitude) && (
          <div className="space-y-4">
            <h5 className="font-semibold text-[#1F2B50] mb-3">Location</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysis.metadata.GPSLatitude && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Latitude</span>
                  <span className="mt-1">{analysis.metadata.GPSLatitude}</span>
                </div>
              )}
              {analysis.metadata.GPSLongitude && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Longitude</span>
                  <span className="mt-1">{analysis.metadata.GPSLongitude}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {fileType?.startsWith('video/') && (
          <div className="space-y-4">
            <h5 className="font-semibold text-[#1F2B50] mb-3">Video Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.metadata.duration && analysis.metadata.duration !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Duration</span>
                  <span className="mt-1">{analysis.metadata.duration}</span>
                </div>
              )}
              {analysis.metadata.bitrate && analysis.metadata.bitrate !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Bitrate</span>
                  <span className="mt-1">{analysis.metadata.bitrate}</span>
                </div>
              )}
              {analysis.metadata.codec && analysis.metadata.codec !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Codec</span>
                  <span className="mt-1">{analysis.metadata.codec}</span>
                </div>
              )}
              {analysis.metadata.fps && analysis.metadata.fps !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">FPS</span>
                  <span className="mt-1">{analysis.metadata.fps}</span>
                </div>
              )}
              {analysis.metadata.creation_date && analysis.metadata.creation_date !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Created</span>
                  <span className="mt-1">{analysis.metadata.creation_date}</span>
                </div>
              )}
              {analysis.metadata.last_modification && analysis.metadata.last_modification !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Modified</span>
                  <span className="mt-1">{analysis.metadata.last_modification}</span>
                </div>
              )}
              {analysis.metadata.producer && analysis.metadata.producer !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Producer</span>
                  <span className="mt-1">{analysis.metadata.producer}</span>
                </div>
              )}
              {analysis.metadata.copyright && analysis.metadata.copyright !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Copyright</span>
                  <span className="mt-1">{analysis.metadata.copyright}</span>
                </div>
              )}
              {analysis.metadata.comment && analysis.metadata.comment !== 'unknown' && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Comment</span>
                  <span className="mt-1">{analysis.metadata.comment}</span>
                </div>
              )}
            </div>

            {(analysis.metadata.operating_system || analysis.metadata.os_version) && (
              <div className="mt-6 space-y-4">
                <h6 className="font-semibold text-[#1F2B50] mb-3">System Information</h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analysis.metadata.operating_system && analysis.metadata.operating_system !== 'unknown' && (
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">OS</span>
                      <span className="mt-1">{analysis.metadata.operating_system}</span>
                    </div>
                  )}
                  {analysis.metadata.os_version && analysis.metadata.os_version !== 'unknown' && (
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Version</span>
                      <span className="mt-1">{analysis.metadata.os_version}</span>
                    </div>
                  )}
                  {analysis.metadata.os_release && analysis.metadata.os_release !== 'unknown' && (
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Release</span>
                      <span className="mt-1">{analysis.metadata.os_release}</span>
                    </div>
                  )}
                  {analysis.metadata.os_architecture && analysis.metadata.os_architecture !== 'unknown' && (
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm">Architecture</span>
                      <span className="mt-1">{analysis.metadata.os_architecture}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <h5 className="font-semibold text-[#1F2B50] mb-3">Verification</h5>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center">
              <span className="text-gray-600 text-sm mr-2">Status:</span>
              <span className={`px-3 py-1 rounded ${
                analysis.isAuthentic 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {analysis.isAuthentic ? 'Authentic' : 'Not Verified'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 text-sm mr-2">Confidence:</span>
              <span>{(analysis.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 